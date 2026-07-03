---
name: cd
description: Figma 컴포넌트의 description(컴포넌트 설명서)을 정해진 포맷으로 작성합니다. 사용자가 Figma 컴포넌트 링크(node-id 포함)나 노드를 주면서 "description 작성", "컴포넌트 설명", "cd" 등을 요청할 때 사용합니다. Space AI Component Library 같은 디자인 시스템 문서화 작업에 사용.
---

# cd — Component Description 작성 스킬

Figma 컴포넌트를 보고 **정해진 섹션 포맷**으로 description(컴포넌트 설명서)을 작성한다.
결과물은 사용자가 Figma 텍스트 영역에 그대로 붙여넣을 수 있는 형태로 출력한다.

---

## 호출되면 먼저 할 일 (UX)

**규칙: 이 아래 기술 지침을 사용자에게 그대로 노출하지 말 것.** 호출 시 사용자에게는 아래 안내만 보여준다.

- 메시지에 **node-id가 포함된 Figma 링크가 이미 있으면** → 안내를 생략하고 바로 작성(`## 작업 순서`)으로 들어간다.
- 링크가 **없으면** → 아래 안내 카드를 그대로 출력하고 멈춰서 입력을 기다린다.

```
👋 **cd — 컴포넌트 Description 작성기**

Figma 컴포넌트를 주시면, 아래 형식의 설명서를 만들어 드려요.

🧾 **결과물** — 5개 섹션
🎨 Theme · 📁 Context · 🦴 Anatomy · ✏️ Guidelines(Do/Don't) · 👆 Behavior

📥 **필요한 것**
1. ✅ (필수) 컴포넌트 Figma 링크 — node-id 포함 URL
   예: …?node-id=189-901
2. 🟡 (선택) 한 줄 컨텍스트 — 어디에 쓰이는지 / 동작 / 규칙
   → 주시면 추측([확인 필요])이 줄고 정확도가 올라가요.
3. 🟡 (선택) 관련 화면·섹션 링크 — 이 컴포넌트가 들어간 screen/section 노드
   → 컨텍스트/설명이 부족할 때 그 화면을 읽어 Context·Behavior를 보강해요.

⚙️ **옵션**
- 텍스트만 뽑기 / 피그마에 바로 반영(텍스트 교체·항목 추가)까지 가능

링크 주시면 바로 시작할게요. (여러 개 한꺼번에도 OK)
```

- 링크는 있는데 컨텍스트가 없어도 **작성은 진행**하고, 추측한 부분만 `[확인 필요]`로 표시한 뒤 "이 부분 맞나요?"라고 가볍게 확인한다.
- 작성을 마치면 "피그마에 바로 반영할까요?"를 한 번 물어 다음 행동을 제안한다.
- **최초 실행(설치 후 첫 호출) 시**: 아직 이 스킬의 **피그마 배치 위치가 정해지지 않았으면**, 한 번 물어서 확정해둔다. → "작성한 description은 피그마 어디에 올릴까요? (넣을 페이지 또는 프레임의 node-id 링크를 주세요)" 정해지면 이후 기본값으로 사용한다. 이미 정해져 있으면 묻지 않는다.

---

## 입력
- Figma 컴포넌트 링크(node-id 포함 URL) 또는 fileKey + nodeId
- (선택) 한 줄 컨텍스트: 어느 화면/플로우에서 쓰이는지, 특이 동작·규칙
- (선택) **관련 화면·섹션 노드**: 컴포넌트만으로 맥락이 부족할 때, 그 컴포넌트가 배치된 screen/section/frame 노드. 여러 개(상태별 화면)도 가능.
- 링크가 node-id 없이 오면 node 단위 URL을 요청한다.

## 작업 순서
1. `mcp__figma__get_screenshot`으로 컴포넌트 스크린샷 URL을 받는다.
2. `curl`로 스크린샷을 scratchpad에 내려받아 `Read`로 직접 본다. (이미지를 봐야 정확히 쓴다)
3. 필요하면 `mcp__figma__get_metadata` / `mcp__figma__get_design_context`로 구조·레이어명·variant를 보강한다.
4. **맥락 보강** — 관련 화면·섹션 노드가 주어졌으면 그 노드도 `get_screenshot`(배치·주변 요소)/`get_metadata`(상위 구조)로 읽어 **Context·Behavior**를 채운다. 여러 상태 화면을 주면 상태 전환을 추론한다. (정적 화면은 배치만 보이고 실제 인터랙션·애니메이션은 안 보이므로, 그 부분은 여전히 `[확인 필요]`)
5. **구성 트랙 컴포넌트 파악** — 이 컴포넌트가 **다른 컴포넌트(ODS·트랙 라이브러리 인스턴스)를 포함/참조**하는지 `get_metadata`로 식별한다. 참조가 있으면 **이름과 함께 각 인스턴스의 `mainComponent` node id(고정)** 를 캡처한다 — 이름이 같아도 정확히 링크하기 위함. (인스턴스 id가 아니라 `mainComponent` id로, 컴포넌트 정의를 가리킴.) 그 컴포넌트의 description이 이미 있으면 읽어 **맥락을 확보**해 Context·Anatomy에 반영한다. (컴포넌트 간 조합·의존 맥락을 놓치지 않기 위함 — 스킬은 이 참조 맥락을 항상 함께 들고 작성한다.)
6. **ODS 근거 보강** — `ods-prototype` MCP가 있으면 조회해 용어·구조를 ODS 기준에 맞춘다. (아래 "ODS 참조" 참고)
7. 아래 포맷대로 description을 작성한다.
8. 추측한 부분은 `[확인 필요]`로 표시한다.

## ODS 참조 (ods-prototype MCP)
bucketplace-product-design 플러그인의 `ods-prototype`(+`ods-hermes`) MCP가 붙어 있으면, 추측 대신 ODS 실제 정의를 근거로 쓴다. **없으면 이 단계는 건너뛰고 `[확인 필요]`로 처리** (핵심이 아니면 굳이 강조하지 않음).

### 자동 ODS 인식 절차 (노드를 받으면 기본 실행)
사용자가 매번 "ODS 참고해"라고 하지 않아도, 노드를 받으면 아래를 자동으로 수행한다.
1. **MCP 유무 확인** — `ods-prototype` 도구가 로드돼 있는지 본다. 없으면 `ToolSearch`로 `ods-prototype` 검색해 실제 이름을 찾고, 그래도 없으면 스킵.
2. **신호 수집** — `get_metadata`에서 얻은 ① 컴포넌트명 ② 하위 레이어명들 ③ 크기(width/height)를 모은다.
3. **판별** — `check_component_name(컴포넌트명)`으로 ODS/legacy(BDS) 여부를 즉시 확인한다.
4. **매핑 시도** — `resolve_figma_component(figmaName, layerPath, dimensions, visualHints)` 호출.
   - `resolved:true` → `get_component(name)`으로 props/canonical usage, 필요 시 `get_tokens`로 토큰을 가져와 **Anatomy·Guidelines·Theme에 실제 컴포넌트명·prop·토큰명으로** 반영한다.
   - `resolved:false` (Space AI 등 커스텀 합성) → 눈에 띄는 **하위 부품명**(Badge·Button·Icon 등)을 각각 `check_component_name`/`resolve_figma_component`로 개별 조회해, 매칭되는 것만 반영하고 나머지는 `[확인 필요]`.
5. **근거가 필요한 Guideline**은 `ods-hermes…retrieve_ods_evidence`로 문서 근거를 붙인다.
6. 조회 결과는 **description에 자연스럽게 녹인다** — MCP 호출 과정 자체를 사용자에게 장황히 나열하지 않는다.

도구 이름 접두사는 `mcp__plugin_bucketplace-product-design_ods-prototype__` / `...ods-hermes__` 이다. (플러그인 설치 형태에 따라 접두사가 다를 수 있으니, 안 보이면 `ToolSearch`로 `ods-prototype` 검색해 실제 이름을 확인한다.)

| 쓰임 | 도구 (접두사 생략) | 반영 섹션 |
|------|------|-----------|
| Figma 노드 → ODS 컴포넌트 매핑 | `ods-prototype…resolve_figma_component` | Context·Anatomy |
| 정식 컴포넌트명 확인 (BDS/legacy 걸러내기) | `ods-prototype…check_component_name` | 전체 용어 |
| props / canonical usage | `ods-prototype…get_component` | Anatomy·Guidelines |
| 색·스페이싱·타이포 토큰 | `ods-prototype…get_tokens` | Theme·Anatomy(토큰명 인용) |
| 전체 컴포넌트 목록 | `ods-prototype…list_components` | Anatomy |
| 아이콘·에셋 검색 | `ods-prototype…search_icon` / `search_asset` | Anatomy |
| 문서 근거·판단 이유 | `ods-hermes…retrieve_ods_evidence` | Guidelines(근거) |

**출력 규칙 (중요):** ODS 조회 결과는 **용어·구조 파악을 위한 내부 참고**로만 쓴다. 명세(출력)에는 ODS 토큰명(예: `backgroundWeak`)·아이콘 에셋명(예: `[Asset] Sparkles Small`)·구체 스타일 값(hex, radius 등)을 **적지 않는다.** 오직 **컴포넌트가 실제로 특정 ODS 컴포넌트를 사용/구성한 경우에만** 그 ODS 컴포넌트명을 언급한다. (단순히 "비슷해 보인다"는 매핑 결과는 명세에 쓰지 않는다.) 실제 사용이 확인되면 **Anatomy 해당 요소에 `참조: ODS <이름>` 형식**으로 적는다(위 출력 포맷 참고).
주의: Space AI 같은 **커스텀 합성 컴포넌트**는 `resolve_figma_component`가 `resolved:false`를 줄 수 있다 — 이땐 하위 부품(Badge·Button 등) 이름으로 개별 조회하거나 `[확인 필요]`로 둔다.
(참고: 플러그인에 `/ods` 라우터 스킬이 별도로 있음 — 프로토타입 생성/근거 검색이 목적이면 그쪽을 쓴다.)

## 출력 포맷 (섹션 순서 고정)

각 섹션은 `이모지 + 굵은 섹션명` 칩으로 시작하고, 항목은 `번호 + 굵은 제목 + 설명 문단` 패턴을 따른다.

### 🧩 Component  *(맨 위, 항상)*
- description **맨 위**에 **이 명세가 어느 컴포넌트에 대한 것인지** 컴포넌트명을 표기하고, 사용자가 준 **컴포넌트 노드로 하이퍼링크**를 건다.
- 형태: `🧩 <컴포넌트명>` (예: `🧩 [SpaceAI] Add Button`). **node id 기반 링크**라 이름이 같아도 안 깨진다.
- 이 헤더가 **컴포넌트 ↔ description 연결점**이 되어, 나중에 수정할 때 서로 오갈 수 있다.
- 컴포넌트 node id를 모르면(노드 링크가 없으면) 텍스트만 둔다.

### 🎨 Theme  *(테마/Variant가 있을 때만)*
- 디바이스·환경에 따른 테마/사이즈 변형을 정의한다.
- 항목별로 `이름 (적용 환경)` + 설명.
- 예) Dark (PC) / Light (Tablet·Mobile). **테마 적용 규칙은 비즈니스 규칙이므로 모르면 `[확인 필요]`.**
- **테마/사이즈 variant가 없으면 이 섹션을 통째로 생략**하고, PC/모바일 변형 유무를 사용자에게 **묻지 않는다.**

### 📁 Context
- 컴포넌트가 무엇이고 어디서 무엇을 하는지 **한 문장**으로 정의.

### 🦴 Anatomy
- 컴포넌트를 구성하는 요소를 번호로 분해.
- 각 요소: 무엇을 감싸는/담는 요소인지 + 역할 + 상태(Selected/Unselected 등).
- 구성 요소가 **실제로 다른 컴포넌트를 참조/사용**하면(ODS든 트랙이든) 명시한다 — 요소 설명 **다음 줄에 별도 불릿(•)** 으로 `참조: <컴포넌트명>`을 넣는다. **앞 설명과 같은 줄에 두지 않는다(엔터 처리).** 서식은 Do/Don't 불릿과 동일(UNORDERED 리스트, indent 1).
  - **ODS면** `참조: ODS <이름>` (예: `참조: ODS IconButton`)
  - **트랙이면** `참조: <트랙 컴포넌트명>` (예: `참조: Circle Badge`)
- **엄격 기준**: `get_metadata`/`get_design_context`에서 **실제 인스턴스/사용**이 확인될 때만 적는다. 단순히 "닮았다"(커스텀 내부, medium/low 매핑)는 적지 않는다.
- **참조 대상이 없으면 `참조:`를 아예 쓰지 않는다.** (빈 `참조:` 표기나 "참조 없음" 같은 문구도 넣지 말 것 — 있을 때만 붙인다.)
- 참조 컴포넌트의 정의는 **중복 서술하지 말고 이름으로만 연결**한다. (그 컴포넌트는 자체 description이 따로 있을 수 있음)

### ✏️ Guidelines
- 사용 시 권장 규칙. **명령형 제목 + 이유** 패턴.
- 각 규칙에 `Do` / `Don't` 한 줄씩 포함.
- 제목과 본문·Do/Don't가 **서로 일치**하는지 반드시 확인(복붙 실수 금지).

### 👆 Behavior
- 인터랙션/동작을 `동작명(키워드) + 설명`으로 정리.
- 실제 동작은 이미지로 알 수 없으므로, 모르면 `[확인 필요]`.

## 작성 원칙
- **알 수 있는 것 vs 추측**을 구분한다.
  - 이미지로 확정 가능: Theme/Variant, Anatomy, Context, 일반 UX Guidelines
  - 추측만 가능(→ `[확인 필요]`): Behavior(실제 인터랙션), 테마 적용 규칙, 사용 맥락
- 문체·용어는 기존 description과 통일한다. (예: "~합니다", "Selected/Unselected", "pill 형태의 배경")
- 레이블 예시는 실제 컴포넌트의 텍스트를 그대로 인용한다.
- 여러 컴포넌트를 받으면 각각 같은 포맷으로 작성한다.

## 고정 규칙 (공통 — 매번 적용)
사용자가 따로 알려주지 않아도 아래는 기본값으로 적용한다.

### 테마 매핑
- **Dark = PC** 버전, **Light = Tablet / Mobile** 버전.
- 두 테마가 보이면 이 매핑으로 Theme 섹션을 채운다. (다른 매핑이 명시되면 그걸 우선)

### 문체 / 용어
- 종결어미는 "~합니다" 체로 통일.
- 선택 상태 용어: **Selected / Unselected**.
- 선택 표시 배경은 "**pill 형태의 배경**"으로 표현.
- 섹션 칩 이모지: 🎨 Theme · 📁 Context · 🦴 Anatomy · ✏️ Guidelines · 👆 Behavior.

### Guidelines 작성
- 각 규칙 = **명령형 제목 + 이유 본문 + Do 한 줄 + Don't 한 줄**.
- 제목 ↔ 본문 ↔ Do/Don't 내용이 **서로 일치**하는지 반드시 검증(복붙 금지).

## 피그마에 직접 반영하기 (텍스트 교체 / 항목 추가)
**중요: 사용자가 "피그마에 넣어줘/올려줘/교체해줘"라고 명시적으로 요청하기 전까지 피그마에 직접 쓰지 않는다.** 기본은 채팅에 텍스트로만 작성해 보여주고, 끝에 "피그마에 반영할까요?"로 물어본 뒤 확답을 받고 실행한다.

요청을 받으면 `use_figma`로 직접 편집한다.
(사전에 `resource:figma-use` 스킬 로드 필수. `skillNames`에 `resource:figma-use` 전달.)

### 새 description 배치 위치
- **위치는 사용자에게 최초 1회 물어서 정한다** (위 "호출되면 먼저 할 일" 참고). 정해진 위치가 없으면 반영 직전에 반드시 묻는다: "어느 페이지/프레임에 넣을까요?"
- 정해진 위치의 페이지로 `await figma.setCurrentPageAsync` 이동 → 템플릿을 clone해 append → 기존 description들과 같은 열/간격으로 정렬.
- 템플릿(예: 기존 Description 프레임)이 다른 페이지에 있으면 clone 후 대상 페이지로 옮긴다.
- 이 프로젝트(gina, fileKey `wTKVQLp8fZ8Or8378mVcBJ`) 기본값: **"Component Library" 페이지**(canvas `1810:9134`), 템플릿 `1801:8975`. (다른 사용자/파일은 각자 지정)

### 컴포넌트 + description 섹션 묶기 (기본)
피그마에 반영할 때, **컴포넌트와 그 description을 하나의 Section으로 묶는다.**
1. `figma.createSection()`으로 섹션 생성 → 이름 = **컴포넌트명**(이모지 포함, 예: `🚀 Add Button`).
2. **원본 컴포넌트를 섹션으로 이동**한다(`section.appendChild(componentNode)`). 사용자가 준 그 컴포넌트 노드를 옮긴다 — 인스턴스가 아니라 **원본 이동**(기존 인스턴스는 안 깨진다). component set(변형 다수)이면 set 전체를 옮긴다.
3. description 프레임도 섹션에 넣고 **컴포넌트=왼쪽 / description=오른쪽, 상단 정렬**로 배치한다.
   - **컴포넌트 ↔ description 간격 = 40**
   - 두 요소(콘텐츠) 기준 **상하좌우 패딩 = 100** → 컴포넌트·description을 `(section 좌상단 + 100, +100)`에 두고, description은 `컴포넌트 오른쪽 + 40`.
   - 섹션 크기는 `resizeWithoutConstraints`로 **콘텐츠 + 패딩 100**에 맞춘다. (children를 옮기면 섹션이 재배치될 수 있으니, 위치는 마지막에 정리)
4. 섹션 스타일:
   - **stroke 제거**: `section.strokes = []`
   - **배경 `#333333`**: `section.fills = [{ type:'SOLID', color:{ r:0.2, g:0.2, b:0.2 } }]`
5. 섹션은 배치 위치(Component Library 페이지)에 둔다.
- 참고 구조: `Section '🚀 Add Button' { [원본 컴포넌트], [Description 프레임] }` (기준 예시 node `1852:9033`).

### 컴포넌트 참조 헤더 (맨 위 — 컴포넌트↔description 앵커)
- 새 description을 만들면 프레임 **맨 위**에 `🧩 <컴포넌트명>` 텍스트를 넣고, 사용자가 준 **컴포넌트 node id**로 `setRangeHyperlink(start, end, { type: 'NODE', value: '<componentNodeId>' })`를 건다.
- 템플릿에 헤더 슬롯이 없으면 `figma.createText()`로 만들어(폰트 로드 후) 프레임의 **첫 자식**으로 `insertChild(0, headerText)` 한다. 스타일은 섹션 제목 톤에 맞춘다.
- 이렇게 하면 이후 "1 만들고 2 하다가 1 수정" 시, 이 헤더 링크로 컴포넌트↔명세를 오가며 **live로 다시 읽어** 수정할 수 있다. (세션 기억이 아니라 피그마가 원본)

### 참조 컴포넌트 링크 (이름 무관, node id 기반)
Anatomy의 `참조: <컴포넌트명>`을 피그마에 쓸 때는 **텍스트가 아니라 참조 컴포넌트 노드로 가는 하이퍼링크**로 만든다. 이름이 아니라 node id로 걸어 **동명 컴포넌트가 있어도 안 깨진다.**
0. **새 줄 불릿으로 넣는다**: 본문 = `설명…\n참조: <이름>`, 그리고 `참조: <이름>` 줄에 `setRangeListOptions(UNORDERED)` + `setRangeIndentation(1)` 적용(Do/Don't 불릿과 동일). 앞 설명과 같은 줄에 두지 않는다.
1. 작업 순서 5에서 캡처한 참조 대상의 `mainComponent.id`를 사용한다.
2. 텍스트 노드에서 `참조: <이름>` 중 **`<이름>` 구간**의 start/end를 구해, 폰트 로드 후 `textNode.setRangeHyperlink(start, end, { type: 'NODE', value: '<mainComponentId>' })`를 적용한다.
3. 링크는 컴포넌트 **정의(mainComponent)** 를 가리킨다. (인스턴스가 아님)
4. mainComponent id를 못 구하면 링크 없이 텍스트만 두고 `[확인 필요]` 취급하지 않는다(이름은 유지).

### 텍스트 교체 (가장 흔함)
1. `get_metadata`로 대상 프레임의 텍스트 노드 ID를 찾는다.
2. 바꿀 노드의 `.characters`와 `getStyledTextSegments(["fontName"])`로 폰트를 확인.
3. **부분 교체**가 안전: `loadFontAsync` → `deleteCharacters(start,end)` → `insertCharacters(start, 새텍스트, "AFTER")`.
   - 전체를 `.characters =` 로 덮으면 Do/Don't 불릿 리스트 서식이 날아갈 수 있으니, 바꿀 구간만 부분 교체.
4. `mutatedNodeIds` 반환 + 스크린샷으로 검증.

### 항목/섹션 추가
- 새로 그리지 말고 **기존 동일 항목 프레임을 `clone()`** → 같은 Content 프레임에 `appendChild`(auto-layout이라 자동 재배치) → 제목·본문 텍스트만 교체.
- 번호 뱃지(🌀 Circle/Square Badge)가 텍스트면 같이 수정, 컴포넌트 variant면 속성 확인.
- 항목 프레임 구조: `항목 ├─ Subtitle(🌀 Circle Badge + 제목 텍스트) └─ 본문 텍스트`.

## 참고: 폰트 / 구조 메모
- 본문 폰트: **Pretendard Medium** (Tab Button description 기준).
- Description 프레임 구조: 최상위 `Description` 프레임 안에 섹션 프레임들, 각 섹션은 `🌀 Square Badge`(섹션 칩) + `Content`(항목들).

## 참고 (기준 예시)
- 파일: Space AI Component Library (fileKey `wTKVQLp8fZ8Or8378mVcBJ`)
- 기준 컴포넌트: Tab Button (node 189-901)
- 기준 description(최종본): node 1799-8914 / 1801-8975 (Theme·Do/Don't 포함, Guidelines 3번 수정 완료)

<!-- 업데이트 영역: 사용자가 새 노드/예시를 주면 아래에 누적 기록 -->
## 예시 모음 (업데이트)
- **Tab Button** (node 189-901): 첫 번째 탭 영역에서 카테고리를 전환하는 개별 탭 버튼.
  - Theme: Dark(PC) / Light(Tablet·Mobile)
  - Anatomy: 컨테이너 / 탭 버튼(Selected·Unselected, pill 배경)
  - Guidelines: ①탭 3개 유지 ②레이블 텍스트로 짧고 명확 ③항상 하나 선택 유지
  - Behavior: Scroll(탭 고정·하단만 스크롤) / Switch(선택 탭 이동)
