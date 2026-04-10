# log-query

로그센터 명세 기반으로 정확한 Athena 쿼리를 생성하고 실행하는 스킬.

## 무엇을 하나

`log.analyst_log_table` 기준 표준 쿼리 패턴을 강제해서 쿼리 작성자마다 결과가 달라지는 문제를 방지한다:

- `date` 파티션 필터 필수 (비용 절감)
- `user_id > 0` 비회원 제외
- `platform IN ('IOS', 'ANDROID')` 앱 한정
- enum 값 (page_id, category, object_type) 대문자
- 로그 명세의 constraint_dsl 조건 자동 반영

쿼리 전문을 사용자에게 보여주고 승인 후에만 `execute_athena_query`로 실행한다.

## 사전 요구사항

- **athena mcp** — `execute_athena_query` 도구 제공
- **log center mcp** — `get_log_spec_by_id`, `get_page_spec` (명세 조회용)
- 오늘의집 Athena `log.analyst_log_table` SELECT 권한
- 사내 권한 (필요 시 VPN)

## 설치

### 옵션 1: CLAUDE.md skill path (자동 발동, 권장)

```bash
git clone https://github.com/Ohouse-product-design/AI-Skill.git ~/AI-Skill
```

`~/.claude/CLAUDE.md` 의 `## Skills` 섹션에 추가:
```
- log-query: ~/AI-Skill/skills/log-query/SKILL.md
```

### 옵션 2: 슬래시 커맨드

```bash
cp ~/AI-Skill/skills/log-query/SKILL.md ~/.claude/commands/log-query.md
```

`/log-query`로 호출.

## 사용 예시

```
spec_id 1234 로 athena 쿼리 만들어줘
PDP 페이지 PAGEVIEW UV 일별로 뽑아줘
이 로그 일주일치 데이터 보여줘
```

## 관련 스킬

- [log-explore](../log-explore/) — 어떤 로그가 있는지 탐색
- [log-spec](../log-spec/) — 특정 로그 명세 조회
- [funnel-check](../funnel-check/) — 이 스킬의 쿼리 작성 규칙을 의존 소스로 활용
