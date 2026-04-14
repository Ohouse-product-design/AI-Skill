# funnel-check

오늘의집 PD가 자기 오너십 화면의 데이터를 정확하게 측정하는 스킬. page_id 안 element들이 실제로 얼마나 쓰이고 어디서 전환이 일어나는지 **정량적으로 이해**해서, 디자인 의사결정을 정성적 감이 아닌 데이터 근거 위에 세우는 게 미션.

## 핵심 아키텍처: HTML 단위 = page_id

산출물의 단위는 항상 **page_id 하나당 HTML 한 개** (`./screens/{page_id}.html`).

| Scope | page_id 개수 | 추가 산출물 |
|-------|--------------|-------------|
| **single** | 1개 | (없음) |
| **flow** | N개 (시퀀스) | `./flows/{flow_name}.md` + 각 page_id HTML 최상단에 flow funnel header inject |

스킬을 호출하면 시작 시점에 `[a] 단일 화면 / [b] 플로우` 선택지로 물어봐. 플로우면 각 page_id마다 HTML이 생성되고, 첫 entry page HTML 최상단에는 페이지 간 전환률 funnel이 시각화돼서 그 노드를 클릭하면 해당 page_id HTML이 열려. element 차트의 trigger element(다음 페이지로 가는 버튼)도 클릭하면 다음 page_id HTML로 이동해.

## 사전 요구사항

이 스킬은 단독으로 동작하지 않아. 다음이 갖춰져 있어야 함:

### 필수 의존 스킬 (이 레포에서 같이 받음)
- [log-explore](../log-explore/) — 페이지 도메인 매핑
- [log-query](../log-query/) — Athena 쿼리 작성 규칙
- [log-spec](../log-spec/) — 로그 명세 조회

### 필수 MCP 설정
- **athena mcp** — `execute_athena_query` 도구 제공
- **log center mcp** — `get_page_spec`, `get_log_spec_by_id` 도구 제공

설정은 `~/.claude/.mcp.json` 또는 사내 표준 MCP 설정 가이드를 따라.

### 필수 권한
- 오늘의집 Athena `log.analyst_log_table` SELECT 권한
- 사내 권한이 필요한 경우 VPN 연결

## 설치

### 옵션 1: 자동 발동 (권장, 자연어로 호출)

CLAUDE.md skill path 등록 방식. 동료가 자연어로 "이 화면 사용도 분석해줘" 라고만 해도 자동 발동.

```bash
# 1. 레포 clone
git clone https://github.com/Ohouse-product-design/AI-Skill.git ~/AI-Skill

# 2. ~/.claude/CLAUDE.md 의 ## Skills 섹션에 4줄 추가:
#    - funnel-check: ~/AI-Skill/skills/funnel-check/SKILL.md
#    - log-explore: ~/AI-Skill/skills/log-explore/SKILL.md
#    - log-query: ~/AI-Skill/skills/log-query/SKILL.md
#    - log-spec: ~/AI-Skill/skills/log-spec/SKILL.md

# 3. Claude Code 재시작
```

사용:
```
PDP element 전환률 분석해줘                    # → single scope
쇼핑홈 → PDP → 장바구니 전환률 보여줘            # → flow scope, 각 page_id HTML 생성 + funnel
HOME 모듈별 CTR 보고 싶어                       # → single scope
```

### 옵션 2: 슬래시 커맨드 (수동 호출)

```bash
# 1. 레포 clone (위와 동일, 이미 했으면 생략)
git clone https://github.com/Ohouse-product-design/AI-Skill.git ~/AI-Skill

# 2. SKILL.md 파일을 ~/.claude/commands/ 에 복사
mkdir -p ~/.claude/commands
cp ~/AI-Skill/skills/funnel-check/SKILL.md ~/.claude/commands/funnel-check.md
cp ~/AI-Skill/skills/log-explore/SKILL.md ~/.claude/commands/log-explore.md
cp ~/AI-Skill/skills/log-query/SKILL.md ~/.claude/commands/log-query.md
cp ~/AI-Skill/skills/log-spec/SKILL.md ~/.claude/commands/log-spec.md
```

사용:
```
/funnel-check PDP element 전환률 보고 싶어
/funnel-check 상품 상세에서 장바구니 담기까지
```

## 사용 흐름

single scope 예시:

```
유저: /funnel-check 홈 화면 element 전환률 분석

스킬:
  Step -1. 환경 점검 (silent on success)
  Step 0. scope 선택지 [a] 단일 화면 / [b] 플로우 → single 확정
  Step 1. 화면, 분석 목적, 측정 기간을 한 메시지에 묶어서 물어봄
  Step 2. page_id 확정 (후보 [a]/[b]/[c], 모호하면 라이브 워크스루 fallback)
  Step 3. element 인벤토리 announce → 정정 없으면 자동 진행
  Step 4. CTR + page health 쿼리 두 개를 한 번의 yes/no로 승인 → 실행
  Step 5. ./screens/{page_id}.html 생성 + open
```

flow scope 예시:

```
유저: /funnel-check 쇼핑홈 → PDP → 장바구니 전환률

스킬:
  Step -1. 환경 점검
  Step 0. scope 선택지 → flow 확정
  Step 1. 도메인/오너십/측정기간 묶어서 물어봄
  Step 2-A. 플로우 그라운딩 [a] 라이브 워크스루 / [b] 텍스트 입력
            [a]: user_id + 시간 구간 PAGEVIEW로 시퀀스 확정
            [b]: 텍스트 → 단계마다 page_id 후보 매핑, 막히면 라이브로 fallback
  Step 3. 각 페이지 간 trigger announce + 각 page_id의 element 인벤토리 (loop)
  Step 4. 모든 쿼리를 한 번에 모아서 한 번의 yes/no로 승인 → 순차 실행
            - 각 page_id × (Element CTR + Page Health)
            - 페이지 간 funnel 쿼리 1개
  Step 5. 각 page_id마다 ./screens/{page_id}.html 생성 (loop)
            - 모든 HTML 최상단에 flow header section inject (페이지 간 click navigation)
            - 첫 entry page의 HTML만 자동 open
```

핵심 결정 (mode/page_id/쿼리 승인) 외에는 announce 후 자동 진행해서 결과까지 빠르게 도달.

## 산출물

스킬을 호출한 디렉토리 아래에 다음이 생김:

```
{호출한 디렉토리}/
  ├── screens/                              ← per-page 산출물 (single + flow 둘 다)
  │   ├── {page_id}.md                      ← per-page 분석 정본
  │   ├── {page_id}.html                    ← per-page HTML (인터랙티브, Figma mapper 포함)
  │   ├── {page_id}-mapping-{YYYYMMDD}.json ← Figma 매핑 export
  │   ├── pdp.md / pdp.html
  │   ├── cart.md / cart.html
  │   └── ...
  └── flows/                                ← flow scope에서만 생성
      └── {flow_name}.md                    ← 플로우 정의 + funnel 쿼리 결과
                                            (별도 flow.html은 없음 — funnel 시각화는
                                             각 page_id html의 flow-header section에 inject)
```

작업 폴더 하나 만들어두고 거기서 호출하는 걸 추천:
```bash
mkdir -p ~/data-insight && cd ~/data-insight
# 그 다음 funnel-check 호출
```

## 트러블슈팅

### "log-explore.md (또는 log-query/spec)가 없어" 에러
의존 스킬 누락. 위 설치 절차에서 4개 다 받았는지 확인.

### "execute_athena_query 도구를 사용할 수 없어" 에러
1. `~/.claude/.mcp.json` 에 athena mcp 설정 있는지 확인
2. 사내 권한 필요한 경우 VPN 연결
3. Claude Code 재시작

### "permission denied" 에러
오늘의집 Athena 권한 없음. `log.analyst_log_table` SELECT 권한 신청 필요.

### Figma iframe이 안 보임
- Figma 파일이 본인 계정으로 접근 가능한지 확인
- iframe 차단 정책이 있는 환경에서는 동작 안 할 수 있음
- 그 경우 막대 차트와 표 데이터만 사용 가능

### per-page 분석 결과가 의심스러움
- 명세와 실로그 대조 결과가 사용자 검토 단계에서 나옴 — 거기서 확인
- 쿼리 전문이 MD 파일과 HTML에 같이 저장됨 — redash에 그대로 붙여서 검증 가능

## 디자인 의도와 히스토리

스킬의 설계 결정 로그, 알려진 제한, 로드맵은 [funnel-check-spec.md](https://github.com/Ohouse-product-design/AI-Workflow/blob/main/%5BYH%5D%20Data-insight/funnel-check-spec.md) 참고. AI-Workflow 레포에 있음.

## 버전

- **v1.5.2** (2026-04-13) — Athena 비용 최적화. 배경: 긴 기간 × 반복 호출 시 요금 폭탄 우려 + 쿼리 작성/확인 느림. (a) per-page 루틴을 **통합 쿼리 1개**로 합체 — `src` CTE 1개 + `ROLLUP(platform)` 기반 element metrics + page health + 플랫폼 rollup 을 한 번의 스캔으로 처리 (기존 4+3 CTE 구조 → scan 실질 1회). (b) 디폴트 측정 기간 **30일 → 14일**. (c) **`object_section_idx < 10`** 스캔 단계 컷오프 — 스크롤 안 한 유저에게 로딩조차 안 된 하단 element를 IR 분모에서 제거, 정합성 + 비용 동시 개선. (d) **`avg_dwell_seconds` 제거** — duration 컬럼 없고 LEAD 기반 계산이 전체 유저 이벤트 스캔 필요, 비용 대비 이득 작음. (e) **`session_id` 축 + `click_per_session` 신규 지표** — 같은 스캔에 얹혀서 추가 비용 거의 없음. (f) 원칙 3 "쿼리는 통합 1개가 원칙" 명문화, 공통 주의사항에 "비용 원칙" 추가
- v1.5.1 (2026-04-13) — "제거" 맥락 잔존 표현 중립화. v1.3 리프레이밍(⑯) 이후 남아있던 `low-usage-elements` 섹션, MD §5 "사용도 낮은 element", `cursor.yaml` description의 구버전 문구(`audit`, `안 쓰이는 버튼`, `element를 빼는 결정`)를 "element 클릭률 랭킹 — 하위 구간 참고표" 프레이밍으로 교체. 판단(유지/개선/리디자인/제거)은 사용자 몫임을 반복 명시. `~/.claude/commands/funnel-check.md` 슬래시 커맨드도 이번에 처음으로 zip 배포본 v1.5와 동기화 (이전에는 v1.3 이전 구조가 남아있었음). AI-Workflow 레포 `[YH] Data-insight/funnel-check/` 폴더로 파일 재정리
- v1.5 (2026-04-11) — 인터랙션 축소 ~30턴 → 4~5턴. 결정 종류 2단 분리 (데이터 의미 vs 워크플로우 옵션), 디폴트 값 자동 적용 (측정 기간 30일, 컷오프 16, 어제 파티션 등), page_id fuzzy 자동 확장 + 병렬 명세 조회 + description 자동 confirm, 인벤토리/CTR 통합 CTE 1개, user_id 캐싱 (`memory/reference_funnel_check.md`), HTML 외부 CDN 의존 0, Step -1 컨펌 turn 제거, get_page_spec 응답 사이즈 회피
- v1.4 (2026-04-10) — per-page_id HTML 아키텍처, page_id 단위 산출물, flow header inject + click-through navigation

## 문의

[Issues](https://github.com/Ohouse-product-design/AI-Skill/issues) 또는 yohan.lee@bucketplace.net
