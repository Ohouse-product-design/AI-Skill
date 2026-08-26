# log — LifeService UXUI 위키 이력

> append-only. 최신이 위. 표기 `## [YYYY-MM-DD] <verb> | <제목>` — verb ∈ `ingest` `query` `lint` `build` `sync`.
> `grep "^## \[" wiki/log.md | tail -5`
> 2026-08-20 이전 항목은 `.lsux/log.json` 에서 이관했다 (원본 유지).

---

## [2026-08-26] lint | 2차 전수 — 차단 1건 유지 · 신규 PROPOSE 2건

`wiki-lint.js` 자동 7종 (51페이지 · 링크 115) → 🔴 **1건**(L1 `재료` 3벌: 13/19/24) · 🟡 0건 · 종료 코드 1.
L2 · L3 · L5 · L8 · L9 · LOG 는 0건. 🔴 **L4 · L6 · L7 은 스크립트 미판정** — 사람 확인 결과 L4 2건 · L6 4건(O-3 · O-4 `open-decisions.md` **미등재**) 여전, **L7 은 정본 미조회로 미실행**.
신규 💬 — 페이지 수가 5곳 3벌(45/50/51) · 린트 요약 수치가 `SKILL.md` 에 복사돼 3벌. 둘 다 규율 2(값은 한 곳) 위반이나 **정본은 고르지 않았다**.
진단만 했다. 고치지 않았다 → [lint.md](lint.md) · [qa-lint.json](qa-lint.json).

## [2026-08-20] query | Notion 정본 재구성안 — 🔴 미반영

요청 5섹션(플로우차트 · 의도 추정 · PRD 생성 지침 · 시스템 지침 · 축별 참조)으로 IA 재편안 작성.
[proposals/notion-restructure.md](proposals/notion-restructure.md). 기존 i~vi 내용은 **하나도 버리지 않고** 매핑했다.
신규 — 1.1 전경 플로우차트 · 1.5 스킬 3종 경계 · **3.x PRD 생성 지침 전체** · 4.3 role 12종 · 5.6 미결 대장 8건.
교정 — 🔧 W4 를 각주에서 표로 승격 · 🔧 레포 구조에 `work-scopes.md`·`hero-kv-prompt.md`·`audit-layout.js` 등재(L7 역방향 드리프트 해소).
🔴 **보존 대상 10개**(`<page>` 7 · `<database>` 1 · `<mention-page>` 2)를 먼저 목록화했다 — 전면 교체 시 하위 페이지가 삭제되기 때문.
🔴 반영은 사람 승인 대기. `allow_deleting_content` 는 켜지 않는다.

## [2026-08-20] build | PRD.md 정보 구조 + 확정 게이트 (`prd-lint.js`)

첨부된 플로우 기준. PRD.md 확정 뒤 **6개 소비자로 fan-out** 하는데 그 앞에 게이트가 없고,
`design-spec`(Figma) ∥ `dev-spec`(코드)이 병렬로 갈라진 뒤 **재합류 지점이 없다** — 이게 QA 공수가 나는 자리.
처방 — ID 4종(`AC` `TERM` `CMP` `MET`)으로 조인 키를 만들고, CMP 표에 **write-back 칸**을 파서 두 파이프라인이 같은 행에서 만나게 한다.
산출 — [`prd-contract.md`](../../ux-critique/references/prd-contract.md) 개정 · [`prd-template.md`](../../ux-critique/references/prd-template.md) 신규 · `scripts/prd-lint.js` 신규.
검증 — 템플릿 통과(🔴 0) · 의도적 결손 PRD 로 반대 검증(🔴 8건: 중복 ID · 끊긴 참조 · TERM 4열 미비 · "적절히" 2건 · MET 수치 없음 · raw hex 2종 · write-back 열 없음).
🔴 린트가 제 템플릿의 실제 오류(`CMP-03` 미정의)를 먼저 잡았다. 표 선택 로직 버그(AC 표의 "영향 CMP" 열을 CMP 표로 오인)도 함께 교정.

## [2026-08-20] build | `ux-critique` 스킬 — PRD 목적 대비 크리틱 파이프라인

기존 자산에 없던 축을 채운다 — `audit`·`gate-static.js` 는 **규칙 적합성**만 본다. 이건 **목적 적합성**을 본다.
[SKILL.md](../../ux-critique/SKILL.md) 7단계 + references 4(prd-parse · lenses · proposal · handoff) + `scripts/inventory.js`.
🔴 **규칙 판정을 재구현하지 않는다** — `gate-static.js` 를 실행해 인용한다. 값이 두 벌이 되면 반드시 어긋난다.
렌즈 5종은 일반 UX 휴리스틱이 아니라 도메인에서 뽑았다 — Key Action 도달 · 정보 순서 · 실패 경로 · 측정 가능성 · **선례 이탈(slop 판정선)**.
`inventory.js` 스모크 — `internet-guide.html` 에서 골격 9 · CTA 4(하네스 5개 제외 후) · 상태 4종 마크업 존재/렌더 안 됨 · 그래픽 33% 초과 3건 검출.

## [2026-08-20] lint | 2차 — AUTO 4건 처리 · 재료 모순은 PROPOSE 로 이관

🔧 **AUTO 해소** — stale 헤더 3건(`layout-and-space` 08-11 · `page-catalog` 08-11 · `rubric` 08-13, 근거는 본문 내 날짜와 `notion-map.md` 의 "08-11 IA 재편") + `README.md` 기준일 08-13.
🔧 **AUTO 해소** — 동작 수 `5종 → 4종`. `imagery-kit.md:392` 가 *"a-flow 삭제됐다"* 로 값을 특정하고 있었고 헤더·`motion.md` 만 갱신이 누락돼 있었다. `canon.json` 에 `expect:4` 등재.
💬 **PROPOSE 이관** — 재료 수 **6벌**(실측 15행 · 도입문 13 · 제목 19 · 헤더 19 · §0.1 24 · 결정 H2-2 21). 안 3개와 되돌리는 비용을 [lint.md](lint.md) §1 에 적고 [synthesis.md](synthesis.md) 에 **O-5** 로 등재. 🔴 **고르지 않았다.**
🔴 **스크립트 재설계** — L2 가 mtime 을 보던 것을 폐기. 헤더를 고치면 mtime 이 바뀌어 **내 수정이 다음 회차에 다시 결함으로 잡히는 무효 수정 루프**가 됐다. 본문이 증언하는 날짜만 근거로 삼는다.

## [2026-08-20] build | `anti-slop` 스킬 — 위키 3오퍼레이션 패키징

`CLAUDE.md` 에 있던 ingest · query · lint 절차를 온디맨드 스킬로 이관(항상 로드되던 것을 호출 시 로드로).
[SKILL.md](../SKILL.md) + references 4(ingest · query · lint · conventions) + `scripts/wiki-lint.js`.
자동 린트 7종 중 5종 판정 — L4·L6·L7 은 **미실행**으로 표기한다.
🔴 **L1 휴리스틱 폐기** — 일반 정규식으로 "N종" 을 긁으니 오탐 30건 이상. `wiki/canon.json` **선언분만** 보도록 교체.
스킬 원본은 `skills/anti-slop/` · `~/.claude/skills/anti-slop` 이 심볼릭 링크 (`lifeservice-uxui` 와 같은 관례).

## [2026-08-20] lint | 1차 위키 건강검진 — 모순 1 · 역방향 드리프트 1 · stale 1 · 준고아 6

7종 점검 전수. 결과 전문 [lint.md](lint.md). 요약 — UICG 재료/패턴 수가 **3벌**(13/8 · 19/15 · 21/17) · 캐시가 Notion 정본보다 **앞서 있음**(work-scopes·hero-kv-prompt·audit-layout.js 미등재) · README 캐시 기준일 2026-08-10 이 실제(08-13)보다 stale · 인바운드 링크 1인 페이지 6.

## [2026-08-20] ingest | LLM Wiki 패턴 (karpathy gist)

원본 [raw/llm-wiki-pattern.md](../raw/llm-wiki-pattern.md). 3계층(raw / wiki / schema) · 3오퍼레이션(ingest / query / lint) · index+log 규약을 도메인에 매핑.
신설 — [CLAUDE.md](../CLAUDE.md) 스키마 · [index.md](index.md) 통합 카탈로그 · 이 파일 · [lint.md](lint.md) · [synthesis.md](synthesis.md).
`wiki/references` → 스킬 캐시 심볼릭 링크. **값은 하나도 복사하지 않았다** — 링크만 걸었다.

## [2026-08-20] build | 디자인·컴포넌트 패턴 카탈로그 (W1 · 미등재 page-id)

pattern 6 · role 12 · archetype 4 를 한 지면으로. archetype A 로 구현해 규칙을 자기 자신에게 적용(R-TABBAR → nav-rail 승격 시연).
게이트 `gate-static.js` 5폭 — **차단 0 · 지적 2**(C5 선택형 h40 정본 규격 · B5 색 축 4 ODS semantic). 전환 7건으로 G3-D 충족.
산출 [preview/pattern-catalog/](../preview/pattern-catalog/pattern-catalog.html) · [CHANGES](../preview/pattern-catalog/CHANGES.md).

## [2026-08-20] query | ODS 토큰 실측 대조 → 미결 2건 신규 등재

`@bucketplace/tokens 3.12.0` `--ds-core-typography-*` 54종 · `--ds-core-color-*` 45종 전수 조회.
발견 — **O-3** 타이포 램 9종 중 ODS textStyle 대응 2종뿐, weight 500·600·700 전부 ODS 미보유 · **O-4** `Card` ODS 미보유 판정이 빈 카탈로그발 오탐 가능성.
둘 다 `open-decisions.md` 에 없던 항목. 🙋 HUMAN — 대리 판정하지 않음.

## [2026-08-13] build | OHOUSE_INTERNET_GUIDE 정본 드리프트 교정 (W3 · LandingPage)

삭제 재료 `u-dir` 제거 · SquareBadge · 버튼 48 단일. ODS `SquareBadge` `IconChevronDown` `BoxButton`(실측) · SB `SelectableChip`(실측) · 신규 0.
게이트 G1 pass · G3 pass · 회귀 0 · G0/G4 pending.

## [2026-08-13] build | life-crosssell (W3 · LandingPage · DB 미등재)

ODS `BoxButton`(실측) · 신규 0. 게이트 G1 pass.

## [2026-08-10] sync | Notion 정본 → `references/` 캐시 생성

IA i~vi 기준. 지면 DB 30행 · 루브릭 · 레이아웃 정본 · 프로젝트 규칙 3.
⚠️ 이후 08-12 · 08-13 결정이 캐시에 직접 반영되면서 헤더의 `캐시 fetch 2026-08-10` 표기가 stale 해졌다 → lint 3.
