---
name: anti-slop
description: LifeService UXUI 지식 위키(45페이지)를 LLM Wiki 패턴으로 유지·조회한다. 새 소스를 위키에 녹이고(ingest), 위키 기반으로 답하고 좋은 답을 되적재하고(query), 모순·stale·고아·드리프트를 검진한다(lint). "이 문서 위키에 넣어줘", "위키 린트 돌려줘", "정본이랑 캐시 어긋난 거 있어?", "이 답 위키에 남겨줘", "위키에서 찾아줘" 같은 요청에서 트리거. 지면·컴포넌트를 새로 만드는 요청은 이 스킬이 아니라 lifeservice-uxui 다.
user-invocable: true
version: 1.0.0
---

# anti-slop — LifeService UXUI 위키 유지·조회

지식을 **질의 때마다 다시 캐내지 않고** 한 번 녹여 계속 최신으로 유지한다.
근거: [LLM Wiki 패턴](raw/llm-wiki-pattern.md) (karpathy).

> **이 스킬은 위키를 관리한다. 지면을 만들지 않는다.**
> 신규 화면·섹션·컴포넌트 생성은 `lifeservice-uxui` 다. 경계가 애매하면 — **산출물이 HTML/프로토타입이면 lifeservice-uxui, 마크다운 페이지면 여기.**

---

## 3계층 — 누가 무엇을 소유하는가

| 계층 | 위치 | 소유 | 규칙 |
|---|---|---|---|
| **Raw** | Notion 정본 7문서 · 지면 DB 30행 · ODS 4패키지 · 스토리북 298 · Figma 2 · `_bp-spec` 실측 | 사람 / 외부 | 🔴 **읽기만 한다** |
| **Wiki** | `wiki/` (+ `wiki/references` → `lifeservice-uxui` 스킬의 `references/`, 아래 설치 참고) | **LLM** | 사람이 직접 쓰지 않는다 |
| **Schema** | 이 파일 + `lifeservice-uxui` 의 `SKILL.md` | 공동 진화 | 워크플로우가 바뀌면 여기부터 |

🔴 **`references/` 는 Notion 의 캐시다.** 충돌하면 Notion 이 이긴다. 캐시 → Notion 자동 덮어쓰기는 하지 않는다.

**설치** — 이 폴더는 스킬(`SKILL.md` · `references/` · `scripts/`)과 위키(`wiki/`) · 원전(`raw/`) 을 함께 담는다. `~/.claude/skills/anti-slop` 을 이 폴더로 심볼릭 링크하고, 편집은 레포 쪽에서 한다.

🔴 **의존 — `lifeservice-uxui`.** `wiki/references`(44페이지 캐시)와 `wiki/SKILL.md` 는 `lifeservice-uxui` 스킬의 파일이라 이 레포에 아직 없다. 해당 스킬을 확보한 뒤 링크해야 위키가 완성된다. **연결 전에는 L5(끊긴 링크)·L8(인덱스 커버리지)이 대량으로 뜨는 것이 정상이다.**

```bash
ln -s ../../lifeservice-uxui/references  skills/anti-slop/wiki/references
ln -s ../../lifeservice-uxui/SKILL.md    skills/anti-slop/wiki/SKILL.md
```

`wiki/index.md` 는 `../../ux-critique/SKILL.md` 도 가리킨다 — 그 스킬이 레포에 들어오면 자동으로 이어진다. `../preview/…` · `../CLAUDE.md` 링크는 **산출물 워크스페이스**를 가리키는 기록이다. 이 레포에는 산출물을 올리지 않으므로 해당 링크는 끊긴 채로 둔다 — 값이 아니라 이력이다.

## 전 오퍼레이션 공통 규율

1. 🔴 **인덱스 먼저.** `wiki/index.md` 에서 이름을 고르고 **그 파일 1개만** 연다. 45페이지 5,563줄이다 — 전부 읽는 것이 가장 흔한 낭비다.
2. 🔴 **값 중복 금지.** 같은 수치가 두 페이지에 있으면 반드시 어긋난다. **값은 한 곳, 나머지는 링크.** 미러를 둘 때는 "정본은 여기" 를 표기한다.
3. 🔴 **판정 불가는 판정 불가로 쓴다.** 린트를 돌리지 않았으면 "통과" 라고 쓰지 않는다. 미실행은 `미실행`.
4. 🔴 **열린 결정을 임의로 닫지 않는다.** `references/open-decisions.md` 와 `wiki/synthesis.md` § 열린 것에 있는 항목은 **대리 판정 금지** — 미결 대장에만 올린다.
5. **모든 오퍼레이션은 `wiki/log.md` 에 한 줄 남긴다.** 표기 `## [YYYY-MM-DD] <verb> | <제목>`.

---

## 서브커맨드

| 호출 | 동작 | 로드 |
|---|---|---|
| `ingest <소스>` | 새 소스를 읽고 위키에 녹인다 | [`references/ingest.md`](references/ingest.md) |
| `query <질문>` | 위키로 답하고, 남길 값이 있으면 적재한다 | [`references/query.md`](references/query.md) |
| `lint` | 건강검진 7종 | [`references/lint.md`](references/lint.md) |
| *(verb 불명)* | 질문이면 `query`, 파일·URL 을 들고 왔으면 `ingest` | — |

페이지 규약·log 표기·값 중복 판정은 [`references/conventions.md`](references/conventions.md).

---

## ingest — 새 소스를 녹인다

```
① 소스를 읽는다
② 🔴 요약만 하지 않는다 — "기존과 무엇이 다른가" 를 말한다
   (새 값 · 기존 값과 충돌 · 정본에 없던 것 · 아무것도 안 바뀜)
③ 해당 엔티티/개념 페이지를 갱신한다. 값은 복사하지 않고 링크한다
④ index.md 갱신 · log.md append
```

한 소스가 10~15 페이지를 건드릴 수 있다. **한 번에 하나씩** 넣고 사람이 확인하는 것이 기본이다.
소스 타입별 절차(Notion · ODS 패키지 · 스토리북 · prod 실측 · 세션 산출물)는 `references/ingest.md`.

## query — 답하고 되돌린다

```
① index.md → 페이지 특정 → 읽기
② 인용과 함께 답한다 (파일:줄 또는 Notion URL)
③ 🔴 적재 판정 — 아래 중 하나면 위키에 남긴다
      · 소스 간 모순을 찾았다
      · 정본에 없던 실측값을 얻었다
      · 다시 쓸 비교표를 만들었다
      · 결정 대기 항목이 생겼다
   채팅 히스토리에 두고 사라지게 하지 않는다
④ log.md append
```

## lint — 건강검진

```bash
node skills/anti-slop/scripts/wiki-lint.js skills/anti-slop [--all] [--canon <file>] [--json out.json]
```

자동 5종 — **L1** 모순(canon 선언분만) · **L2** stale · **L3** 고아 · **L5** 끊긴 링크 · **L8** 인덱스 커버리지 · **L9** 중복 사본 · **LOG** 표기.
🔴 **자동 판정하지 않는 3종** — **L4** 누락 개념 · **L6** 데이터 갭 · **L7** 역방향 드리프트(캐시가 정본보다 앞선 것). 이건 사람이 본다. 판정 항목·처방·분류는 `references/lint.md`.

종료 코드 `0` 차단 없음 / `1` 🔴 차단 / `2` 실행 오류. 결과는 `wiki/lint.md` 에 시점과 함께 남긴다.

**canon.json** — L1 은 **선언된 수치만** 본다. 일반 정규식으로 "N종" 을 긁으면 오탐이 30건 넘게 쏟아진다(실측). 선언이 없으면 L1 은 돌지 않고 **미실행**으로 표기된다.

---

## 결함 분류 — 무엇을 자동으로 고칠 수 있나

`lifeservice-uxui` 의 게이트 루프와 같은 3분류를 쓴다.

| 분류 | 정의 | 처리 | 이 도메인의 예 |
|---|---|---|---|
| 🔧 **AUTO** | 규칙이 **고칠 값을 특정**한다 | 즉시 수정 → 재측정 | 캐시 헤더 날짜 갱신 · 끊긴 링크 경로 · index 미등재 추가 |
| 💬 **PROPOSE** | 위반은 확정이나 **무엇을 고칠지는 선택** | 안만 내고 미결 대장 | 모순된 수치 중 어느 것을 정본으로 · 고아 페이지를 어디에 링크할지 |
| 🙋 **HUMAN** | 🔴 **대리 판정 금지** | 미결 대장에만 | 정본(Notion) 편집 · 열린 결정 · 역방향 드리프트 등재 |

🔴 **루프가 자기 자신을 승인하지 않는다.** 미결이 0건이 아닌 결과를 "건강함" 으로 쓰지 않고 **"미결 N건"** 을 명시한다.

## 현재 상태 (2026-08-20)

| | |
|---|---|
| 페이지 | 50 (`wiki/` + `raw/` + `CLAUDE.md`) |
| 자동 린트 | 🔴 1 (재료 수 4벌) · 🟡 3 (stale) |
| 미결 | 7건 — `wiki/synthesis.md` § 열린 것 |

