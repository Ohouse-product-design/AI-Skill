# index — LifeService UXUI 위키 콘텐츠 카탈로그

> **45 페이지 · 5,563줄.** 🔴 여기서 이름을 고르고 **그 파일 1개만** 연다. 전부 읽지 않는다.
> `references/` 는 `~/.claude/skills/lifeservice-uxui/references/` 심볼릭 링크다. 정본은 Notion — [notion-map](references/notion-map.md) 참조.
> 갱신: ingest 마다. 마지막 갱신 **2026-08-20**.
> 자동 검진 `node skills/anti-slop/scripts/wiki-lint.js .`

---

## 0. 진입점

| 페이지 | 한 줄 |
|---|---|
| [SKILL.md](SKILL.md) | `lifeservice-uxui` 오케스트레이터 — 8단계 + 7게이트 + verb 3종 |
| [../SKILL.md](../SKILL.md) | `anti-slop` 오케스트레이터 — 위키 3오퍼레이션 (ingest · query · lint) |
| [../../ux-critique/SKILL.md](../../ux-critique/SKILL.md) | `ux-critique` 오케스트레이터 — PRD 목적 대비 크리틱 7단계 · 렌즈 5 |
| [canon.json](canon.json) | 🔴 L1 모순 검사가 보는 **선언된 정본 수치** |
| [proposals/notion-restructure.md](proposals/notion-restructure.md) | 🆕 Notion 정본 재구성안 — 🔴 **미반영** (정본 편집은 HUMAN) |
| [synthesis.md](synthesis.md) | 현재 종합 — 확정 / 열림 / 드리프트 |
| [log.md](log.md) | 시간순 이력 (`grep "^## \["`) |
| [lint.md](lint.md) | 위키 건강검진 결과 |
| [references/notion-map.md](references/notion-map.md) | Notion 정본 IA i~vi ↔ 캐시 대응표 · 위계 L0~L3 |
| [references/sources.md](references/sources.md) | raw 소스 레지스트리 + `sync` 절차 |

## 1. 엔티티 · 화면 패턴 6종

> 인덱스: [references/macrostructures.md](references/macrostructures.md) — page-id → pattern 매핑 + 정책 취합

| 페이지 | 구분 | archetype | 한 줄 |
|---|---|---|---|
| [01-landingpage](references/macrostructures/01-landingpage.md) | B2C | 지면별 · 768 단일 | Hero → Section → sticky CTA. **UICG 허용 유일** · CTA 최대 2 |
| [02-form](references/macrostructures/02-form.md) | B2C | **C** 478 · 768만 | step page 연속 + progressbar. **가장 위험** — step 증감 시 전 페이지 재계산 (R10) |
| [03-orderlist](references/macrostructures/03-orderlist.md) | B2C | **A** | 탭바 → 필터 → 리스트. **1열 불변** · rail 승격이 실제로 일어나는 계열 |
| [04-partnerhome](references/macrostructures/04-partnerhome.md) | B2B | **A** · 768 단일 | Hero → 요약 → 분기 CTA. rail 후보 2개 → 묻는다 |
| [05-partnerlist](references/macrostructures/05-partnerlist.md) | B2B | 상위 상속 (B) | 필터 → PartnerCard 반복. **선례 1.5개 · 전용 page_id 없음** |
| [06-chatchannel](references/macrostructures/06-chatchannel.md) | B2C·B2B | **A** | 메시지 스트림 + 입력 도크. **선례 1개 · 선례 구속 약함** |

## 2. 엔티티 · 컴포넌트 역할 12종

> 인덱스: [references/components.md](references/components.md) — role 인덱스 + 해소 사다리 + 중복 3건 + 치수표

| 페이지 | 탐지 신호 | breakpoint 거동 |
|---|---|---|
| [r-pagetitle](references/components/r-pagetitle.md) | 최상단 큰 텍스트 1줄 | A·B 768 램 승격 / C 고정 |
| [r-tabbar](references/components/r-tabbar.md) | 균등분할 2~5 + 인디케이터 | XS 탭 h46 → SM+ **nav-rail 160** |
| [r-filter](references/components/r-filter.md) | 칩 가로 나열 · 우측 잘림 | 폭만 신축 · 🔴 선택 강조에 brand 금지 |
| [r-summary](references/components/r-summary.md) | 상단 요약·상태·CTA | MD **content-rail 300** |
| [r-list](references/components/r-list.md) | 동일 구조 3개 이상 반복 | 🔴 **1열 불변 (G5)** |
| [r-grid](references/components/r-grid.md) | 균등 n열 | 🔴 **n 불변** · minWidth 폴백만 예외 |
| [r-carousel](references/components/r-carousel.md) | 가로 나열 · 폭 고정 | 🔴 가로 스크롤 불변 (G7) · **ODS 미보유** |
| [r-form](references/components/r-form.md) | 입력·선택 컨트롤 | 768 → **478 고정 중앙** |
| [r-section](references/components/r-section.md) | 제목 + 콘텐츠 — **모호하면 이것** | 컨테이너 폭 · gutter · padY 만 |
| [r-cta-bottom](references/components/r-cta-bottom.md) | 최하단 폭 전체 버튼 | 컨테이너 폭 추종 (G9) |
| [r-uicg](references/components/r-uicg.md) | UI 컴포지션 그래픽 | 폭만 추종 · 🔴 **LP 전용** |
| [r-chrome](references/components/r-chrome.md) | GNB · statusbar | 🔴 **구현하지 않는다 (G14)** |

## 3. 개념 · 축별 참조

| 페이지 | 줄 | 한 줄 |
|---|---|---|
| [layout-and-space](references/layout-and-space.md) | 334 | 🔴 **수치 정본** — 절대 규칙 5 · BP 768/1024/1256 · gutter 16/40/60 · archetype 4 · rail 2 · G1~G14 |
| [responsive](references/responsive.md) | 176 | 그 수치를 **적용하는 절차** — 역할 태깅 → archetype → 유도표 |
| [color](references/color.md) | 132 | 브랜드 `#00A1FF` 정본 · **Primary 사용 제한(48×48)** · 책임보장 green · C10 · CTA vs 선택형 |
| [typography](references/typography.md) | 68 | 램 · weight 2벌 상한 · 줄 수 제한 · 다운시프트 사다리 |
| [assets](references/assets.md) | 383 | ODS 자산 체계 · UI 타입만 파생 · 🔴 심볼그래픽·사진 생성 금지 → placeholder |
| [imagery-kit](references/imagery-kit.md) | 1,015 | UICG 카탈로그 — 재료·패턴·슬롯 카드·동작 · 생성 파이프라인 (LP 전용) |
| [hero-kv-prompt](references/hero-kv-prompt.md) | 600 | 🔴 히어로 KV **마스터 프롬프트 강제** — `[PRODUCT]` 만 교체 · 페이지당 1개 |
| [interaction-and-states](references/interaction-and-states.md) | 57 | 5상태 · 에러 복구 · 히어로↔스티키 CTA |
| [motion](references/motion.md) | 51 | 범위 밖 명시 + 상태 전환 2건 |
| [design-md](references/design-md.md) | 81 | `--lyt-*` 분리 · C10 라우팅 · 토큰 산출 계약 |
| [rubric](references/rubric.md) | 222 | C1~C10 · R1~R13 · G0~G5 판정 기준 |
| [slop-test](references/slop-test.md) | 145 | 생성 가드레일 A~F + 자동 게이트 + 오탐 3종 |
| [work-scopes](references/work-scopes.md) | 210 | 파이프라인 2종(Anti-slop / Anti-pattern) · 범위 4종(W1~W4) · 단계별 차이 |

## 4. 운영

| 페이지 | 한 줄 |
|---|---|
| [page-catalog](references/page-catalog.md) | 지면 30행 slim index (Notion DB 캐시) + IntentTag 11종 |
| [open-decisions](references/open-decisions.md) | 확정 결정 30여 건 + 🔜 남은 결정 |
| [gate-loop](references/gate-loop.md) | 담당자 부재 대응 — AUTO / PROPOSE / HUMAN · 정지 조건 5 |
| [preview-examples](references/preview-examples.md) | 프리뷰 규율 + 실제 사례 2종 |
| [slack-adapter](references/slack-adapter.md) | 멘션 → 요청 스키마 → 스레드 회신 (트리거 미구현) |
| [verbs/plan](references/verbs/plan.md) | G0-a 설계안 검토 + G0-b 컴포넌트 신설 |
| [verbs/audit](references/verbs/audit.md) | 감사 — **수정하지 않는다** |
| [verbs/sync](references/verbs/sync.md) | Notion 정본 → 캐시 재생성 |

## 5. 워크스페이스 산출물

| 산출물 | 날짜 | scope | 게이트 |
|---|---|---|---|
| [pattern-catalog](../preview/pattern-catalog/pattern-catalog.html) · [CHANGES](../preview/pattern-catalog/CHANGES.md) | 2026-08-20 | W1 | 🔴 0 · 🟡 2 · 미결 4 |
| [internet-guide](../preview/internet-guide/internet-guide.html) · [CHANGES](../preview/internet-guide/CHANGES.md) | 2026-08-13 | W3 | G1·G3 pass · 회귀 0 |
| [life-crosssell](../preview/life-crosssell/life-crosssell.html) · [CHANGES](../preview/life-crosssell/CHANGES.md) | 2026-08-13 | W3 | G1 pass |
| [uicg-catalog](../preview/uicg-catalog/uicg-catalog.html) | — | W4 | — |
| [uicg-plan-compare](../preview/uicg-plan-compare/variants.html) · [REPORT](../preview/uicg-plan-compare/REPORT.md) | — | W4 | — |
| [slot-cards](../preview/slot-cards/slot-cards.html) | — | W4 | — |
| [preview/qa/pending.md](../preview/qa/pending.md) | — | — | 미결 대장 |

## 6. Raw

| 소스 | 위치 |
|---|---|
| LLM Wiki 패턴 (karpathy) | [raw/llm-wiki-pattern.md](../raw/llm-wiki-pattern.md) |
| Notion 정본 7문서 + 지면 DB | [references/sources.md](references/sources.md) § Notion |
| ODS 패키지 (tokens · design-system · icons · assets) | `~/Desktop/Form/node_modules/@bucketplace/` · ods-prototype MCP |
| 로컬 스토리북 298 스토리 | `fe.co-workerhou.se/lifeservice/storybook` |
| Figma B2C · B2B | [references/sources.md](references/sources.md) § Figma |
| `_bp-spec` 실측 (2026-07-22) | `~/Desktop/prototypes` · `~/Desktop/Form` · `~/Desktop/MovingPartner` |
