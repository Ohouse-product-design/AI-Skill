# 디자인 컴포넌트

> Button, Input, Textarea, Select, Dropdown, Radio/Checkbox, Table, Pagination, Modal, Snackbar 등 UI 컴포넌트 스펙.

## 8. 컴포넌트

> 모든 컴포넌트는 **사이즈 → 상태(States) → 레이아웃 → 코드 예시** 순서로 기술한다.

---

### 8-1. Button

**사이즈**

| 사이즈 | Height | Padding (좌우) | Font | 용도 |
|--------|--------|----------------|------|------|
| Large | 50px | 20px | Body2 (14px) | 모달 하단, 주요 CTA |
| Medium | 40px | 16px | Body2 (14px) | 기본 버튼 |
| Small | 32px | 12px | Caption (12px) | 테이블 내, 인라인 |

**상태: Default**

| Variant | 배경색 | 텍스트색 | 테두리 | 용도 |
|---------|--------|----------|--------|------|
| Primary | #0AA5FF | #FFFFFF | 없음 | 주요 액션 (검색, 등록, 확인) |
| Secondary | #FFFFFF | #2F3438 | 1px #EAEDEF | 보조 액션 (취소, 초기화) |
| Outline | #FFFFFF | #0AA5FF | 1px #0AA5FF | 서브 액션 (엑셀 다운로드, 조회하기) |
| Destructive | #FFFFFF | #F05656 | 1px #F05656 | 위험 서브 액션 (삭제) |

**상태: Hover**

| Variant | 배경색 | 텍스트색 | 테두리 |
|---------|--------|----------|--------|
| Primary | #0198ED | #FFFFFF | 없음 |
| Secondary | #F7F9FA | #2F3438 | 1px #EAEDEF |
| Outline | #E3F3FD | #0AA5FF | 1px #0AA5FF |
| Destructive | #FFEDED | #F05656 | 1px #F05656 |

**상태: Disabled**

| Variant | 배경색 | 텍스트색 | 테두리 |
|---------|--------|----------|--------|
| Primary | #EAEDEF | #C2C8CC | 없음 |
| Secondary | #F7F9FA | #C2C8CC | 1px #EAEDEF |
| Outline | #F7F9FA | #C2C8CC | 1px #EAEDEF |
| Destructive | #F7F9FA | #C2C8CC | 1px #EAEDEF |

**공통 스타일**

| 속성 | 값 |
|------|-----|
| Border Radius | 4px |
| Disabled | cursor: not-allowed |
| 아이콘 + 텍스트 간격 | gap 4px |
| 텍스트 규칙 | 한 줄 유지 (`whitespace-nowrap` 필수), 텍스트 길이에 따라 width 가변 |
| flex 컨테이너 내부 | `shrink-0` 함께 적용 (부모 공간 부족 시 버튼이 압축되어 텍스트가 줄바꿈되는 것 방지) |

**코드 예시**

```tsx
{/* Primary - Medium — whitespace-nowrap 필수. flex 내부라면 shrink-0 추가 */}
<button className="h-[40px] px-[16px] bg-[#0AA5FF] text-white text-[14px] font-normal rounded-[4px] whitespace-nowrap hover:bg-[#0198ED] disabled:bg-[#EAEDEF] disabled:text-[#C2C8CC] disabled:cursor-not-allowed">
  검색
</button>

{/* Secondary - Medium */}
<button className="h-[40px] px-[16px] bg-white text-[#2F3438] text-[14px] font-normal rounded-[4px] border border-[#EAEDEF] whitespace-nowrap hover:bg-[#F7F9FA] disabled:bg-[#F7F9FA] disabled:text-[#C2C8CC] disabled:cursor-not-allowed">
  초기화
</button>

{/* Outline - Medium */}
<button className="h-[40px] px-[16px] bg-white text-[#0AA5FF] text-[14px] font-normal rounded-[4px] border border-[#0AA5FF] whitespace-nowrap hover:bg-[#E3F3FD] disabled:bg-[#F7F9FA] disabled:text-[#C2C8CC] disabled:border-[#EAEDEF] disabled:cursor-not-allowed">
  엑셀 다운로드
</button>

{/* Destructive - Medium */}
<button className="h-[40px] px-[16px] bg-white text-[#F05656] text-[14px] font-normal rounded-[4px] border border-[#F05656] whitespace-nowrap hover:bg-[#FFEDED] disabled:bg-[#F7F9FA] disabled:text-[#C2C8CC] disabled:border-[#EAEDEF] disabled:cursor-not-allowed">
  삭제
</button>
```

---

### 8-2. Input

**사이즈**

| 사이즈 | Width | 용도 |
|--------|-------|---------|
| Small (기본) | 240px | `maxLength < 40` |
| Large | 488px | `maxLength >= 40` 또는 spec doc에 Large 명시 |

> ⚠️ **사이즈는 "입력 가능성"이 아닌 `maxLength` 값으로 기계적으로 결정한다.** 예상 콘텐츠 길이로 판단 금지.

**고정 규격 (공통)**

| 속성 | 값 |
|------|-----|
| Height | 32px |
| Font | Body2 (`text-[14px] font-normal`) |
| Text Align | left |
| Padding-left | 8px |
| Border Radius | 4px |
| Border | 1px |
| 글자수 카운터 위치 | **입력창 외부 하단**, 우측 정렬, 입력창과 4px 간격 |
| 글자수 카운터 스타일 | Caption (`text-[12px]`), #828C94 |

> ⚠️ 글자수 카운터는 반드시 **입력창 바깥 아래**에 별도 줄로 배치한다.
> 입력창 내부에 `absolute`로 얹으면 입력 텍스트와 시각적으로 충돌한다.

**❌ 금지 패턴**

- ❌ Input의 글자수 카운터를 입력창 내부에 `absolute` 로 배치하는 것
- ❌ Input 우측에 padding을 주어 카운터 공간을 확보하고 내부에 얹는 것

**상태**

| State | 배경색 | 테두리 | 텍스트색 | Placeholder색 |
|-------|--------|--------|----------|---------------|
| Default | #FFFFFF | 1px #EAEDEF | #2F3438 | #C2C8CC |
| Pressed (focus, empty) | #FFFFFF | 1px #0AA5FF | #2F3438 | #C2C8CC |
| Typing (focus, filled) | #FFFFFF | 1px #EAEDEF | #2F3438 | — |
| Disabled | #F7F9FA | 1px #EAEDEF | #C2C8CC | — |
| Error | #FFFFFF | 1px #F05656 | — | #C2C8CC |

**Error 상태 규칙**

| 속성 | 값 |
|------|-----|
| 에러 메시지 위치 | 테두리 하단에서 8px 간격 |
| 에러 메시지 색상 | #F05656 |
| 에러 메시지 Font | Caption (12px) |
| 에러 메시지 텍스트 | "입력해주세요." |

**Placeholder 규칙**

- Placeholder는 타이틀의 텍스트 값을 따라감
- ❌ Disabled 상태에서 '-'라고 표기하지 않음

**타이틀 사용 규칙** (→ Input & Select 공통)

| 속성 | 값 |
|------|-----|
| 타이틀 위치 | Input 상단 (세로 정렬) |
| 타이틀 텍스트 | Body2 (`text-[14px] font-normal`), 색상 #2F3438 |
| 타이틀-요소 간격 | 8px |
| 기본 배치 | 한 행에 하나의 필드 (타이틀 + Input) |
| 예외 | Spec doc에 필드 그룹핑 지시가 있을 경우에만 한 행에 여러 필드 배치 |

**코드 예시**

```tsx
{/* Default */}
<input
  className="h-[32px] px-[8px] bg-white text-[14px] text-[#2F3438] placeholder-[#C2C8CC] border border-[#EAEDEF] rounded-[4px] focus:border-[#0AA5FF] focus:outline-none"
  placeholder="입력해주세요"
/>

{/* Disabled */}
<input
  className="h-[32px] px-[8px] bg-[#F7F9FA] text-[14px] text-[#C2C8CC] border border-[#EAEDEF] rounded-[4px]"
  disabled
/>

{/* Error */}
<input
  className="h-[32px] px-[8px] bg-white text-[14px] text-[#2F3438] border border-[#F05656] rounded-[4px]"
/>

{/* 글자수 카운터 포함 — 카운터는 입력창 외부 하단, 우측 정렬 */}
<div>
  <input
    className="h-[32px] w-[488px] px-[8px] bg-white text-[14px] text-[#2F3438] placeholder-[#C2C8CC] border border-[#EAEDEF] rounded-[4px] focus:border-[#0AA5FF] focus:outline-none"
    placeholder="입력해주세요"
    maxLength={50}
  />
  <div className="text-right text-[12px] text-[#828C94] mt-[4px]">
    0/50
  </div>
</div>
```

---

### 8-3. Textarea

**고정 규격**

| 속성 | 값 |
|------|-----|
| Width | 100% (기본) |
| Height | 100px |
| Padding | 12px |
| Font | Body2 (`text-[14px] font-normal`) |
| Border Radius | 4px |
| Border | 1px #EAEDEF |
| Resize | none |
| 글자수 카운터 위치 | **입력창 외부 하단**, 우측 정렬, 입력창과 4px 간격 (Input과 동일 규칙) |
| 글자수 카운터 스타일 | Caption (`text-[12px]`), #828C94 |

> ⚠️ Input과 동일하게 카운터는 입력창 **바깥 아래**에 별도 줄로 배치한다.

**❌ 금지 패턴**

- ❌ Textarea의 글자수 카운터를 입력창 내부에 `absolute` 로 얹는 것

**코드 예시**

```tsx
<div>
  <textarea
    className="w-full h-[100px] p-[12px] bg-white text-[14px] text-[#2F3438] placeholder-[#C2C8CC] border border-[#EAEDEF] rounded-[4px] resize-none focus:border-[#0AA5FF] focus:outline-none"
    placeholder="메모 입력"
    maxLength={100}
  />
  <div className="text-right text-[12px] text-[#828C94] mt-[4px]">
    0/100
  </div>
</div>
```

---

### 8-4. Select

**사이즈**

| 속성 | 값 |
|------|-----|
| Height | 32px |
| Width | 240px (기본, 가변 가능) |
| Border Radius | 4px |
| Padding | 좌 14px, 우 14px |
| 텍스트 | Body2 (`text-[14px] font-normal`), 왼쪽 정렬 |
| Placeholder | 타이틀 값과 동일하게 표시 |
| 아이콘 | 우측 정렬, 24×24 |

**아이콘 SVG**

> ⚠️ Select 클릭 시 Dropdown이 노출되어도 아이콘은 변경되지 않음

```tsx
// Icons.tsx에서 import하여 사용
import { SelectArrowIcon } from "@/components/Icons";
<SelectArrowIcon className="shrink-0 text-[#828C94]" />
```

**상태**

| 상태 | 배경색 | 텍스트색 | 테두리 | 아이콘색 |
|------|--------|----------|--------|----------|
| Default | #FFFFFF | #C2C8CC | #EAEDEF | #828C94 |
| Filled | #FFFFFF | #2F3438 | #EAEDEF | #828C94 |
| Hover | #F7F9FA | #2F3438 | #EAEDEF | #828C94 |
| Pressed | #F7F9FA | #C2C8CC | #0AA5FF | #828C94 |
| Disabled | #F7F9FA | #C2C8CC | #EAEDEF | #828C94 |
| Read Only | #F7F9FA | #2F3438 | #EAEDEF | #828C94 |
| Error | #FFFFFF | #2F3438 | #F05656 | #F05656 |

**Error 상태 규칙**

| 속성 | 값 |
|------|-----|
| 에러 메시지 위치 | 테두리 하단에서 8px 간격 |
| 에러 메시지 색상 | #F05656 |
| 에러 메시지 Font | Caption (12px) |
| 에러 메시지 텍스트 | "선택해주세요." |
| 재클릭 시 | Error → Pressed 상태로 전환 |

**코드 예시**

> ⚠️ 트리거 테두리는 `isOpen` 상태에 따라 반드시 토글한다. 드롭다운이 열린 동안 `border-[#0AA5FF]`로 **Pressed 상태**를 시각화해야 한다.

```tsx
const [isOpen, setIsOpen] = useState(false);
const [value, setValue] = useState("");

{/* Default / Filled / Pressed 통합 — isOpen으로 테두리 토글 */}
<div
  onClick={() => setIsOpen(prev => !prev)}
  className={`h-[32px] w-[240px] px-[14px] bg-white border ${isOpen ? "border-[#0AA5FF]" : "border-[#EAEDEF]"} rounded-[4px] flex items-center justify-between cursor-pointer hover:bg-[#F7F9FA]`}
>
  <span className={`text-[14px] font-normal ${value ? "text-[#2F3438]" : "text-[#C2C8CC]"}`}>
    {value || "선택하세요"}
  </span>
  <SelectArrowIcon />
</div>

{/* Error */}
<div className="h-[32px] w-[240px] px-[14px] bg-white border border-[#F05656] rounded-[4px] flex items-center justify-between cursor-pointer">
  <span className="text-[14px] font-normal text-[#2F3438]">선택된 값</span>
  <SelectArrowIcon className="text-[#F05656]" />
</div>
```

**❌ 금지 패턴**
- ❌ 트리거 테두리를 `border-[#EAEDEF]`로 고정하는 것 → 열려있는데도 Pressed 표시 안 됨
- ❌ `isOpen` 상태 없이 정적 렌더링

---

### 8-5. Dropdown
 
**사이즈**
 
| 속성 | 값 |
|------|-----|
| Width | 240px (기본, 가변 가능) |
| Max Height | 470px (스크롤 적용) |
| Border | 1px #EAEDEF |
| Border Radius | 4px |
| Border Padding | 4px (상하) |
| Background | #FFFFFF |
| Shadow | 0px 2px 8px rgba(0,0,0,0.1) |
 
**Dropdown Item**
 
| 속성 | 값 |
|------|-----|
| Height | auto (텍스트 길이에 따라 가변) |
| Padding | 상하 12px, 좌 14px |
| 텍스트 | Body2 (`text-[14px] font-normal`), 왼쪽 정렬 |
 
**Dropdown Item 상태**
 
| 상태 | 배경색 | 텍스트 색상 |
|------|--------|------------|
| Default | #FFFFFF | #2F3438 |
| Hover | #F7F9FA | #2F3438 |
| Selected | #F7F9FA | #2F3438 |
 
**샘플 데이터 규칙**
 
- Spec doc에 항목이 없으면 Select 타이틀/Placeholder 맥락에 맞는 샘플 옵션을 자동 생성
 
**코드 예시**
 
```tsx
{/* Dropdown 전체 구조 */}
<div className="absolute top-[36px] left-0 w-[240px] bg-white border border-[#EAEDEF] rounded-[4px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] z-10 py-[4px] max-h-[470px] overflow-y-auto">
  {/* Default */}
  <div className="px-[14px] py-[12px] text-[14px] font-normal text-[#2F3438] cursor-pointer hover:bg-[#F7F9FA]">
    옵션 1
  </div>
 
  {/* Hover */}
  <div className="px-[14px] py-[12px] text-[14px] font-normal text-[#2F3438] cursor-pointer bg-[#F7F9FA]">
    옵션 2
  </div>
 
  {/* Selected */}
  <div className="px-[14px] py-[12px] text-[14px] font-normal text-[#2F3438] cursor-pointer bg-[#F7F9FA]">
    옵션 3
  </div>
</div>
```

---

### 8-6. Radio / Checkbox

#### Radio

**배치 규칙**

| 속성 | 값 |
|------|-----|
| 배치 방향 | 가로 배치 |
| 옵션 간격 | 40px |

**아이콘 — Icons.tsx에서 import하여 사용**

```tsx
import { RadioInactive, RadioActive, RadioError } from "@/components/Icons";

// Inactive: <RadioInactive />
// Active:   <RadioActive />
// Error:    <RadioError />
```

#### Checkbox

**배치 규칙**

| 속성 | 값 |
|------|-----|
| 배치 방향 | 가로 배치 |
| 옵션 간격 | 24px |

**아이콘 — Icons.tsx에서 import하여 사용**

```tsx
import { CheckboxInactive, CheckboxActive, CheckboxError } from "@/components/Icons";

// Inactive: <CheckboxInactive />
// Active:   <CheckboxActive />
// Error:    <CheckboxError />
```

---

### 8-7. Table

#### 공통 스타일

**⚠️ 테두리 필수 규칙 (최우선 적용)**

> **테이블의 모든 경계선은 시각적으로 1px #EAEDEF로 균일해야 한다.**
> 셀 간, 헤더-바디 간, 최외곽 모두 예외 없이 1px. 어디서든 2px로 보이면 구현 오류다.

**핵심 원칙: 1px 균일 테두리**

테이블 border는 **두 가지 메커니즘**으로 1px을 보장한다:

1. **셀 border + `border-collapse`** — 모든 `<th>`, `<td>`에 `border border-[#EAEDEF]`를 주고, `<table>`에 `border-collapse`를 적용한다. 인접 셀의 border가 만나는 경계는 자동으로 1px로 병합된다.
2. **인접 요소와의 겹침 방지** — 테이블 외부 요소(감싸는 div, 상단 액션 영역 등)의 border가 셀 border와 겹치면 2px가 된다. 이를 방지하기 위해:
   - `<table>` 자체에는 `border`를 **주지 않는다** (셀 border만으로 최외곽 형성)
   - 상단 액션 영역 등 인접 요소는 테이블과 맞닿는 변의 border를 제거한다 (예: `border-b-0`)

**필수 Tailwind 적용 코드:**

```tsx
{/* 기본 테이블: <table>에는 border 없음, 셀에만 border */}
<table className="w-full border-collapse">
  <thead>
    <tr>
      <th className="border border-[#EAEDEF] ...">컬럼명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="border border-[#EAEDEF] ...">데이터</td>
    </tr>
  </tbody>
</table>
```

**❌ 금지 패턴 (2px가 되는 모든 원인):**

| 금지 패턴 | 결과 | 올바른 방법 |
|-----------|------|-----------|
| `<table>`에 `border border-[#EAEDEF]` 추가 | 최외곽 셀 border와 겹쳐 2px | `<table>`에는 `border-collapse`만, border 없음 |
| 감싸는 `<div>`에 `border` 추가 | 외곽 셀 border와 겹쳐 2px | 감싸는 div에 border 없음 |
| 상단 액션 영역에 하단 border 포함 | th 상단 border와 겹쳐 2px | `border-b-0`으로 하단 제거 |
| `border-collapse` 누락 | 인접 셀 간 2px | `border-collapse` 필수 |
| `border-b`만 적용 | 좌우 테두리 누락 | 4방향 `border` 필수 |
| Header에만 border, Body 생략 | Body 테두리 누락 | 모든 셀에 border 필수 |
| 마지막 Row 하단 border 생략 | 하단 테두리 누락 | 마지막 Row 포함 전체 적용 |

---

**Table Header**

> ⚠️ 텍스트 크기, 컬러, 정렬 등 변경 금지

| 속성 | 값 |
|------|-----|
| 배경색 | #F7F9FA |
| 텍스트 | Body2 (14px), #828C94 |
| Padding | 상하 14px, 좌우 16px |
| 정렬 | 좌측 정렬 |
| **테두리** | **상하좌우 1px #EAEDEF (필수, 생략 금지)** |
| Cell Height | 48px 고정 |

**Table Row**

| 속성 | 값 |
|------|-----|
| 배경색 | #FFFFFF |
| 배경색 (Hover) | #F7F9FA |
| 텍스트 | Body2 (14px), #2F3438 |
| Padding | 상하 14px, 좌우 16px |
| 정렬 | 좌우: 왼쪽 정렬, 상하: 가운데 정렬 |
| **테두리** | **상하좌우 1px #EAEDEF (필수, 생략 금지, 마지막 Row 포함)** |

**Table Cell 유형**

| 유형 | 스타일 | 비고 |
|------|--------|------|
| 일반 텍스트 | #2F3438 | 기본 |
| 링크 | #0AA5FF, `cursor-pointer` | 클릭 시 모달 또는 페이지 이동 |
| 링크 + 화살표 | #0AA5FF + " >" | 액션 유도 (예: "수수료율 설정하기 >") |
| 강조 텍스트 | #F05656 (빨강) 또는 #0AA5FF (파랑) | 주요 수치, 상태 강조 |
| 날짜/시간 | #2F3438, 형식: YYYY.MM.DD HH:mm:ss | — |
| 상태 (활성) | ● #0AA5FF + "활성" 텍스트 #2F3438 | 아이콘만 Primary 컬러 |
| 상태 (비활성) | ● #EAEDEF + "비활성" 텍스트 #2F3438 | 아이콘만 Muted 컬러 |
| 버튼 | Small 사이즈 (Height 32px) | 중앙정렬 |

**❌ 컬러 금지 규칙**

- **클릭 불가능한 텍스트에 Primary (#0AA5FF) 사용 금지**: Primary 컬러는 클릭 가능한 요소(링크, 버튼 텍스트)에만 사용
- ✅ 클릭 가능한 링크 텍스트 → `text-[#0AA5FF]` + `cursor-pointer`
- ❌ 상태 라벨 "활성" → `text-[#0AA5FF]` (금지)
- ✅ 상태 라벨 "활성" → `text-[#2F3438]` (아이콘만 Primary 컬러 허용)

#### Type 1: DataTable (기본)

- 데이터 목록 표시용
- 체크박스 없음

#### Type 2: DataTable (행 선택 가능)

- 데이터 목록 표시 + 다중 선택 기능
- 좌측 첫 번째 컬럼에 체크박스 추가

| 속성 | 값 |
|------|-----|
| 체크박스 위치 | 첫 번째 컬럼 |
| Header 체크박스 | 전체 선택 |
| 체크박스 사이즈 | 18×18 |
| 체크박스 컬럼 width | 48px (고정) |

- 체크박스 아이콘: → 8-6. Checkbox 아이콘 SVG 참조

#### Type 3: ControlTable (상단 액션 포함)

- 상단에 탭 네비게이션 또는 액션 버튼 영역 포함
- 탭/버튼 선택에 따라 테이블 데이터 변경 또는 액션 수행
- 체크박스 포함 여부는 선택적

**컨테이너 래퍼 규칙 (3겹 구조)**

> ⚠️ ControlTable은 **3겹 구조**로 감싼다. 상단 액션바와 테이블의 스크롤 동작을 분리하기 위해 필수.
>
> **각 레이어 역할:**
> 1. **최외곽 wrapper** (`rounded-[4px]`) — border/overflow 둘 다 없음. 오직 radius와 그룹핑 역할.
> 2. **상단 액션바** (`border border-[#EAEDEF] border-b-0`) — 최외곽 wrapper 안에 **직접 배치**. 부모 폭에 고정되어 스크롤에 영향받지 않음.
> 3. **테이블 스크롤 래퍼** (`overflow-x-auto`) — 테이블만 감쌈. 넓은 테이블은 이 안에서만 수평 스크롤.

```tsx
{/* ✅ 올바른 패턴 (3겹 구조) */}
<div className="rounded-[4px]">
  {/* Layer 2: 액션바 (스크롤 영향 없음, 부모 폭 고정) */}
  <div className="bg-[#F7F9FA] border border-[#EAEDEF] border-b-0 px-[16px] py-[16px] flex items-center justify-between">
    ...버튼들...
  </div>
  {/* Layer 3: 테이블만 수평 스크롤 */}
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead><tr><th className="border border-[#EAEDEF] ...">...</th></tr></thead>
      <tbody><tr><td className="border border-[#EAEDEF] ...">...</td></tr></tbody>
    </table>
  </div>
</div>
```

**❌ 금지 패턴**
- ❌ **액션바 + 테이블을 같은 overflow 컨테이너에 넣는 것** — 테이블 스크롤 시 액션바도 같이 움직여서 하단 셀이 상단 액션바 폭 밖으로 튀어나가는 시각적 어긋남 발생
- ❌ `overflow-hidden`: 컬럼 많을 때 초과분이 시각적으로 잘려 사라짐 (스크롤 불가)
- ❌ overflow 속성 없음(기본 visible): 컬럼이 컨테이너 밖으로 삐져나가 레이아웃을 깨뜨림
- ❌ 최외곽 wrapper에 border: 내부 셀 border와 겹쳐 2px 됨
- ✅ `overflow-x-auto`는 **Layer 3(테이블 래퍼)에만**

**상단 액션 영역**

| 속성 | 값 |
|------|-----|
| 좌측 버튼 | 데이터 조작 액션 (예: +일괄등록, 발주서전송, 발주마감, 발주취소) |
| 우측 버튼 | 다운로드/내보내기 액션 (예: 즉시 다운로드, 엑셀 다운로드) |
| 버튼 사이즈 | Small (Height 32px) |
| 버튼 스타일 | Outline (기본), Destructive (삭제/취소), Primary (주요 액션) |
| 버튼 간격 | 8px |
| 액션 영역 Padding | 좌우 16px, 상하 16px |
| 액션 영역 테두리 | 상·좌·우 1px #EAEDEF, **하단 제외** (`border border-[#EAEDEF] border-b-0`) — 테이블 th 상단 border와 겹침 방지 |
| 액션 영역 배경색 | #F7F9FA |
| Cell Height | 64px 고정 |

#### Type 4: EmptyTable (데이터 없음)

| 속성 | 값 |
|------|-----|
| Header | 표시 (컬럼 구조 유지) |
| 메시지 위치 | 테이블 Body 중앙 정렬 |
| 메시지 텍스트 | Body2, #828C94 |
| 메시지 예시 | "검색 결과가 없습니다." (줄바꿈) "다시 검색해주세요." |
| 메시지 줄간격 | 4px |
| Body 최소 높이 | 200px |

**코드 예시**

```tsx
{/* Table - 모든 th, td에 border border-[#EAEDEF] 필수 */}
<table className="w-full border-collapse">
  <thead>
    <tr className="bg-[#F7F9FA]">
      <th className="border border-[#EAEDEF] px-[16px] py-[14px] text-left text-[14px] font-normal text-[#828C94]">컬럼명</th>
    </tr>
  </thead>
  <tbody>
    <tr className="hover:bg-[#F7F9FA]">
      <td className="border border-[#EAEDEF] px-[16px] py-[14px] text-[14px] text-[#2F3438]">데이터</td>
    </tr>
  </tbody>
</table>

{/* 상태 표시 */}
<span className="flex items-center gap-[4px] text-[14px] text-[#2F3438]">
  <span className="w-[6px] h-[6px] rounded-full bg-[#0AA5FF]"></span>
  활성
</span>

<span className="flex items-center gap-[4px] text-[14px] text-[#2F3438]">
  <span className="w-[6px] h-[6px] rounded-full bg-[#EAEDEF]"></span>
  비활성
</span>
```

#### Type 5: GroupedTable (그룹핑 테이블)

> ⚠️ **헤더는 반드시 단일 플랫 행으로 구성한다. 테이블 바디 안에 별도의 서브 헤더행을 삽입하지 않는다.**

마스터-서브 구조(예: 옵션 + SKU)가 있는 테이블은 모든 컬럼을 하나의 `<thead>` 행에 나열하고, `rowSpan`으로 마스터 셀을 병합한다.

**필수 규칙**

| 규칙 | 설명 |
|------|------|
| 단일 헤더 | `<thead>`에 한 줄의 `<tr>`만 존재. 마스터 컬럼 + 서브 컬럼 모두 포함 |
| rowSpan 병합 | 마스터 데이터(옵션 정보 등)는 첫 번째 서브행의 `<td>`에 `rowSpan={서브행 수}`로 병합 |
| 서브행 구분 | rowSpan 병합 + 테두리로 시각 구분. 임의 배경색 추가 금지 (행 배경은 #FFFFFF / hover #F7F9FA만 허용) |
| 정렬 | 마스터 셀은 `align-top` (상단 정렬) |

**❌ 금지 패턴**

- ❌ `<tbody>` 안에 서브 헤더 `<tr>`을 별도로 삽입하여 "컬럼 안에 컬럼" 구조를 만드는 것
- ❌ 마스터행과 서브행의 `<th>` / `<td>` 개수가 다른 것
- ❌ `colSpan`으로 마스터행 전체를 하나의 셀로 합쳐 별도 레이아웃처럼 보이게 하는 것

**코드 예시**

```tsx
<table className="w-full border-collapse">
  <thead>
    <tr className="bg-[#F7F9FA]">
      {/* 마스터 컬럼 */}
      <th className="border border-[#EAEDEF] ...">옵션ID</th>
      <th className="border border-[#EAEDEF] ...">옵션명</th>
      <th className="border border-[#EAEDEF] ...">옵션판매가능재고</th>
      {/* 서브 컬럼 */}
      <th className="border border-[#EAEDEF] ...">SKU코드</th>
      <th className="border border-[#EAEDEF] ...">SKU수량</th>
      <th className="border border-[#EAEDEF] ...">WMS재고</th>
    </tr>
  </thead>
  <tbody>
    {options.map((opt) => (
      <React.Fragment key={opt.optionId}>
        {opt.skus.map((sku, i) => (
          <tr key={i} className="hover:bg-[#F7F9FA]">
            {i === 0 && (
              <>
                <td rowSpan={opt.skus.length} className="border border-[#EAEDEF] ... align-top">{opt.optionId}</td>
                <td rowSpan={opt.skus.length} className="border border-[#EAEDEF] ... align-top">{opt.optionName}</td>
                <td rowSpan={opt.skus.length} className="border border-[#EAEDEF] ... align-top">{opt.availableStock}</td>
              </>
            )}
            <td className="border border-[#EAEDEF] ...">{sku.skuCode}</td>
            <td className="border border-[#EAEDEF] ...">{sku.skuQuantity}</td>
            <td className="border border-[#EAEDEF] ...">{sku.wmsStock}</td>
          </tr>
        ))}
      </React.Fragment>
    ))}
  </tbody>
</table>
```

---

### 8-8. Pagination

**구조**

```
[<] [1] [2] [3] [4] [5] [>]
```

**사이즈**

| 속성 | 값 |
|------|-----|
| 컨테이너 정렬 | 중앙 정렬, gap 4px |
| Border Radius | 4px |
| Font | Body2 (14px) |

**상태**

| 요소 | 사이즈 | 배경색 | 테두리 | 텍스트/아이콘색 |
|------|--------|--------|--------|-----------------|
| 화살표 버튼 | 32×32px | #FFFFFF | 1px #EAEDEF | #828C94 |
| 화살표 버튼 (Disabled) | 32×32px | #F7F9FA | — | #C2C8CC |
| 페이지 번호 | 32×32px | #FFFFFF | — | #2F3438 |
| 페이지 번호 (Active) | 32×32px | #0AA5FF | — | #FFFFFF |
| 페이지 번호 (Hover) | 32×32px | #F7F9FA | — | #2F3438 |

**코드 예시**

```tsx
<div className="flex items-center justify-center gap-[4px]">
  {/* 이전 버튼 — Icons.tsx에서 import */}
  <button className="w-[32px] h-[32px] flex items-center justify-center bg-white border border-[#EAEDEF] rounded-[4px] hover:bg-[#F7F9FA] text-[#828C94]">
    <PaginationPrev />
  </button>

  {/* Active */}
  <button className="w-[32px] h-[32px] flex items-center justify-center bg-[#0AA5FF] text-white text-[14px] rounded-[4px]">1</button>

  {/* Default */}
  <button className="w-[32px] h-[32px] flex items-center justify-center bg-white text-[#2F3438] text-[14px] rounded-[4px] hover:bg-[#F7F9FA]">2</button>

  {/* 다음 버튼 — Icons.tsx에서 import */}
  <button className="w-[32px] h-[32px] flex items-center justify-center bg-white border border-[#EAEDEF] rounded-[4px] hover:bg-[#F7F9FA] text-[#828C94]">
    <PaginationNext />
  </button>
</div>
```

---

### 8-9. Modal
 
#### 공통 스펙
 
**오버레이**
 
| 속성 | 값 |
|------|-----|
| Background | rgba(0, 0, 0, 0.5) |
| 클릭 동작 | 모달 외부 클릭 시 닫기 (선택적) |
 
**애니메이션 (선택적)**
 
| 속성 | 값 |
|------|-----|
| 진입 | fade-in + scale (0.95 → 1) |
| 퇴장 | fade-out + scale (1 → 0.95) |
| Duration | 200ms |
 
#### Type A: Info Modal (Width: 600px)
 
**용도**: 정보 조회, 폼 입력, 파일 첨부
 
**구조**
 
```
┌─────────────────────────────────────────────────────────────────┐
│                       Modal Title                          ✕    │  ← Header (66px)
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                        Body 영역                                │
│                    (좌우 padding 28px)                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│              [취소]                    [설정]                   │  ← Footer
└─────────────────────────────────────────────────────────────────┘
```
 
**사이즈**
 
| 속성 | 값 |
|------|-----|
| Width | 600px (고정) |
| Min Height | 300px |
| Max Height | 브라우저 높이 1000px 이하: 82vh / 1000px 이상: 888px |
| Border Radius | 8px |
| Background | #FFFFFF |
 
**Header**
 
| 속성 | 값 |
|------|-----|
| Height | 66px |
| Padding | 좌우 28px |
| 타이틀 | Heading2 (`text-[18px] font-semibold`), #2F3438, **수평·수직 중앙 정렬 필수** |
| 닫기 버튼 | 24×24 아이콘, 우측, 타이틀과 세로 중앙선 일치 |
| 하단 Border | 1px #EAEDEF |

> ⚠️ **3-item 레이아웃으로 구현한다.**
> 헤더 컨테이너는 `flex items-center justify-between`. 좌측 24×24 빈 spacer div + 중앙 타이틀 span + 우측 24×24 닫기 버튼을 배치하면 좌우 balance가 맞아 타이틀이 수평 중앙에 정확히 오고, 세 항목 모두 같은 flex line에 있어 세로 중앙선이 일치한다.
>
> `absolute` 배치 방식은 타이틀 span의 line-height와 닫기 버튼 24×24 박스 높이가 달라 세로 정렬이 미세하게 어긋난다. 3-item 레이아웃이 유일한 허용 패턴.

**❌ 금지 패턴**
- ❌ `<div className="flex justify-between"> <span>타이틀</span> <button>X</button> </div>` — spacer 없이 2-item만 배치하면 타이틀이 좌측으로 쏠림.
- ❌ `relative + justify-center` + `absolute right-[28px] top-1/2 -translate-y-1/2` 닫기 버튼 — 타이틀 text baseline과 24×24 아이콘 중앙이 어긋남.
 
**Body**
 
| 속성 | 값 |
|------|-----|
| Padding | 좌우 28px, 상하 24px |
| Overflow | auto (스크롤) |
 
**Footer**
 
| 속성 | 값 |
|------|-----|
| Padding | 좌우 28px, 상하 20px |
| 버튼 정렬 | 중앙 정렬 |
| 버튼 사이즈 | Large (Height 50px), Width 균등 분배 |
| 버튼 간격 | 12px |
| 버튼 순서 | [취소 (Secondary)] [확인/설정 (Primary)] |
 
**Form 레이아웃**

> 모달 내 폼 필드 행은 **10-2 Form Page Lv2 단독 필드 구조**를 따른다 (회색 라벨 영역 + 흰색 콘텐츠 영역 + 행 간 border). 별도 layout을 만들지 않는다.

| 속성 | 값 |
|------|-----|
| 폼 박스 | border 1px #EAEDEF, radius 4px, overflow-hidden (모든 행을 감싸는 외곽 박스) |
| 라벨 영역 | width 164px 고정, 배경 #F7F9FA, 우측 border 1px #EAEDEF, 세로 상단 정렬 |
| 라벨 텍스트 | Body2 (`text-[14px] font-normal`), #828C94 |
| 필수 표시 | * #F05656 (라벨 뒤) |
| 콘텐츠 영역 | 나머지 width, 배경 #FFFFFF |
| 행 구분선 | 1px #EAEDEF (마지막 행은 하단 border 생략) |
| 행 Padding | 상하 16px, 좌우 20px |
 
**Form 필드 타입별 배치**
 
| 타입 | 배치 |
|------|------|
| Input | width 240px (기본) |
| Input + 단위 | Input (width 120px) + 단위 텍스트, 간격 8px |
| Input + 버튼 | Input (width 240px) + Button (Small), 간격 8px |
| Select | width 240px (기본) |
| Select + 버튼 | Select (width 240px) + Button (Small), 간격 8px |
| Radio Group | 가로 배치, 옵션 간격 40px |
| Checkbox | 단일 또는 그룹 |
| Textarea | 전체 너비 사용 |
| Button (단독) | Small (Height 32px), Outline 스타일 |
 
**입력 에러 상태**
 
| 속성 | 값 |
|------|-----|
| Input 테두리 | 1px #F05656 |
| Select 테두리 | 1px #F05656 |
| 에러 메시지 위치 | 필드 하단 8px 간격 |
| 에러 메시지 텍스트 | Caption (`text-[12px]`), #F05656 |
| Input 에러 메시지 | "입력해주세요." |
| Select 에러 메시지 | "선택해주세요." |
 
**코드 예시**
 
```tsx
{/* Type A: Info Modal */}
{isOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="w-[600px] min-h-[300px] bg-white rounded-[8px] flex flex-col">
      {/* Header — 3-item 레이아웃: 좌측 spacer + 타이틀 + 닫기 버튼 */}
      <div className="h-[66px] px-[28px] flex items-center justify-between border-b border-[#EAEDEF] shrink-0">
        <div className="w-[24px] h-[24px] shrink-0" aria-hidden />
        <span className="text-[18px] font-semibold text-[#2F3438]">모달 타이틀</span>
        <button
          onClick={() => setIsOpen(false)}
          className="w-[24px] h-[24px] flex items-center justify-center bg-transparent border-none cursor-pointer shrink-0"
        >
          <CloseIcon />
        </button>
      </div>
 
      {/* Body — 폼 박스 안에 Lv2 단독 필드 행들을 담는다 */}
      <div className="px-[28px] py-[24px] flex-1 overflow-auto">
        <div className="border border-[#EAEDEF] rounded-[4px] overflow-hidden">
          {/* 1행 (마지막이 아니면 border-b) */}
          <div className="flex items-stretch border-b border-[#EAEDEF]">
            <div className="w-[164px] shrink-0 bg-[#F7F9FA] border-r border-[#EAEDEF] px-[20px] py-[16px] text-[14px] font-normal text-[#828C94]">
              라벨 <span className="text-[#F05656]">*</span>
            </div>
            <div className="flex-1 bg-white px-[20px] py-[16px]">
              <input
                className="h-[32px] w-[240px] px-[8px] bg-white text-[14px] font-normal text-[#2F3438] placeholder-[#C2C8CC] border border-[#EAEDEF] rounded-[4px] focus:border-[#0AA5FF] focus:outline-none"
                placeholder="입력해주세요"
              />
            </div>
          </div>
          {/* 2행 (마지막, border-b 생략) */}
          <div className="flex items-stretch">
            <div className="w-[164px] shrink-0 bg-[#F7F9FA] border-r border-[#EAEDEF] px-[20px] py-[16px] text-[14px] font-normal text-[#828C94]">
              라벨 2
            </div>
            <div className="flex-1 bg-white px-[20px] py-[16px]">
              {/* 콘텐츠 */}
            </div>
          </div>
        </div>
      </div>
 
      {/* Footer */}
      <div className="px-[28px] py-[20px] flex items-center justify-center gap-[12px] border-t border-[#EAEDEF] shrink-0">
        <button onClick={() => setIsOpen(false)} className="flex-1 h-[50px] bg-white text-[#2F3438] text-[14px] font-normal rounded-[4px] border border-[#EAEDEF] hover:bg-[#F7F9FA]">
          취소
        </button>
        <button className="flex-1 h-[50px] bg-[#0AA5FF] text-white text-[14px] font-normal rounded-[4px] hover:bg-[#0198ED]">
          확인
        </button>
      </div>
    </div>
  </div>
)}
```
 
#### Type B: Alert Modal (Width: 400px)
 
**용도**: 확인/취소 다이얼로그, 삭제 확인, 간단한 메시지 표시
 
**구조**
 
```
┌─────────────────────────────────────────┐
│                                         │
│            Modal Title                  │
│      서브텍스트 설명이 들어갑니다.       │
│                                         │
│      [취소]            [변경]           │
│                                         │
└─────────────────────────────────────────┘
```
 
**사이즈**
 
| 속성 | 값 |
|------|-----|
| Width | 400px (고정) |
| Min Height | 144px |
| Max Height | 30vh |
| Border Radius | 8px |
| Padding | 좌우 16px, 상하 24px |
| Background | #FFFFFF |
| 텍스트 정렬 | 중앙 정렬 |
 
**타이틀**
 
| 속성 | 값 |
|------|-----|
| 텍스트 | Heading2 (`text-[18px] font-semibold`), #2F3438 |
| 하단 간격 | 8px |
 
**서브텍스트 (선택)**
 
| 속성 | 값 |
|------|-----|
| 텍스트 | Body2 (`text-[14px] font-normal`), #828C94 |
| 하단 간격 | 24px |
 
**버튼 영역**
 
| 속성 | 값 |
|------|-----|
| Height | 90px (Hug) |
| 버튼 사이즈 | Large (Height 50px), Width 균등 분배 |
| 버튼 간격 | 12px |
| 버튼 순서 | [취소 (Secondary)] [확인/변경 (Primary)] |
 
**코드 예시**
 
```tsx
{/* Type B: Alert Modal */}
{isOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="w-[400px] bg-white rounded-[8px] px-[16px] py-[24px] text-center">
      {/* 타이틀 */}
      <p className="text-[18px] font-semibold text-[#2F3438] mb-[8px]">타이틀을 입력하세요.</p>
 
      {/* 서브텍스트 (선택) */}
      <p className="text-[14px] font-normal text-[#828C94] mb-[24px]">서브텍스트 설명이 들어갑니다.</p>
 
      {/* 버튼 영역 */}
      <div className="flex items-center gap-[12px]">
        <button onClick={() => setIsOpen(false)} className="flex-1 h-[50px] bg-white text-[#2F3438] text-[14px] font-normal rounded-[4px] border border-[#EAEDEF] hover:bg-[#F7F9FA]">
          취소
        </button>
        <button className="flex-1 h-[50px] bg-[#0AA5FF] text-white text-[14px] font-normal rounded-[4px] hover:bg-[#0198ED]">
          확인
        </button>
      </div>
    </div>
  </div>
)}
```
 
---

### 8-10. Snackbar

**용도**: form 혹은 모달에서 등록 및 수정 CTA를 눌렀을 때 사용자에게 피드백을 주는 상황

**사이즈**

| 속성 | 값 |
|------|-----|
| Width | 468px |
| Height | 가변 (텍스트에 따라 늘어남) |
| Background | #2F3438 |
| Border Radius | 4px |
| 텍스트 | Body2 (14px, regular), #FFFFFF, 중앙 정렬 |
| Padding | 상하 14px |
| 위치 | 화면 하단 중앙, 하단에서 40px 간격 |

**인터랙션 규칙**

| 속성 | 값 |
|------|-----|
| 표시 시간 | 3초 |
| 진입 애니메이션 | 오버레이(fade-in) |
| 퇴장 애니메이션 | 오버레이(fade-out) |

**❌ 금지 규칙**

- ❌ 내부에 아이콘 사용 금지
- ❌ 하단에서 슬라이드하여 등장/퇴장하지 않음 (fade만 사용)

---

