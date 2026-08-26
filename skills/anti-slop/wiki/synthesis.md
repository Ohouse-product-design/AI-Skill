# synthesis — 지금 이 도메인에 대해 무엇을 알고 있는가

> 2026-08-20 기준. 🔴 **여기에 수치를 복사하지 않는다** — 값은 각 페이지에, 여기엔 판단과 링크만.
> 갱신: ingest · lint 이후.

---

## 한 문장

LifeService UXUI 는 **"새로 만들지 않는 것"이 품질인 도메인**이다.
같은 pattern 의 기존 지면 2개와 구별되지 않는 화면이 성공이고, 다양성·창의성은 결함으로 센다.

## 이 도메인의 축 4개

| 축 | 무엇이 고정돼 있나 | 정본 |
|---|---|---|
| **골격** | 화면 패턴 **6종**뿐. 지어내지 않고 prod 에서 역추출했다 | [macrostructures](references/macrostructures.md) |
| **부품** | 역할 **12종**이 컴포넌트를 부른다. ODS → 스토리북 → 신규 사다리, 신규는 사람 승인 | [components](references/components.md) |
| **폭** | breakpoint **3개**(768/1024/1256) · gutter **3단**(16/40/60) · archetype **4종**. 🔴 **컬럼 수는 절대 안 바뀐다** | [layout-and-space](references/layout-and-space.md) |
| **색·글자** | 브랜드 1색 · Primary 는 CTA/48×48 이하만 · 크기당 weight 2벌 | [color](references/color.md) · [typography](references/typography.md) |

## 확정된 것 — 다시 논의하지 않는다

30여 건이 [open-decisions](references/open-decisions.md) § 확정에 있다. 판단에 가장 자주 걸리는 6개:

- **A1·A2** 랜딩 전환점 **768 단일** — 1024·1256 에 추가 전환을 두지 않는다
- **B1** 컬럼 수 불변, **단 `minWidth` 미달일 때만** 고정폭 캐러셀로 전환
- **B2·A8** 외부 스톡 전면 금지 · 웜톤 ODS 에셋 대체 금지 → **placeholder 로 비운다**
- **C1** LandingPage sticky CTA `LandingStickyCta` **1벌**
- **C6** PartnerCard **2벌 구분 유지** — 3번째 신설 금지
- **E4** 다크모드 **다루지 않는다**

## 열린 것 — 만나면 "판정 불가"로 명시하고 G4 로 올린다

| ID | 항목 | 막히는 것 | 분류 |
|---|---|---|---|
| **O-1** | Form progressbar 분모 불일치 | **R10 판정 자체가 불가** | 🙋 |
| **O-2** | archetype C 폭 478 vs 560 | G2 · G9 판정이 갈린다 | 💬 |
| **O-3** 🆕 | 타이포 램 ↔ ODS textStyle 매핑 부재 | *"타이포는 ODS 토큰으로만"* 조항이 **지켜질 수 없다** | 🙋 |
| **O-4** 🆕 | `Card` ODS 미보유 판정 오탐 가능성 | `R-GRID` · `R-SUMMARY` 의 primitive 강제가 근거를 잃는다 | 🙋 |
| **O-5** 🆕 | UICG 재료 수가 6벌 · 동작 수가 2벌 | `imagery-kit.md` 를 인용하는 모든 판정이 어느 값인지 불명 | 💬 |
| **C8** | knowledge 어휘 ↔ ODS API 매핑표 | G1 · R7 자동화 불가 | 🟢 |
| **C9** | R2 · R3 임계값 | 판정 기준 공백 | 🟢 |
| **F2** | G0-a · G0-b · G4 담당자 미지정 | 사람 게이트가 대기만 쌓인다 | 🔴 |

> **F2 가 구조적으로 제일 아프다.** 사람 게이트 3개에 담당자가 없어 [gate-loop](references/gate-loop.md) 자율 수정 루프로 완충 중이고, 그 루프는 **자기 자신을 승인하지 않는다** — 즉 미결은 계속 쌓인다.

## 지금 이 위키의 상태

| | |
|---|---|
| 페이지 | **45** (5,563줄) + 워크스페이스 산출물 6 |
| 소스 | Notion 7문서 + 지면 DB 30행 · ODS 4패키지 · 스토리북 298 · Figma 2 · `_bp-spec` 5×5 실측 |
| 건강 | 모순 2 · 역방향 드리프트 1 · ~~stale 3~~ 해소 · ~~준고아 6~~ 해소 → [lint](lint.md) |
| 미결 | **8건** (🙋 3 · 💬 3 · 🟢 2) |

## 다음에 물어볼 만한 것

린트와 미결에서 자연스럽게 따라 나오는 질문들.

1. **O-3 을 어느 쪽으로 닫을 것인가** — 램 7종을 C10 미정의 토큰으로 등재할 것인가, ODS textStyle 로 램을 다시 맞출 것인가. 후자면 기존 프로토타입 전부가 재작업 대상이다
2. **`Card` 가 실제로 ODS 인가** — ODS 설치된 cwd 에서 `list_components` 한 번이면 닫힌다. `R-GRID`·`R-SUMMARY`·`R-LIST` 세 role 의 1순위가 바뀐다
3. **선례가 1~1.5개인 pattern 2종**(PartnerList · ChatChannel)을 어떻게 다룰 것인가 — 선례 구속이 이 도메인의 핵심 방어인데 여기서는 작동하지 않는다
4. **C5(44×44) ↔ 선택형 버튼 h40 충돌** — 정본 두 개가 서로를 위반한다. 어느 쪽이 L0 인가
5. **위키를 git 저장소로 만들 것인가** — 45 페이지가 버전 이력 없이 직접 편집되고 있다 (린트 2 가 그래서 생겼다)
