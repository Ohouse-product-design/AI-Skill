# log-spec

특정 로그의 명세를 로그센터에서 찾아주는 스킬.

## 무엇을 하나

다음 입력을 모두 처리:
- 로그센터 URL → `get_log_spec_from_url`
- spec_id 숫자 → `get_log_spec_by_id`
- page_id (예: PDP, HOME) → `get_page_spec`
- 한글 화면명 (예: "상품 상세") → 매핑표로 page_id 추정 후 `get_page_spec`

조회 결과는 다음 포맷으로 정리:
- spec_id / action / category / 설명 / 주요 필드 표
- constraint_dsl 자연어 요약
- json_preview 기반 athena 쿼리 필드 안내

## 사전 요구사항

- **log center mcp** — `get_log_spec_by_id`, `get_log_spec_from_url`, `get_page_spec`, `get_enum`
- 사내 권한 (필요 시 VPN)

## 설치

### 옵션 1: CLAUDE.md skill path (자동 발동, 권장)

```bash
git clone https://github.com/Ohouse-product-design/AI-Skill.git ~/AI-Skill
```

`~/.claude/CLAUDE.md` 의 `## Skills` 섹션에 추가:
```
- log-spec: ~/AI-Skill/skills/log-spec/SKILL.md
```

### 옵션 2: 슬래시 커맨드

```bash
cp ~/AI-Skill/skills/log-spec/SKILL.md ~/.claude/commands/log-spec.md
```

`/log-spec`으로 호출.

## 사용 예시

```
spec_id 1234 명세 보여줘
PDP 페이지의 로그 명세
상품 상세 화면 로그
이 로그센터 URL 명세 찾아줘
```

## 관련 스킬

- [log-explore](../log-explore/) — 어떤 로그가 있는지 탐색
- [log-query](../log-query/) — 명세 기반 athena 쿼리 생성
- [funnel-check](../funnel-check/) — 이 스킬을 명세 교차검증 의존 소스로 활용
