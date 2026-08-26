#!/usr/bin/env node
/**
 * wiki-lint.js — LLM Wiki 자동 건강검진
 *
 * 기계가 판정할 수 있는 것만 돌린다. 나머지는 "미실행" 으로 표기한다.
 *   L1 모순      canon.json 에 선언된 수치가 페이지마다 다른가   ← 선언 없으면 미실행
 *   L2 stale     헤더 `캐시 fetch YYYY-MM-DD` < 본문 최신 날짜
 *   L3 고아      인바운드 링크 0 (진입점 파일은 면제)
 *   L5 끊긴 링크  상대경로 링크가 가리키는 파일 부재
 *   L8 인덱스     index.md 에 등재되지 않은 페이지
 *   L9 중복 사본  같은 내용이 두 경로에 있다 (값 중복 금지)
 *   LOG          `## [YYYY-MM-DD] verb | 제목` 표기 준수
 *
 * 🔴 L4(누락 개념) · L6(데이터 갭) · L7(역방향 드리프트) 는 판정하지 않는다 — 사람이 본다.
 *
 * 사용: node wiki-lint.js <wiki-root> [--all] [--canon <file>] [--json <out>]
 *   종료 코드  0 차단 없음 / 1 🔴 차단 / 2 실행 오류
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const val = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const root = path.resolve(argv.find((a) => !a.startsWith('--') &&
  argv[argv.indexOf(a) - 1] !== '--canon' && argv[argv.indexOf(a) - 1] !== '--json') || '.');

if (!fs.existsSync(root)) { console.error(`경로 없음: ${root}`); process.exit(2); }

/* 진입점 — 인바운드 링크가 없어도 고아가 아니다 */
const ENTRY = new Set(['index.md', 'log.md', 'lint.md', 'synthesis.md',
                       'README.md', 'SKILL.md', 'CLAUDE.md']);
const SKIP = new Set(['node_modules', '.git', 'qa', 'dist', '.playwright-mcp']);
if (!flag('--all')) SKIP.add('preview');

/* ── 수집 — 심볼릭 링크를 따라가되 realpath 로 중복을 제거한다 ──────── */
const seen = new Map();                 // realpath -> 표시 경로
const pages = [];
function walk(dir, depth) {
  if (depth > 6) return;
  let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents.sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.name.startsWith('.') || SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    let st; try { st = fs.statSync(p); } catch { continue; }
    if (st.isDirectory()) { walk(p, depth + 1); continue; }
    if (!e.name.endsWith('.md')) continue;
    const real = fs.realpathSync(p);
    if (seen.has(real)) continue;       // 같은 실체를 두 번 세지 않는다
    seen.set(real, p);
    pages.push(p);
  }
}
/* wiki/ 를 먼저 걸어야 표시 경로가 wiki/ 기준으로 잡힌다 */
for (const r of ['wiki', 'raw', 'CLAUDE.md'].map((x) => path.join(root, x))) {
  if (!fs.existsSync(r)) continue;
  fs.statSync(r).isDirectory() ? walk(r, 0)
    : (seen.set(fs.realpathSync(r), r), pages.push(r));
}
if (flag('--all') || !pages.length) walk(root, 0);
if (!pages.length) { console.error(`마크다운 페이지 0개: ${root}`); process.exit(2); }

const rd = (p) => { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } };
const rel = (p) => path.relative(root, p) || path.basename(p);
const body = new Map(pages.map((p) => [p, rd(p)]));
const findings = [];
const skipped = [];
const add = (gate, sev, msg, detail) => findings.push({ gate, sev, msg, detail: detail || null });

/* ── L5 끊긴 링크 + 인바운드 집계 ──────────────────────────────────── */
const LINK = /\]\(((?!https?:|mailto:|#)[^)\s]+)\)/g;
const inbound = new Map(pages.map((p) => [fs.realpathSync(p), 0]));
let linkCount = 0;
for (const p of pages) {
  const dir = path.dirname(p);
  for (const m of body.get(p).matchAll(LINK)) {
    const target = m[1].split('#')[0];
    if (!target) continue;
    linkCount++;
    const abs = path.resolve(dir, target);
    if (!fs.existsSync(abs)) { add('L5', '🔴', `끊긴 링크 — ${rel(p)} → ${target}`); continue; }
    const real = fs.realpathSync(abs);
    if (inbound.has(real)) inbound.set(real, inbound.get(real) + 1);
  }
}

/* ── L3 고아 ───────────────────────────────────────────────────────── */
for (const p of pages) {
  if (ENTRY.has(path.basename(p))) continue;
  if (inbound.get(fs.realpathSync(p)) === 0)
    add('L3', '🟡', `고아 — ${rel(p)} 인바운드 0`);
}

/* ── L8 인덱스 커버리지 ────────────────────────────────────────────── */
const indexFile = pages.find((p) => path.basename(p) === 'index.md');
if (!indexFile) add('L8', '🔴', 'index.md 가 없다 — 카탈로그 없이는 로딩 규율이 성립하지 않는다');
else {
  const idx = body.get(indexFile);
  const missing = pages.filter((p) => p !== indexFile && !ENTRY.has(path.basename(p)) &&
    !idx.includes(path.basename(p)));
  if (missing.length)
    add('L8', '🟡', `index.md 미등재 ${missing.length}건`, missing.slice(0, 10).map(rel).join(' · '));
}

/* ── L9 중복 사본 — 같은 내용이 두 경로에 (값 중복 금지) ───────────── */
const byHash = new Map();
for (const p of pages) {
  const h = crypto.createHash('sha1').update(body.get(p)).digest('hex');
  if (!byHash.has(h)) byHash.set(h, []);
  byHash.get(h).push(p);
}
for (const [, group] of byHash)
  if (group.length > 1)
    add('L9', '🟡', `중복 사본 ${group.length}벌 — ${path.basename(group[0])}`,
        group.map(rel).join(' · '));

/* ── L2 stale ──────────────────────────────────────────────────────── */
const DATE = /20\d\d-\d\d-\d\d/g;
for (const p of pages) {
  const t = body.get(p);
  const stamp = t.split('\n').slice(0, 12).join('\n').match(/캐시 fetch\D{0,4}(20\d\d-\d\d-\d\d)/);
  if (!stamp) continue;
  /* 🔴 mtime 은 쓰지 않는다 — 헤더를 고치는 행위 자체가 mtime 을 바꿔서
     내 수정이 다음 회차에 다시 결함으로 잡히는 무효 수정 루프가 된다.
     본문이 스스로 증언하는 날짜만 근거로 삼는다. 실제 편집 이력은 git 이 답할 문제다. */
  const inText = [...t.matchAll(DATE)].map((m) => m[0]).sort().pop();
  if (inText && inText > stamp[1])
    add('L2', '🟡', `stale — ${rel(p)} 헤더 \`캐시 fetch ${stamp[1]}\` < 본문 최신 ${inText}`);
}

/* ── L1 모순 — canon.json 에 선언된 것만 본다 (오탐 방지) ──────────── */
const canonPath = val('--canon', path.join(root, 'wiki', 'canon.json'));
if (!fs.existsSync(canonPath)) {
  skipped.push(`L1 모순 — canon 선언 없음 (${rel(canonPath)}). 🔴 통과가 아니라 **미실행**이다`);
} else {
  let canon;
  try { canon = JSON.parse(rd(canonPath)); }
  catch (e) { console.error(`canon 파싱 실패: ${e.message}`); process.exit(2); }
  for (const c of canon) {
    const re = new RegExp(`${c.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\*{0,2}(\\d{1,4})\\s*\\*{0,2}${c.unit}`, 'g');
    const hits = new Map();                        // 값 -> Set(파일)
    /* 린트/로그는 위키의 주장이 아니라 위키에 대한 보고다 — 세지 않는다 */
    const scan = pages.filter((p) => !['lint.md', 'log.md'].includes(path.basename(p)))
      .filter((p) => !c.scope || c.scope.some((g) => rel(p).includes(g)));
    for (const p of scan)
      for (const line of body.get(p).split('\n')) {
        /* not — 같은 줄에 이 말이 있으면 동음이의로 보고 세지 않는다 */
        if (c.not && c.not.some((w) => line.includes(w))) continue;
        for (const m of line.matchAll(re)) {
          if (!hits.has(m[1])) hits.set(m[1], new Set());
          hits.get(m[1]).add(rel(p));
        }
      }
    if (!hits.size) { add('L1', '🟡', `canon 미검출 — "${c.term} N${c.unit}" 이 ${c.scope ? 'scope 안에' : '어디에도'} 없다`); continue; }
    const spread = [...hits.entries()].sort((a, b) => b[1].size - a[1].size)
      .map(([v, f]) => `**${v}${c.unit}** (${[...f].slice(0, 3).join(', ')}${f.size > 3 ? ` +${f.size - 3}` : ''})`);
    if (hits.size > 1)
      add('L1', '🔴', `모순 — "${c.term}" 이 ${hits.size}벌${c.expect ? ` · 정본 ${c.expect}${c.unit}` : ' · 정본 미확정'}`,
          spread.join(' · '));
    else if (c.expect && [...hits.keys()][0] !== String(c.expect))
      add('L1', '🔴', `정본 이탈 — "${c.term}" = ${[...hits.keys()][0]}${c.unit}, 정본은 ${c.expect}${c.unit}`,
          spread.join(' · '));
  }
}

/* ── LOG 표기 ──────────────────────────────────────────────────────── */
const logFile = pages.find((p) => path.basename(p) === 'log.md');
if (!logFile) add('LOG', '🟡', 'log.md 가 없다 — 무엇이 최신인지 알 수 없다');
else {
  const bad = body.get(logFile).split('\n').filter((l) => l.startsWith('## '))
    .filter((l) => !/^## \[20\d\d-\d\d-\d\d\] \w+ \| /.test(l));
  if (bad.length) add('LOG', '🟡', `log.md 표기 위반 ${bad.length}건`, bad.slice(0, 3).join(' · '));
}

/* ── 출력 ──────────────────────────────────────────────────────────── */
const ord = { '🔴': 0, '🟡': 1 };
findings.sort((a, b) => ord[a.sev] - ord[b.sev] || a.gate.localeCompare(b.gate));
const block = findings.filter((f) => f.sev === '🔴').length;

console.log(`## wiki-lint — ${root}`);
console.log(`페이지 ${pages.length}개 · 링크 ${linkCount}개\n`);
if (!findings.length) console.log('지적 없음.\n');
else {
  console.log('| 점검 | severity | 내용 |');
  console.log('|---|---|---|');
  for (const f of findings)
    console.log(`| ${f.gate} | ${f.sev} | ${f.msg}${f.detail ? ` — ${f.detail}` : ''} |`);
  console.log('');
}
console.log(`차단(🔴) ${block}건 · 지적(🟡) ${findings.length - block}건`);
for (const s of skipped) console.log(`⏸ 미실행 — ${s}`);
console.log('※ L4(누락 개념) · L6(데이터 갭) · L7(역방향 드리프트) 는 이 스크립트가 판정하지 않는다 — 사람이 본다.');

const out = val('--json');
if (out) {
  fs.writeFileSync(out, JSON.stringify({ root, pages: pages.length, findings, skipped }, null, 2));
  console.log(`\nJSON: ${out}`);
}
process.exit(block ? 1 : 0);
