# 디자인 패턴 (레이아웃·페이지 유형)

> Sidebar, Header, Content Area, Collapsible Section, List Page, Form Page.

## 9. 레이아웃 구현

### 9-1. 사이드바 (Sidebar)

**로고 이미지**

| 속성 | 값 |
|------|-----|
| 파일명 | `logo.png` |
| 위치 | `./assets/logo.png` |
| 사이즈 | width 153px, height 24px |

**접기/펼치기 상태**

| 상태 | 너비 | 표시 요소 |
|------|------|----------|
| 펼침 (기본) | 250px | 로고 + 토글 아이콘 + 메뉴 아이콘 + 메뉴 텍스트 + 서브메뉴 + 하단 링크 |
| 접힘 | 64px | 토글 아이콘만 (로고, 메뉴 아이콘, 텍스트, 서브메뉴, 하단 링크 모두 숨김) |

**1depth 메뉴 스타일**

| 속성 | 값 |
|------|-----|
| Padding | `px-4 py-3` (좌우 16px, 상하 12px) |
| Gap | `gap-3` (12px) |
| 텍스트 | `text-[14px] font-medium` (Body1) |
| 색상 | `text-foreground` (#2F3438) |
| Hover | `hover:bg-secondary` (#F7F9FA) |

**2depth 메뉴 스타일**

| 속성 | 값 |
|------|-----|
| Padding | `pl-[46px] py-2` (좌측 46px, 상하 8px) |
| 텍스트 | `text-[14px] font-normal` (Body2) |
| 색상 (기본) | `text-foreground` (#2F3438) |
| 색상 (활성) | `text-primary` (#0AA5FF) |

**하단 링크 스타일**

| 속성 | 값 |
|------|-----|
| Padding | `p-4` (16px) |
| Border | `border-t border-border` (상단 1px) |
| 텍스트 | `text-[14px]` (Body2) |
| 색상 | `text-muted-foreground` (#828C94) |

**전체 구현**

- 실제 구현은 `src/components/Sidebar.tsx` 참조 (위 표의 스펙이 코드에 반영됨)
- 신규 메뉴 추가 시 `MENU_ITEMS` 배열만 수정, 나머지 구조/스타일은 건드리지 않는다
- 접기/펼치기 토글, 활성 메뉴 하이라이트, 하단 링크 등 모든 동작이 이미 구현되어 있음

---

### 9-2. 헤더 (Header)

**레이아웃**

| 속성 | 값 |
|------|-----|
| 위치 | 사이드바 제외 영역에 고정 |
| Height | 60px |
| 좌측 | 브레드크럼 |
| 우측 | 로그아웃 버튼 |

**브레드크럼 규칙**

- 사이트(서비스)명 제외, 메뉴명만 표기
  - ❌ `오늘의집 > 풀필먼트 관리 > 파트너 조회`
  - ✅ `풀필먼트 관리 > 파트너 조회`
- 현재 위치 텍스트: #2F3438
- 나머지 텍스트: #828C94

**코드 예시**

```tsx
<header className="fixed top-0 left-[250px] right-0 h-[60px] bg-white border-b border-[#EAEDEF]">
  {/* 브레드크럼 */}
  {/* 로그아웃 버튼 */}
</header>
```

---

### 9-3. 콘텐츠 영역 (Content Area)

**코드 예시**

```tsx
{/*
  ⚠️ 레이아웃 레벨 가로 스크롤 차단 (필수)
  - main + Background 둘 다 overflow-x-hidden
  - Content div에 min-w-0 (flex/block의 intrinsic 확장 방지)
  - 이 설정이 없으면 넓은 테이블(8-7 Type 3)이 페이지 전체 가로 스크롤을 유발함
  - 테이블 자체의 가로 스크롤은 래퍼 div의 `overflow-x-auto`가 담당 (8-7 Type 3)
*/}
<main className="ml-[250px] mt-[60px] p-[20px] min-h-[calc(100vh-60px)] bg-[#F7F9FA] overflow-x-hidden">
  {/* Background */}
  <div className="bg-white rounded-[4px] min-h-[980px] max-w-[1630px] p-[20px] overflow-x-hidden">
    {/* Content */}
    <div className="px-[28px] pt-[0px] pb-[40px] min-w-0">
      {/* PageHeader (90px) */}
      <div className="h-[90px] mb-[20px]">
        <h1 className="text-[24px] font-bold text-[#2F3438]">페이지 타이틀</h1>
        {/* 우측 액션 버튼 (선택사항) */}
      </div>

      {/* 세부 콘텐츠 */}
      <div>{/* 검색 섹션, 테이블, 폼 등 */}</div>
    </div>
  </div>
</main>
```

---

### 9-4. Collapsible Section

**코드 예시 (필수 동작 포함)**

> ⚠️ **접기/펼치기 버튼은 반드시 작동해야 한다.** 장식용 버튼은 UX 부채다 — 정적 렌더링 금지.
> 아래 패턴은 state + onClick + 조건부 렌더링을 모두 포함한 완전한 구현이다.

```tsx
import { useState } from "react";
import { ExpandIcon, CollapseIcon } from "@/components/Icons";

function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <section className="flex flex-col">
      <div className="flex justify-between items-center py-[16px]">
        <h3 className="text-[18px] font-semibold text-[#2F3438]">{title}</h3>
        <button
          onClick={() => setCollapsed((p) => !p)}
          className="flex items-center gap-[4px] text-[14px] text-[#828C94] bg-transparent border-none cursor-pointer"
        >
          {collapsed ? <>펼치기 <ExpandIcon /></> : <>접기 <CollapseIcon /></>}
        </button>
      </div>
      {!collapsed && (
        <div className="bg-white border border-[#EAEDEF]">
          {children}
        </div>
      )}
    </section>
  );
}

// 사용:
<CollapsibleSection title="기본정보">
  <FormRow ...>...</FormRow>
  <FormRow ...>...</FormRow>
</CollapsibleSection>
```

**❌ 금지 패턴:**
- ❌ `<button>접기/펼치기</button>` 처럼 onClick 없는 장식용 버튼
- ❌ 접혔을 때도 콘텐츠 박스가 여전히 렌더링되는 것 (`!collapsed && ...` 조건부 렌더 필수)
- ❌ 아이콘과 텍스트가 상태와 불일치 (펼쳐져 있는데 "펼치기" 표시 등)
- ❌ 섹션 래퍼에 `overflow-hidden` 사용 (내부 Select/Dropdown이 잘림. 8-7 Table Type 3처럼 꼭 필요한 예외 제외)

- 헤더: 타이틀 + 접기/펼치기 버튼 (박스 외부 상단)
- 콘텐츠: 박스 내부, `collapsed=true`일 때 숨김

---

## 10. 페이지 유형

> 모든 Page는 유형에 상관없이 상단에 **PageHeader**가 있으며, PageHeader와 하단 섹션 사이 margin은 20px

---

### 10-1. List Page (목록/조회)

**전체 구조**: 검색 필터 섹션 + 검색 결과 섹션 (두 섹션 사이 margin: 32px)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ① 검색 필터 섹션 (Collapsible)                                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 섹션 타이틀                                          접기 ∧     │ │
│ │ 필드 라벨   [Input/Select/Radio/Checkbox 등]                    │ │
│ │ ...                                                             │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                        [초기화]  [검색]                             │
├─────────────────────────────────────────────────────────────────────┤
│ ② 검색 결과 섹션                                                    │
│                                                                     │
│ 총 N건                                                              │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                                     [버튼] [버튼] [버튼]        │ │
│ ├─────────────────────────────────────────────────────────────────┤ │
│ │ Table Header                                                    │ │
│ ├─────────────────────────────────────────────────────────────────┤ │
│ │ Table Row                                                       │ │
│ │ ...                                                             │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                      [ Pagination ]                                 │
└─────────────────────────────────────────────────────────────────────┘
```

#### ⚠️ 검색 기능 필수 구현 규칙 (최우선 적용)

> **검색/초기화 버튼, 페이지네이션, 결과 처리, 에러 처리는 반드시 아래 코드 구조를 따른다.**
>> 임의로 동작을 생략하거나 다른 방식으로 구현할 수 없다.

**초기 로드 규칙**

> 페이지 진입 시 `useEffect(() => { handleSearch(1); }, [])` 로 초기 데이터를 자동 조회한다.

**필수 상태 및 초기값**
```tsx
const initialFilters = { keyword: "", status: "전체", type: "" };

const [filters, setFilters] = useState(initialFilters);
const [page, setPage] = useState(1);
const [data, setData] = useState([]);
const [totalCount, setTotalCount] = useState(0);
const [isEmpty, setIsEmpty] = useState(false);
const [alertModal, setAlertModal] = useState({ open: false, message: "" });
```

**handleSearch — 환경에 따라 선택**
```tsx
// [A] 프로토타입 (클라이언트 필터링)
const handleSearch = (currentPage = 1) => {
  setPage(currentPage);
  let result = [...SAMPLE_DATA];

  if (filters.status !== "전체") result = result.filter(item => item.status === filters.status);
  if (filters.keyword) result = result.filter(item => item.name.toLowerCase().includes(filters.keyword.toLowerCase()));
  if (filters.types?.length > 0) result = result.filter(item => filters.types.includes(item.type));
  if (filters.multiSearchValue?.trim()) {
    const values = parseMultipleValues(filters.multiSearchValue);
    result = result.filter(item => values.includes(item.id));
  }

  setData(result);
  setTotalCount(result.length);
  setIsEmpty(result.length === 0);
};

// [B] 실서비스 (API 호출)
const handleSearch = async (currentPage = 1) => {
  setPage(currentPage);
  try {
    const result = await fetchData({ ...filters, page: currentPage });
    setData(result.data);
    setTotalCount(result.total);
    setIsEmpty(result.total === 0);
  } catch {
    setAlertModal({ open: true, message: "검색 중 오류가 발생했습니다. 다시 시도해주세요." });
  }
};
```

**공통 핸들러**
```tsx
const handleReset = () => { setFilters(initialFilters); setPage(1); handleSearch(1); };
const handlePageChange = (newPage: number) => handleSearch(newPage);
const parseMultipleValues = (text: string) => text.split(/[\n,]/).map(v => v.trim()).filter(Boolean);
```

**필터 타입별 비교 방식**

| 필터 타입 | 비교 방식 |
|-----------|-----------|
| Select | 정확 일치 (`===`) |
| Input | 부분 일치 (`.toLowerCase().includes()`) |
| Checkbox | 배열 포함 (`.includes()`) |
| Textarea 복수검색 | `parseMultipleValues()` 후 배열 포함 |

**❌ 금지 패턴**
- ❌ 각 버튼에 `onClick` 연결 누락
- ❌ 필터링 로직 없이 `setData(SAMPLE_DATA)`만 호출
- ❌ `totalCount`, `isEmpty`, `alertModal.open` 바인딩 누락
- ❌ 초기화 후 `handleSearch(1)` 재호출 누락
- ❌ Textarea 값을 `parseMultipleValues()` 없이 그대로 사용

**필드 타입별 초기화 값**

| 필드 타입 | 초기화 값 |
|-----------|-----------|
| Input | 빈 값 (`""`) |
| Select | 첫 번째 옵션 또는 `"전체"` |
| Radio | 첫 번째 옵션 (기본값) |
| Checkbox | 모두 해제 |
| Textarea | 빈 값 (`""`) |

**검색 타입별 처리**

| 타입 | 검색 방식 |
|------|-----------|
| Input (텍스트) | 부분 일치 (LIKE '%keyword%') |
| Select | 정확히 일치 (=) |
| Radio | 정확히 일치 (=) |
| Date Range | 범위 검색 (BETWEEN) |
| 복수 검색 (Textarea) | 여러 값 OR 조건 (IN), 반드시 `parseMultipleValues()` 적용 |

> 검색 기능 구현 검증은 `scripts/check-search.sh` 참조

---

#### 샘플 데이터 상태 관리

샘플 데이터는 반드시 `useState`로 관리한다. 고정 배열로 선언하지 않는다.

```tsx
// ❌ 금지
const SAMPLE_DATA = [ ... ];

// ✅ 필수
const [data, setData] = useState([
  { id: 1, name: "가구나라", ... },
  { id: 2, name: "리빙데코", ... },
]);

// 등록
const handleAdd = (newItem) => {
  setData(prev => [newItem, ...prev]);
  setTotalCount(prev => prev + 1);
};

// 수정
const handleEdit = (updatedItem) => {
  setData(prev => prev.map(item =>
    item.id === updatedItem.id ? updatedItem : item
  ));
};

// 삭제
const handleDelete = (id) => {
  setData(prev => prev.filter(item => item.id !== id));
  setTotalCount(prev => prev - 1);
};
```

- 모달 확인 버튼은 반드시 `handleAdd` 또는 `handleEdit`에 연결하고, 완료 후 모달을 닫고 Snackbar를 표시한다
- `totalCount`를 함께 업데이트하지 않으면 "총 N건" 숫자가 반영되지 않는다

---

#### 프로토타입 조회/등록 동작 규칙

> 프로토타입에서 모달 내 "조회하기" 버튼은 **어떤 입력값이든 항상 성공**해야 한다.
> 사용자가 임의의 값을 넣고 테스트할 수 있어야 하므로, 조회 실패로 흐름이 막히면 안 된다.

```tsx
const handleLookup = (inputId: string) => {
  // 마스터 데이터에 있으면 해당 정보 사용
  const match = MASTER_DATA[inputId];
  // 없으면 자동 생성된 샘플 정보로 채움 (조회 항상 성공)
  setInfo(match || {
    id: "100" + inputId.replace(/\D/g, "").padStart(6, "0"),
    name: `샘플_${inputId}`,
    // ... 나머지 필드도 맥락에 맞게 자동 생성
  });
  setLookedUp(true);
};
```

- ❌ 마스터에 없는 ID 입력 시 에러를 표시하고 등록을 막는 것 금지
- ✅ 어떤 값이든 조회 성공 → 정보 채움 → 등록 가능
- 에러 프레임(조회 실패 상태)은 **프레임 스위처에서만** 표시하고, 실제 조회하기 동작은 항상 성공시킨다

---

#### ① 검색 필터 섹션 (Collapsible)

**구조**

```
┌─────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 섹션 타이틀                                          접기 ∧     │ │
│ ├─────────────────────────────────────────────────────────────────┤ │
│ │ 필드 라벨   [Input/Select/Radio/Checkbox 등]                    │ │
│ ├─────────────────────────────────────────────────────────────────┤ │
│ │ 필드 라벨   [Input/Select/Radio/Checkbox 등]                    │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                        [초기화]  [검색]                             │
└─────────────────────────────────────────────────────────────────────┘
```

**Input / Select 사용 규칙**

- Input 스펙은 **섹션 8-2** 를 그대로 적용 (`h-[32px]`, `w-[240px]` 기본, `border-[#EAEDEF]` 등)
- Select 스펙은 **섹션 8-4** 를 그대로 적용 (커스텀 `<div>` 구현, 네이티브 `<select>` 금지)
- Select 드롭다운 인터랙션(isOpen 토글, 항목 onClick, 선택 후 닫기)은 **섹션 0-4** 및 **섹션 8-4** 참조
- 검색 필터 섹션에서 임의 스타일 정의 금지 — 섹션 8 스펙 외 사용 불가

---

**레이아웃 스펙**

| 영역 | 속성 |
|------|------|
| 필터 박스 (타이틀 + 필드) | 배경 #F7F9FA, border 없음, radius 없음 |
| 버튼 영역 | 배경 없음, padding 상 20px 하 20px, 중앙 정렬 |

**섹션 헤더**

| 속성 | 값 |
|------|-----|
| 타이틀 | Heading2 (`text-[18px] font-medium`), #2F3438 |
| 접기/펼치기 | 우측 "접기 ∧" 또는 "펼치기 ∨", Body2, #828C94 |
| Padding | 상하 16px, 좌우 20px |
| Height | 64px 고정 |
| 하단 border | 없음 |

**필드 행 규칙**

| 속성 | 값 |
|------|-----|
| 행 Padding | 상하 16px, 좌우 0px |
| 행 하단 border | 좌우 margin 20px (양쪽 끝까지 닿지 않도록) |
| 마지막 행 | 하단 border 제외 |
| 필드 라벨 영역 | width 150px 고정, 좌측 정렬 |
| 필드 라벨 텍스트 | Body2, #828C94 |
| 필드 라벨 필수 표시 | * #F05656 (라벨 뒤) |
| 콘텐츠 영역 | 나머지 width |
| Height | 최소 32px, 이상 가변적 |

**필드 배치 규칙**

- Spec doc에 필드 그룹핑 지시가 없으면 기본 1행 2필드
- 한 행에 여러 필드 가로 배치 가능, 필드 간 간격: 32px
- Radio/Checkbox Group, Textarea: 전체 너비 사용

**필드 타입별 배치**

| 타입 | 배치 |
|------|------|
| Input | 단일 Input, width 240px |
| Select | 단일 Select, width 240px |
| Radio Group | 가로 배치, 옵션 간격 40px |
| Checkbox Group | 가로 배치, 옵션 간격 24px |
| Date Range | Select + Input + "~" + Input 조합 |
| 복수 검색 | Radio Group + Textarea(width 488px) (세로 배치, 간격 8px) |
| Select + Input 조합 | Select(width 120px) + Input(width 240px), 간격 8px |

**하단 버튼 영역**

| 속성 | 값 |
|------|-----|
| 위치 | 섹션 하단 중앙 정렬 |
| Padding | 상 20px, 하 20px |
| 버튼 순서 | [초기화 (Secondary)] [검색 (Primary)] |
| 버튼 사이즈 | Medium (Height 40px), width 100px |
| 버튼 간격 | 8px |

**코드 예시**

```tsx
{/* 검색/초기화 버튼 — onClick 연결 필수 */}
<button onClick={handleReset}>초기화</button>
<button onClick={() => handleSearch(1)}>검색</button>
```

#### ② 검색 결과 섹션

**결과 건수 + 정렬**

| 속성 | 값 |
|------|-----|
| 레이아웃 | "총 N건" 좌측, 정렬 Select 우측 — 같은 행 (`flex justify-between items-center`) |
| 총 건수 텍스트 | Heading3 (`text-[16px] font-semibold`), #2F3438 |
| 총 건수 형식 | "총 N건" 또는 "총 N개" |
| 정렬 Select | Select (8-4 규격), 옵션 형식: `{컬럼명} 오름차순` / `{컬럼명} 내림차순` |
| 정렬 조건 | **스펙독에 정렬이 명시된 경우에만 추가. 미명시 시 추가 금지** |
| 테이블과 간격 | 하단 16px |

```
총 N건                                     [정렬 Select ▼]
┌─────────────────────────────────────────────────────────────────┐
│ Table                                                           │
```

**테이블 영역**

- 기본: DataTable (체크박스 없음) → 8-7. Table 참조
- 행 선택 필요 시: DataTable (행 선택 가능)
- 상단 액션 필요 시: ControlTable

**페이지네이션**

- → 8-8. Pagination 참조
- 위치: 테이블 하단 중앙 정렬
- 테이블과 간격: 20px

---

### 10-2. Form Page (등록/수정)

#### 위계 정의 (필수)

> ⚠️ Form Page는 항상 아래 3단계 위계로 구성한다. 위계가 무너지면 사용자가 그룹핑을 인식하지 못하고, 정보가 평평하게 나열되어 가독성이 떨어진다.

| 위계 | 명칭 | 역할 | 배치 방향 | 위치 |
|------|------|------|----------|------|
| **Lv1** | 섹션 | 페이지 내 최상위 묶음 (예: "기본 정보", "박스정보") | — | 박스 외부 상단, Heading2 |
| **Lv2** | 서브 카테고리(그룹) | 섹션 내 의미 단위 묶음 (예: "셀러샵 정보", "파트너 정보") | **세로 — 행 단위로 쌓음** | 좌측 라벨 영역 (164px, #F7F9FA) |
| **Lv3** | 필드 | 개별 입력 항목 (예: "셀러샵 ID", "셀러샵 명") | **가로 — 좌→우 배치** | 우측 콘텐츠 영역, 간격 16px |

#### 구조

```
Lv1: 섹션 타이틀 (Heading2)                                접기 ∧
┌──────────────┬──────────────────────────────────────────────────┐
│              │  셀러샵 ID         셀러샵 명                     │
│ 셀러샵 정보  │  ┌───────────┐    ┌───────────┐                  │  ← Lv3: 가로 배치
│   (Lv2)      │  │           │    │           │                  │
│              │  └───────────┘    └───────────┘                  │
├──────────────┼──────────────────────────────────────────────────┤
│              │  파트너 ID         파트너 명                     │
│ 파트너 정보  │  ┌───────────┐    ┌───────────┐                  │
│   (Lv2)      │  │           │    │           │                  │
│              │  └───────────┘    └───────────┘                  │
└──────────────┴──────────────────────────────────────────────────┘
   ↑                ↑
   Lv2: 세로 배치   Lv3: 필드 타이틀(상) + Input(하)
```

#### 레이아웃 스펙

| 요소 | 스펙 |
|------|------|
| 섹션 타이틀 (Lv1) | Heading2 (`text-[18px] font-semibold`), 색상 #2F3438 |
| 행 라벨 영역 (Lv2) | width 고정 (164px), 배경 #F7F9FA, 세로 상단 정렬, 우측 border 1px #EAEDEF |
| 행 라벨 텍스트 (Lv2) | Body2, 색상 #828C94 |
| 콘텐츠 영역 | 나머지 width, 배경 #FFFFFF |
| 행 구분선 | 1px #EAEDEF |
| 행 패딩 | 상하 16px, 좌우 20px |

#### 필드 배치 규칙 (Lv3)

| 속성 | 값 |
|------|-----|
| 콘텐츠 영역 내 배치 | 가로 배치 |
| 필드 간 간격 | 16px |
| 필드별 구조 | 타이틀 + Input/Select 세로 정렬 (타이틀-요소 간격 8px) |

#### Lv2 단독 필드 처리

- Spec doc에 그룹명(Lv2)이 명시된 경우만 Lv2 라벨 사용
- 그룹에 속하지 않는 단독 필드는 **Lv2 라벨 자리에 필드 이름을 그대로 사용**, 콘텐츠 영역에는 Input 단독 배치

#### ❌ 금지 패턴

- ❌ **Lv2(서브 카테고리)를 전체 폭 회색 바(`SubHeader` 형태)로 표시하는 것** — 위계가 깨지고 좌측 라벨 영역(Lv2 자리)이 비어버려 그룹핑 시각이 약해진다
- ❌ Lv2 없이 모든 필드를 평평하게 나열 (Spec doc에 그룹핑이 명시된 경우)
- ❌ Lv3 필드를 콘텐츠 영역 내에서 세로로 쌓는 것 (한 그룹 내 필드는 가로 배치가 기본)
- ❌ Lv2 라벨에 필수(*) 표시를 하는 것 — 필수 표시는 Lv3 필드 타이틀에만

#### ⚠️ 인터랙션 필수 구현

> Form Page의 Select 드롭다운·등록 흐름·Snackbar 등 클릭 흐름은 **섹션 0-4 (인터랙션 구현 필수)** 를 그대로 따른다.

---
