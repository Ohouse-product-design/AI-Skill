# 디자인 토큰

> 환경 조건, 컬러, 타이포그래피, 간격, 아이콘, 이미지.

## 1. 환경 조건

### 1-1. 화면 사이즈

| 속성 | 값 |
|------|-----|
| 기준 해상도 | 1920×1080 (PC 웹) |
| 최소 지원 너비 | 1280px |

### 1-2. 레이아웃 구조

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Header (60px)                               │
├──────────┬──────────────────────────────────────────────────────────┤
│          │  Content Area (padding: 20px)                            │
│          │  ┌─────────────────────────────────────────────────────┐ │
│          │  │ Background                                          │ │
│          │  │ (border-radius: 4px, min-height: 980px,             │ │
│ Sidebar  │  │  max-width: 1630px)                                 │ │
│ (250px)  │  │  ┌───────────────────────────────────────────────┐  │ │
│          │  │  │ Content (padding: 28px)                       │  │ │
│          │  │  │  ┌─────────────────────────────────────────┐  │  │ │
│          │  │  │  │ ① PageHeader (height: 90px)             │  │  │ │
│          │  │  │  ├─────────────────────────────────────────┤  │  │ │
│          │  │  │  │ ② 세부 콘텐츠                            │  │  │ │
│          │  │  │  │                                         │  │  │ │
│          │  │  │  └─────────────────────────────────────────┘  │  │ │
│          │  │  └───────────────────────────────────────────────┘  │ │
│          │  └─────────────────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────────────┘
```

| 영역 | 속성 |
|------|------|
| 사이드바 | 좌측 고정, width 250px |
| 헤더 | 상단 고정, height 60px (브레드크럼 + 로그아웃) |
| Content Area | 사이드바/헤더 제외 영역, padding 20px (상하좌우), 배경색 #F7F9FA |
| Background | border-radius 4px, border 1px, min-height 980px, max-width 1630px, 배경색 #FFFFFF |
| Content | padding 좌우 28px, 상 0px, 하 40px |
| PageHeader | height 90px (페이지 타이틀 + 액션 버튼), 액션 버튼은 선택이며 Spec doc 기반으로 반영 |

---

## 2. 컬러 시스템

### 2-1. 시맨틱 컬러 토큰

| 토큰 | HEX | 용도 |
|------|-----|------|
| --primary | #0AA5FF | 주요 버튼, 링크, 포커스 |
| --destructive | #F05656 | 경고, 삭제, 에러 |
| --background | #FFFFFF | 페이지 배경 |
| --foreground | #2F3438 | 기본 텍스트 |
| --muted | #EAEDEF | 비활성 배경, 테두리 |
| --muted-foreground | #828C94 | 보조 텍스트 |
| --placeholder | #C2C8CC | 입력 필드 플레이스홀더 |
| --border | #EAEDEF | 테두리 |
| --input-background | #F7F9FA | 비활성 입력 필드 배경 |

### 2-2. 사용 규칙

- **Primary (#0AA5FF)**: 주요 CTA 버튼, 링크 텍스트, 포커스 링
- **Destructive (#F05656)**: 삭제 버튼, 에러 메시지, 경고 상태
- **Foreground (#2F3438)**: 모든 기본 텍스트
- **Muted-foreground (#828C94)**: 라벨, 보조 설명, 비활성 텍스트
- **Placeholder (#C2C8CC)**: Input placeholder 전용
- **Border (#EAEDEF)**: 모든 테두리, 구분선

---

## 3. 타이포그래피

### 3-1. 폰트

| 속성 | 값 |
|------|-----|
| Font Family | Pretendard |
| CDN | `@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');` |

### 3-2. 필수 CSS 설정

> ⚠️ `styles/fonts.css` 또는 `styles/index.css`에 반드시 포함

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

* {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif !important;
}
```

### 3-3. 필수 Tailwind 설정

> ⚠️ `tailwind.config.js`에 반드시 포함

```js
module.exports = {
  theme: {
    fontFamily: {
      sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    },
  },
}
```

### 3-4. 텍스트 스타일

| 이름 | Size | Weight | Tailwind 클래스 | 용도 |
|------|------|--------|-----------------|------|
| Heading1 | 24px | 700 (Bold) | `text-[24px] font-bold` | 페이지 타이틀 |
| Heading2 | 18px | 600 (SemiBold) | `text-[18px] font-semibold` | 모달, 섹션 타이틀 |
| Heading3 | 16px | 600 (SemiBold) | `text-[16px] font-semibold` | 섹션 타이틀 |
| Body1 | 14px | 500 (Medium) | `text-[14px] font-medium` | 사이드바 대메뉴, 강조 본문 |
| Body2 | 14px | 400 (Regular) | `text-[14px] font-normal` | 사이드바 소메뉴, 일반 본문, 버튼, Input |
| Caption | 12px | 400 (Regular) | `text-[12px] font-normal` | 라벨, 뱃지, 캡션, 테이블 헤더 |

### 3-5. Tailwind 사용 금지 규칙

- ❌ `text-sm` (12px) 사용 금지 → Caption이 필요한 경우만 `text-[12px]` 사용
- ❌ `text-base` (16px) 사용 금지 → Heading3이 필요한 경우 `text-[16px] font-semibold` 사용
- ❌ `font-['Pretendard:SemiBold',_sans-serif]` 사용 금지 → `font-semibold` 사용
- ❌ `font-family: sans-serif` 단독 사용 금지
- ❌ Pretendard가 아닌 다른 폰트 사용 금지
- ✅ 본문 텍스트는 항상 `text-[14px]` 사용 (Body1 또는 Body2)

---

## 4. 간격 & 정렬

### 4-1. Spacing 기준

| 값 | 용도 |
|----|------|
| 4px | 아이콘-텍스트 간격 |
| 8px | 관련 요소 간 최소 간격 |
| 12px | 폼 필드 내 패딩, 버튼 간 간격 |
| 16px | 섹션 내부 요소 간격 |
| 20px | 섹션 패딩 |
| 24px | 페이지 패딩, 섹션 간 간격 |
| 32px | 큰 섹션 간 간격 |

### 4-2. 폼 레이아웃

```
┌─────────────────────────────────────────────────────────┐
│  Label (120px)  │  Input Field                          │
├─────────────────┼───────────────────────────────────────┤
│  Label          │  Input    │  Input    │  Input        │
└─────────────────┴───────────┴───────────┴───────────────┘
```

| 속성 | 값 |
|------|-----|
| Label 너비 | 고정 120px (또는 유동) |
| Label-Input 간격 | 16px |
| Input 간 간격 | 12px |
| Row 간 간격 | 16px |

### 4-3. 버튼 그룹 정렬

| 위치 | 정렬 |
|------|------|
| 폼 하단 | 좌측 정렬 |
| 모달 하단 | 중앙 정렬 |
| 테이블 상단 | 우측 정렬 |
| 버튼 간 간격 | 12px |

---

## 5. 아이콘

> 모든 아이콘은 `src/components/Icons.tsx`에 이미 정의되어 있다. 구현 규칙은 `00-principle.md` 0-5 참조.

### 5-1. 아이콘 목록 (Icons.tsx 컴포넌트 매핑)

> 모든 아이콘은 `src/components/Icons.tsx`에 named export 컴포넌트로 정의되어 있다.
> 새 아이콘이 필요하면 Icons.tsx에 먼저 추가한 후 import하여 사용한다.

| 아이콘 | Icons.tsx export명 | 사용 위치 | 사이즈 |
|--------|-------------------|-----------|--------|
| Select 드롭다운 화살표 | `SelectArrowIcon` | 드롭다운 Select | 24px |
| Radio Inactive | `RadioInactive` | 라디오 버튼 (미선택) | 20px |
| Radio Active | `RadioActive` | 라디오 버튼 (선택) | 20px |
| Radio Error | `RadioError` | 라디오 버튼 (에러) | 20px |
| Checkbox Inactive | `CheckboxInactive` | 체크박스 (미선택) | 20px |
| Checkbox Active | `CheckboxActive` | 체크박스 (선택) | 20px |
| Checkbox Error | `CheckboxError` | 체크박스 (에러) | 20px |
| Pagination 이전 | `PaginationPrev` | 페이지네이션 이전 버튼 | 16px |
| Pagination 다음 | `PaginationNext` | 페이지네이션 다음 버튼 | 16px |
| 모달 닫기 (X) | `CloseIcon` | 모달 헤더 우측 | 24px |
| 사이드바 접기 | `SidebarCollapseIcon` | 사이드바 접기/펼치기 토글 | 18px |
| 사이드바 메뉴 | `SidebarMenuIcon` | 사이드바 메뉴 아이콘 | 18px |
| 펼치기 (하) | `ExpandIcon` | 사이드바/필터 펼치기 | 12px |
| 접기 (상) | `CollapseIcon` | 사이드바/필터 접기 | 12px |
| 브레드크럼 구분자 | `ChevronRight` | 헤더 브레드크럼 > 구분자 | 16px |
| 로그아웃 | `LogoutIcon` | 헤더 우측 로그아웃 | 18px |

---

## 6. 이미지

- 디자인에 사용된 이미지를 모두 추출하여 동일하게 적용
- 이미지 비율 유지: `object-fit: cover` 또는 `object-fit: contain` 적절히 사용
- 이미지 없을 경우 placeholder 표시

---

