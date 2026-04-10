# log-explore

오늘의집 로그 체계를 탐색하고 이해하는 스킬. "어떤 로그가 있는지 모르겠을 때" 사용한다.

## 무엇을 하나

| Case | 예시 입력 | 동작 |
|------|----------|------|
| 화면 로그 전체 | "PDP 화면에 어떤 로그가 있어?" | `get_page_spec`으로 모든 로그 명세 조회 |
| Enum 값 확인 | "category enum 값 알려줘" | `get_enum`으로 값 목록 조회 |
| 기능 키워드 | "장바구니 관련 로그 찾고싶어" | 도메인 매핑 가이드로 page_id 후보 제시 |
| 로그센터 URL | URL 붙여넣기 | `get_log_spec_from_url` + 커뮤니케이션 이력 |

도메인별 page_id 매핑(커머스/콘텐츠/o2o/공통)이 스킬 안에 내장되어 있어서 한글 화면명 → page_id 추정에도 활용 가능.

## 사전 요구사항

- **log center mcp** — `get_page_spec`, `get_enum`, `get_log_spec_from_url`, `get_log_spec_communications`
- 사내 권한 (필요 시 VPN)

## 설치

### 옵션 1: CLAUDE.md skill path (자동 발동, 권장)

```bash
git clone https://github.com/Ohouse-product-design/AI-Skill.git ~/AI-Skill
```

`~/.claude/CLAUDE.md` 의 `## Skills` 섹션에 추가:
```
- log-explore: ~/AI-Skill/skills/log-explore/SKILL.md
```

Claude Code 재시작.

### 옵션 2: 슬래시 커맨드

```bash
cp ~/AI-Skill/skills/log-explore/SKILL.md ~/.claude/commands/log-explore.md
```

`/log-explore`로 호출.

## 사용 예시

```
로그 어떻게 봐
PDP 화면에 어떤 로그가 있어?
장바구니 관련 page_id가 뭐야?
이 로그센터 URL 분석해줘 → https://...
```

## 관련 스킬

- [log-spec](../log-spec/) — 특정 로그 명세 조회
- [log-query](../log-query/) — 명세 기반 athena 쿼리 생성
- [funnel-check](../funnel-check/) — 이 스킬을 의존 소스로 활용
