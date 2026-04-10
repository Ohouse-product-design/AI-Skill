# AI Skill

오늘의집 PD팀 공용 AI 스킬 모음입니다.
Claude Code와 Cursor 모두 지원합니다.

## 폴더 구조

```
claude-skills/
├── skills/                     ← 스킬 원본 (Single Source of Truth)
│   ├── design-review/
│   │   ├── SKILL.md            ← Claude Code + Cursor 공용 원본
│   │   ├── cursor.yaml         ← Cursor .mdc 프론트매터
│   │   └── references/
│   ├── state-verifier/
│   │   ├── SKILL.md
│   │   ├── cursor.yaml
│   │   └── references/
│   └── spec-policy-handoff/
│       ├── SKILL.md
│       ├── cursor.yaml
│       └── references/
├── scripts/
│   ├── build-cursor.sh         ← SKILL.md → .mdc 자동 변환
│   └── setup-cursor.sh         ← Cursor 프로젝트 심볼릭 링크
├── shared/                     ← 팀 공용 설정 템플릿
│   ├── CLAUDE.md.template
│   └── hooks/
└── dist/cursor/                ← 빌드 결과물 (.mdc 파일)
```

## 스킬 목록

### design-review
디자인 기획을 휴리스틱 평가, 페르소나 워크스루, 근거 기반 피드백으로 검증하는 스킬.

**트리거**: `#휴리스틱` / `#페르소나` / `#근거` / `#리뷰`

### state-verifier
디자인 단계에서 UI 상태 누락과 엣지케이스를 자동 탐지하는 스킬.

**트리거**: `상태 체크해줘` / `엣지케이스 뽑아줘` / `QA 전 체크`

### spec-policy-handoff
Figma 화면 구조를 읽고 개발 핸드오프용 주석 초안을 생성하는 스킬.

**트리거**: `주석 써줘` / `핸드오프 주석` / `spec 달아줘`

## 사용 순서

```
state-verifier → Figma 보완 → spec-policy-handoff
```

## 설치

### Claude Code
`CLAUDE.md`에 스킬 경로를 추가하세요 (`shared/CLAUDE.md.template` 참고):
```markdown
## Skills
- state-verifier: ~/claude-skills/skills/state-verifier/SKILL.md
- spec-policy-handoff: ~/claude-skills/skills/spec-policy-handoff/SKILL.md
- design-review: ~/claude-skills/skills/design-review/SKILL.md
```

### Cursor
1. .mdc 파일을 빌드합니다:
```bash
~/claude-skills/scripts/build-cursor.sh
```

2. 프로젝트 폴더에 심볼릭 링크를 설정합니다:
```bash
~/claude-skills/scripts/setup-cursor.sh /path/to/your/project
```

## 스킬 수정 가이드

1. `skills/{스킬명}/SKILL.md`를 수정합니다 (단일 원본)
2. Claude 전용 내용은 `<!-- claude-only -->` ~ `<!-- /claude-only -->` 마커로 감쌉니다
3. `scripts/build-cursor.sh`를 실행하면 마커 블록이 제거된 `.mdc` 파일이 `dist/cursor/`에 생성됩니다

## 문의 및 개선 제안

Issues에 남겨주세요.
