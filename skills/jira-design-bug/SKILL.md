---
name: jira-design-bug
description: >
  오늘의집 PD가 Jira에 디자인/스펙 버그 티켓을 발행하는 팀 공용 스킬.
  "지라 디자인 버그 티켓", "QA 버그 등록", "디자인 리포팅 티켓",
  "버그 티켓 만들어", "리포팅 티켓 발행" 같은 표현이 나오면 반드시 이 스킬을 사용할 것.
  COMMWEB·OHSIOS·OHSAND·CONTWEB 영역별 기본 프로젝트 매핑,
  라벨/Priority 디폴트, 본문 구조, 담당자 lookup, 발행 전 컨펌 워크플로우가 박제되어 있다.
  최초 사용 시 개인 셋업(주 프로젝트·도메인·담당자)을 자동 추론 또는 wizard로 진행한다.
---

# Jira Design Bug Report

오늘의집 PD가 디자인/스펙 검수 단계에서 발견한 버그를 Jira 티켓으로 등록할 때 사용하는 팀 공용 스킬.

---

## 0. 환경 상수

- `cloudId`: `0d334135-ec08-4c00-8411-7a081dce39ca` (ohouse.atlassian.net)
- 보고자: 현재 로그인된 Atlassian 계정 (자동)
- 개인 설정 저장 위치: `~/.claude/skill-prefs/jira-design-bug.md`

---

## Step 0 — 개인 셋업 (하이브리드)

**스킬 진입 시 가장 먼저 수행.** 이미 셋업된 사용자는 자동으로 스킵된다.

### 0-1. 기존 설정 확인

```
Read ~/.claude/skill-prefs/jira-design-bug.md
```

파일이 있고 유효한 값이 있으면 → 그대로 적용하고 **Step 1로 진행**.
파일이 없거나 비어있으면 → 0-2로 진입.

> 사용자가 "설정 다시", "프로젝트 바꿀래" 등을 명시하면 0-2 강제 실행.

### 0-2. 자동 추론 (먼저 시도)

본인의 최근 Jira 티켓을 조회해서 패턴 추출:

```jql
reporter = currentUser() ORDER BY created DESC
```

(최대 20개, fields: `summary, project, labels, components, assignee`)

추출 항목:
- **주 프로젝트** (가장 많이 등장한 프로젝트 키, 상위 2~3개)
- **주 도메인 라벨** (`Commerce`, `community`, `Content` 등)
- **주 담당자** (assignee 빈도 상위)
- **주 워크스트림** (제목의 `[xxx]` prefix 빈도)

추출 결과를 표로 보여주고:
```
이게 맞나요? 수정할 부분 알려주세요. OK면 저장합니다.
```

사용자 컨펌 후 0-4로.

### 0-3. Setup Wizard (자동 추론 실패 시 폴백)

티켓이 0개거나 매우 적으면(<3) 직접 묻는다:

1. 주로 작업하는 영역은? (커머스 / 콘텐츠 / iOS 앱 / Android 앱 / 기타)
2. 자주 쓰는 도메인 라벨은? (예: `Commerce`, `community`, `Content`, `댓글경험개선` 등)
3. 자주 핸드오프하는 개발자는? (이름 1~3명, 후에 lookup으로 ID 매핑)
4. 현재 진행 중인 워크스트림은? (제목 prefix용, 예: `글린다 온보딩`, `콘텐츠 개편`)

### 0-4. 설정 저장

`~/.claude/skill-prefs/jira-design-bug.md` 에 다음 형식으로 저장:

```markdown
---
updated: YYYY-MM-DD
---

# Jira Design Bug — 개인 설정

## 주 프로젝트
- COMMWEB (또는 OHSIOS, OHSAND, CONTWEB 등)

## 주 도메인 라벨
- Commerce

## 주 담당자
- Woogi Shin (accountId: 63d3a56fce7f4b4e14fa7def)
- Ian Kim (accountId: ...)

## 주 워크스트림
- 글린다 온보딩
- 패키지할인
```

저장 완료 안내 후 Step 1 진행.

---

## Step 1 — 컨텍스트 파악

사용자가 줄 정보:
- 화면/캡처 (QA 환경 vs 디자인 비교)
- 작업명 (예: 글린다 온보딩, 콘텐츠 개편, 댓글 UI 개선)
- 실험군 구분 (A안/B안/C안) — 다변량 실험이면 명시
- 영향 플랫폼 (PC, Mobile, iOS, Android)
- 담당자 이름 (한글 별명 가능)
- 관련 에픽 키 (있다면)

부족한 정보는 개인 설정의 디폴트값을 우선 적용. 디폴트도 없으면 사용자에게 묻기.

---

## Step 2 — 프로젝트 자동 매핑

| 작업 영역 | 프로젝트 키 |
|---------|----------|
| 커머스 (글린다·장바구니·결제·쿠폰·상품 등) | `COMMWEB` |
| 콘텐츠/커뮤니티/CDP/리뷰 (웹) | `CONTWEB` |
| iOS 앱 QA | `OHSIOS` |
| Android 앱 QA | `OHSAND` |
| 기획·PRD·전략 에픽 (참고만) | `COMMPO` |

규칙:
- iOS/Android 동일 이슈는 양쪽 프로젝트에 각각 발행
- COMMWEB/CONTWEB은 PC와 Mobile Web을 한 티켓에 섹션 분리
- 영역이 모호하면 사용자에게 확인

---

## Step 3 — 필드 디폴트

| 필드 | 기본값 |
|------|-------|
| issueTypeName | **`Bug`** (한국어 "버그"는 API 거부) |
| Priority | `P2` |
| 라벨 | 개인 설정의 도메인 라벨 + `RC_BUG` |
| RC 회차 라벨 (`RC1`~`RC10`) | 사용자가 회차 명시 시에만 추가 |

도메인 라벨 가이드:
- 커머스 영역 → `Commerce`
- 콘텐츠/커뮤니티 → `community` (소문자) 또는 `Content`
- 특정 프로젝트 라벨이 있으면 함께 (예: `댓글경험개선`, `C&C_Renewal`, `CDP인기글`)

---

## Step 4 — 담당자 lookup

이름이 한글 별명이거나 영문화 표기가 다양할 수 있으므로 **반드시 `lookupJiraAccountId` 호출**해서 후보 확인.

**자주 헷갈리는 사례** (반드시 사용자 확인):
- `우기` → `Woogi Shin` (NOT `Ugo Kwon`)
- 영문 이름이 비슷한 동명이인은 후보를 모두 보여주고 컨펌
- 한글로 입력된 이름은 영문/한글 양쪽 검색 시도

개인 설정에 이미 매핑된 담당자는 캐시된 accountId 사용.

---

## Step 5 — 제목 포맷

```
[작업명] (안 구분 >) 구체적 현상 + 요청
```

예시:
- `[글린다 온보딩] B안 > 패키지할인 카드 이미지에 패딩 임베드`
- `[댓글 UI 개선] Three dots 버튼 컬러 디자인과 동일하게 적용`
- `[투탭][콘텐츠 개편] 필터 가이드 툴팁 디자인 피그마와 상이`

자주 쓰는 표현: "디자인과 상이", "수정 필요", "조정 필요", "제거", "노출"

---

## Step 6 — 본문 구조 (markdown)

```
## 현상
(어디서 어떤 현상이 발생하는지 구체적으로)

## 원인 추정
(있을 경우 — 이미지 패딩 임베드, CSS 클래스명, 토큰 누락 등)

---

### [PC]
- 디자인 스펙 (마진/패딩/컬러/폰트 값 등)
- 현재 상태
- 첨부: QA 환경 vs 디자인 비교 이미지

### [Mobile] (또는 iOS / Android)
- 디자인 스펙
- 현재 상태
- 첨부: QA 환경 vs 디자인 비교 이미지

## 기대 동작
(수정 후 어떻게 노출되어야 하는지)

## 관련 에픽
- COMMPO-XXXX (있다면)
```

규칙:
- 영향 없는 플랫폼은 `해당 없음 (정상 노출)` 명시
- PC와 Mobile 마진 값이 다르면 섹션 분리해서 각각 명시
- 마진/패딩 값은 `상 24 / 좌 24 / 우 24 / 하 28` 형식

---

## Step 7 — 발행 워크플로우

1. 정보 수집 (Step 1~4)
2. **초안을 표 + 코드블록으로 공유**: 필드값 + Description 미리보기
3. 사용자에게 "이대로 발행할까요?" 컨펌 요청 — **컨펌 없이 발행 절대 금지**
4. OK 받으면 `createJiraIssue` 호출
5. 발행 후 안내:
   - 티켓 링크 (markdown 링크: `[KEY-XXX](https://ohouse.atlassian.net/browse/KEY-XXX)`)
   - 첨부 이미지는 사용자가 Jira UI에 직접 업로드
   - 필요 시 추가 필드 (Verifier, Story Points, 담당 PO, 기한, Watcher) 입력 의사 확인

---

## Step 8 — 사용 도구

| 도구 | 용도 |
|-----|-----|
| `atlassianUserInfo` | 현재 사용자 확인 |
| `getJiraIssue` | 에픽/유관 티켓 컨텍스트 |
| `lookupJiraAccountId` | 담당자 ID 조회 |
| `searchJiraIssuesUsingJql` | 유사 티켓·기존 패턴 검색, 개인 셋업 추론 |
| `createJiraIssue` | 티켓 발행 (`issueTypeName="Bug"`) |
| `editJiraIssue` | 발행 후 추가 필드 채우기 |

---

## Step 9 — 주의사항

- `issueTypeName`은 반드시 **영문 `Bug`**, 한국어 "버그" 거부됨
- `additional_fields`에 `{"priority": {"name": "P2"}, "labels": [...]}` 형식으로 전달
- Cross-project 에픽 연결은 본문에 텍스트 링크로만 박고 정식 이슈 링크는 필요 시에만 시도
- 첨부 이미지는 API 업로드 시도 안 함 (사용자 직접 업로드가 빠르고 안정적)
- 같은 이슈가 여러 RC 회차에서 발견되면 라벨에 회차 누적 (예: `RC1`, `RC2`, `RC5`)
- 개인 설정 파일(`~/.claude/skill-prefs/jira-design-bug.md`)은 git에 올리지 않음
