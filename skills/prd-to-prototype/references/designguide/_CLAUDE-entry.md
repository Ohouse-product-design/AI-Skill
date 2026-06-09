@AGENTS.md

# Admin 프로토타입 프로젝트

## 이 프로젝트가 하는 일
PRD(Google Doc)를 읽어 디자인 가이드에 맞는 프로토타입을 생성합니다.

- **PRD**: 사용자가 `/prd-to-prototype` 호출 시 Google Doc URL 전달
- **정규화된 스펙독 저장**: `spec-docs/`
- **산출물**: `src/app/**/page.tsx`

---

## 자동 Read 규칙 (필수 — 모든 작업에 선행)

> ⚠️ **CLAUDE.md만 항상 로드된다. 나머지 가이드 파일은 lazy load이므로, 작업 성격에 따라 먼저 Read 도구로 읽은 뒤 진행한다.**
> 메모리 기반 구현(이전 세션 기억)은 드리프트를 만든다. 조건에 해당하면 **코드/문서 수정 전에 반드시 Read**.

| 작업 유형 | 필수 Read 파일 |
|----------|-------------|
| **`src/app/**` 또는 `src/components/**` 수정**  | `.claude/designguide/00-principle.md` + `10-design-tokens.md` + `20-components.md` + `30-design-patterns.md` (4개 전부) |
| **새 페이지 생성** | 위 4개 + `/prd-to-prototype` 스킬 사용 |
| **컬러·폰트·아이콘·간격만 수정** | `.claude/designguide/10-design-tokens.md` |
| **Sidebar·Header·Layout만 수정** | `.claude/designguide/30-design-patterns.md` |
| **스펙독 작성·정규화** | `spec-docs/TEMPLATE.md` + `.claude/designguide/00-principle.md` |
| **메모리·문서·스크립트·설정 작업** | Read 불필요 |

**❌ 금지 패턴:**
- ❌ 위 조건에 해당하는데 Read 없이 "기억하고 있으니 괜찮다"며 작업 시작
- ❌ 규칙이 애매할 때 추측 — 해당 파일을 다시 Read하여 확인

---

## 불변 규칙 (최상위, 항상 적용)

- 신규 페이지 구현/보완 시 반드시 `/prd-to-prototype` 스킬 사용
- 스펙독 정규화 없이 PRD에서 바로 코드 작성 금지
- 컴포넌트 스펙(`20-components.md`)을 벗어난 임의 값 사용 금지
- 신규 라우트 추가 시 `Header.tsx`, `Sidebar.tsx` 동반 수정 필수

## 가이드 파일 목록 (lazy load)

- `.claude/designguide/00-principle.md` — 구현 필수 규칙 (0-1~0-8)
- `.claude/designguide/10-design-tokens.md` — 환경/컬러/타이포/간격/아이콘/이미지
- `.claude/designguide/20-components.md` — Button/Input/Table/Modal 등 컴포넌트
- `.claude/designguide/30-design-patterns.md` — 레이아웃/List/Form Page

## 스펙독 → 프로토타입 워크플로
`/prd-to-prototype` 스킬(`.claude/skills/prd-to-prototype/SKILL.md`) 참조.
