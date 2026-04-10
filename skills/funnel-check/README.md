# funnel-check

오늘의집 PD가 자기 오너십 화면의 데이터를 정확하게 측정하는 스킬. PD가 PO와 차별화된 데이터 근거를 들고 화면에 "넣기만" 하지 않고 **사용도 낮은 element를 빼는 결정**에 참여할 수 있게 돕는 게 미션.

## 두 가지 mode

| Mode | 핵심 질문 | 단위 | 산출물 |
|------|----------|------|--------|
| **flow** | 이 플로우의 어디서 떨어지나? | 페이지 시퀀스 | `./flows/` |
| **audit** | 이 화면의 어떤 element가 안 쓰이나? | 단일 페이지 | `./screens/` |

자연어로 호출하면 mode를 자동 추론해. 모호하면 사용자에게 확인.

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
이 화면 element 사용도 분석해줘
PDP에서 장바구니까지 전환률 보여줘
HOME에서 안 쓰이는 버튼 찾아줘
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
/funnel-check 이 화면 audit 해줘
/funnel-check 상품 상세에서 장바구니 담기까지
```

## 사용 흐름

audit mode 예시:

```
유저: /funnel-check 홈 화면 사용도 분석

스킬:
  Step -1. 환경 점검 (의존 스킬 + MCP 확인)
  Step 0. mode 추론 → audit
  Step 1. 분석 목적, 측정 기간 물어보기
  Step 2. page_id 확정 (HOME 으로 자동 추정 → 사용자 확정)
  Step 3. element 인벤토리 (명세 ∩ 로그 / 명세 only / 로그 only) → 사용자 검토
  Step 4. CTR + page health 쿼리 두 개 만들고 승인 요청 → 실행
  Step 5. HTML 시각화 (막대 차트 + Figma mapper)
```

각 단계는 사용자에게 물어가며 진행. AI가 자의적으로 결정하지 않음.

## 산출물

스킬을 호출한 디렉토리 아래에 다음이 생김:

```
{호출한 디렉토리}/
  ├── flows/                                ← flow mode
  │   ├── {플로우명}.md
  │   └── {플로우명}.html
  └── screens/                              ← audit mode
      ├── {화면명}.md
      ├── {화면명}.html                     ← 인터랙티브 (Figma mapper 포함)
      └── {화면명}-mapping-{YYYYMMDD}.json  ← Figma 매핑 export
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

### audit mode 결과가 의심스러움
- 명세와 실로그 대조 결과가 사용자 검토 단계에서 나옴 — 거기서 확인
- 쿼리 전문이 MD 파일과 HTML에 같이 저장됨 — redash에 그대로 붙여서 검증 가능

## 디자인 의도와 히스토리

스킬의 설계 결정 로그, 알려진 제한, 로드맵은 [funnel-check-spec.md](https://github.com/Ohouse-product-design/AI-Workflow/blob/main/%5BYH%5D%20Data-insight/funnel-check-spec.md) 참고. AI-Workflow 레포에 있음.

## 버전

v1.2 (audit mode 추가, 2026-04-10)

## 문의

[Issues](https://github.com/Ohouse-product-design/AI-Skill/issues) 또는 yohan.lee@bucketplace.net
