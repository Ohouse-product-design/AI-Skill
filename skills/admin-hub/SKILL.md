---
name: admin-hub
description: "오늘의집 사내 어드민 디자인 자동화 통합 진입점. 도메인(커머스/광고/물류)을 선택하면 해당 도메인의 디자인 자동화 워크플로를 실행합니다."
---

# Admin Hub Skill

오늘의집 사내 여러 도메인의 어드민 디자인 자동화 스킬을 단일 진입점으로 모은 라우터입니다.
도메인을 선택하면 해당 도메인의 sub-skill에 작업을 위임하며, 각 도메인의 워크플로/산출물/안내 형식은 그대로 유지합니다.

## 호출

```
/admin-hub
```

## 사전 준비 (Setup)

본 스킬은 각 도메인 레포의 sub-skill을 **로컬에서 직접 읽어와 실행**합니다.
사용하려는 도메인의 레포가 로컬에 clone되어 있어야 합니다.

| 도메인 | 레포 | 기본 경로 환경변수 |
|---|---|---|
| 커머스 | `bucketplace/comm-po` | `COMMERCE_REPO_PATH` |
| 광고 | `bucketplace/ads-division` | `ADS_REPO_PATH` |
| 물류 | `bucketplace/admin-prototype` | `LOGISTICS_REPO_PATH` |

환경변수가 없으면 사용자에게 경로를 묻습니다.

---

## 실행 절차

### Step 1. 도메인 선택 질문

호출 시 도메인 정보가 없으면 사용자에게 묻습니다.

```
## 🗂 어떤 도메인의 어드민을 작업하시겠어요?

1) **커머스** — 오늘의집 커머스 어드민 (PDP, 프로모션, 쿠폰 등)
   ↳ Figma Make 템플릿 기반 새 페이지 빠르게 생성
   ↳ 산출물: 독립 실행 가능한 React 프로젝트
   ↳ 🌐 통합 스킬에서 빌드 + Vercel CLI 자동 배포 옵션 제공 (외부 URL 발급)

2) **광고** — 광고 어드민 (광고주/내부 운영자/대행사)
   ↳ 기존 페이지의 코드베이스를 분석한 정밀 디자인 산출물
   ↳ 산출물: 단일 HTML 파일 (정적 frame 또는 인터랙티브)
   ↳ ⚠️ 통합 스킬에서는 Jira/Index/PR 등 거버넌스 단계를 우회하고 로컬 HTML만 생성합니다 (자세한 내용은 Step 3 광고 도메인 주의사항 참고)
   ↳ 🌐 통합 스킬에서 사내 정적 서버(`/deploy-static`) 자동 호출 옵션 제공 (사내망 URL 발급, 외부 노출 X)

3) **물류** — 물류 어드민
   ↳ PRD를 받아 스펙독 정규화 → 프로토타입 구현
   ↳ 산출물: Next.js 리포 내 페이지 (Vercel 배포 가능)
   ↳ 🌐 통합 스킬에서 Vercel CLI 자동 배포 옵션 제공 (외부 URL 발급, 누적 사이트 전체 갱신)

번호 또는 도메인명으로 답해 주세요.
```

### Step 2. 레포 경로 확인

선택된 도메인의 레포 경로를 확인합니다.

1. 해당 도메인의 환경변수가 설정되어 있으면 그 경로 사용
2. 없으면 사용자에게 묻기:
   ```
   {도메인} 레포의 로컬 경로를 알려주세요. (예: ~/repos/comm-po)
   ```
3. 경로가 존재하지 않으면 clone 안내 후 중단

### Step 3. 도메인 sub-skill 위임

선택된 도메인의 sub-skill SKILL.md를 Read하고, **그 절차를 처음부터 끝까지 그대로 따릅니다.** 결과물 생성·사용자 안내·후속 단계 모두 sub-skill의 지시를 따르며, 본 라우터는 추가로 개입하지 않습니다.

| 도메인 | Sub-skill 진입점 |
|---|---|
| 커머스 | `{COMMERCE_REPO_PATH}/skills/admin-design/SKILL.md` |
| 광고 | `{ADS_REPO_PATH}/.claude/skills/add-doc/SKILL.md` (Path B/C만 사용) |
| 물류 | `{LOGISTICS_REPO_PATH}/.claude/skills/prd-to-prototype/SKILL.md` |

> **광고 도메인 주의사항**:
>
> **1) 문서 타입 고정**: 광고 sub-skill은 PRD/Scope/Tech Design 등 여러 문서 타입을 다루지만, 본 통합 스킬은 디자인 자동화 용도이므로 **Path B (ui-design) 또는 Path C (prototype)만** 실행합니다. 광고 sub-skill 호출 시 문서 타입을 `ui-design` 또는 `prototype` 중 하나로 고정합니다.
>
> **2) 거버넌스 단계 우회 (Draft 모드)**: 통합 스킬에서 광고 sub-skill을 호출할 때는 빠른 디자인 시안 생성에 집중하기 위해 광고 sub-skill의 다음 단계를 모두 스킵합니다:
> - Phase 1: Jira Task 생성 (`/new-feature`, `/new-adhoc` 호출 X)
> - Phase 1: Index 파일 생성 (`docs/indexes/*.md` 생성 X)
> - Path B/C 시작부: 브랜치 생성 (`git checkout -b add-doc/...` X)
> - Path B/C 종료부: 커밋·푸시·PR 생성 (`git commit`, `git push`, `gh pr create` X)
> - Index Document Registry 업데이트 X
> - 상위 문서(UI Design Spec / Scope) 의존 검증 → drift 경고는 무시하고 강행
>
> **3) 실행되는 단계**: Path C 기준 Step C-2 ~ C-8만 실행합니다.
> - Step C-2: target app 결정 (ads-partner-web / ads-admin-web / ads-agency-web 중 사용자 선택)
> - Step C-3: 광고 레포 소스코드 탐색 (컴포넌트·render·format 패턴 참고)
> - Step C-4: User Flow 그래프 (Frame 노드 + 전이 엣지) → **사용자 승인 게이트는 유지**
> - Step C-5: Motion primitive 선택
> - Step C-6: 컴포넌트 A/B/C 분류
> - Step C-7: 단일 self-contained HTML 생성 (Tailwind + React + Babel CDN)
> - Step C-8: 검증 (self-contained 규칙 + 시각 일치 + 흐름 완전성)
>
> **4) 산출물 위치**: `{ADS_REPO_PATH}/docs/prototype/{파일명}.html`. **로컬에만 생성**하며 커밋하지 않습니다. frontmatter의 `index_ref`, `depends_on` 은 placeholder로 둡니다.
>
> **5) 결과 안내 및 호스팅**: 생성된 로컬 HTML 파일 경로를 안내한 뒤 사용자에게 호스팅 옵션을 묻습니다. 동의 시 광고 레포의 `/deploy-static` 스킬을 자동 호출하여 사내 정적 서버 URL을 발급합니다 (사내망 한정, 외부 노출 X). 자세한 동작은 아래 "Step 4. 호스팅 자동화" 참고.
>
> **6) 정식 거버넌스가 필요한 경우**: 본 통합 스킬을 통하지 말고 광고 레포에서 직접 `/add-doc prototype` 또는 `/add-doc ui-design` 을 호출하세요. 정상 Jira/Index/PR 워크플로우가 실행됩니다.

---

### Step 4. 호스팅 자동화 (도메인별 옵션)

sub-skill 위임이 끝나면 admin-hub는 사용자에게 호스팅 여부를 묻고, 동의 시 도메인별로 적합한 호스팅을 자동 실행합니다. **git push는 어떤 도메인에서도 admin-hub가 자동 수행하지 않습니다.**

#### 도메인별 호스팅 정책

| 도메인 | 호스팅 방식 | URL 도달 범위 | 이유 |
|---|---|---|---|
| 🛒 커머스 | Vercel CLI (`vercel deploy --prod ./dist`) | 외부 인터넷 | 어드민 시안의 외부 공유 자유, 사용자 Vercel CLI 인증 가정 |
| 📢 광고 | 광고 레포의 `/deploy-static` 스킬 자동 호출 | 사내망 한정 | 광고주·대행사 데이터 보호 정책 (외부 노출 금지) |
| 📦 물류 | Vercel CLI (`vercel deploy --prod` — 리포 루트에서 실행) | 외부 인터넷 | 누적 Next.js 사이트 전체를 함께 갱신. 사용자 Vercel CLI 인증 가정 |

#### 4-A. 커머스 호스팅 자동화

1. **사용자에게 묻기**: "Vercel 외부 URL을 발급할까요? (npm install + build + vercel deploy 실행 — 첫 회 5~10분 소요)"
2. **Vercel scope 결정 (비대화 모드 대응)**: 비대화 모드의 `vercel deploy --yes`는 scope를 자동으로 추론하지 않으므로 `--scope` 를 명시해야 합니다.
   - 우선순위:
     1. 환경변수 `VERCEL_SCOPE` 가 있으면 사용
     2. `vercel teams list --output json` 으로 팀 목록 조회 → 1개면 자동 사용, 여러 개면 사용자에게 선택 요청
     3. 둘 다 실패 시 `vercel whoami` 결과(개인 scope)를 fallback으로 사용
3. **동의 시 실행**:
   ```bash
   cd {COMMERCE_REPO_PATH}/output/admin-design/{페이지명}
   npm install            # node_modules 없으면
   npm run build          # → dist/ 생성
   vercel deploy --prod --yes \
     --scope {결정된 scope} \
     --name {페이지명-kebab} \
     ./dist
   ```
   - `--scope`: Step 2에서 결정된 값
   - `--name`: 출력 폴더명(kebab-case)을 그대로 프로젝트명으로 사용. 누락 시 Vercel이 폴더명에서 자동 추출하면서 `./dist` → 프로젝트명이 `dist` 가 되는 버그가 있음. **반드시 명시할 것.**
   - `--yes`: 비대화 모드에서 추가 prompt 방지
4. **vite.config.ts 수정 불필요**: Vercel은 도메인 루트(`/`)로 배포하므로 base 경로 조정 불요
5. **결과 안내**: Vercel CLI가 출력하는 Production URL + Alias URL + Inspect URL 세 가지를 모두 사용자에게 전달
   ```
   ✅ 외부 URL 발급 완료
   → Production: https://{name}-{hash}-{scope}.vercel.app/
   → Alias:      https://{name}-{short}.vercel.app/
   → Inspect:    https://vercel.com/{scope}/{name}/{deployment-id}
   ```
6. **거절 시**: 로컬 dev 안내만 (`cd ... && npm install && npm run dev` → `http://localhost:5173`)

**전제 조건 확인**:
- `vercel --version` 실행 가능 (Vercel CLI 설치됨)
- `vercel whoami` 가 본인 계정 반환 (로그인됨)
- `vercel teams list` 또는 `VERCEL_SCOPE` 환경변수로 scope 결정 가능
- 위 중 하나라도 실패 시 사용자에게 안내 후 호스팅 단계 스킵

**환경 설치는 사용자가 직접 진행** (라우터 정책):
- Vercel CLI 자동 설치 시도 X (`npm i -g vercel`, `brew install vercel-cli` 등 자동 실행 금지)
- 사용자에게 설치 가이드 안내 후 완료 알림 받으면 재시도

**알려진 vercel CLI 동작 (51.x 기준)**:
- `vercel deploy --yes ./dist` (scope 미지정) → `missing_scope` 에러
- `vercel deploy --yes --scope X ./dist` (name 미지정) → 프로젝트명이 폴더명(`dist`)으로 자동 설정됨
- 따라서 `--scope` + `--name` + `--yes` 3가지를 항상 함께 사용

#### 4-B. 광고 호스팅 자동화

1. **사용자에게 묻기**: "사내 공유 URL을 발급할까요? (`/deploy-static` 호출 — 사내망에서만 접근 가능)"
2. **동의 시 실행**:
   ```
   광고 레포의 /deploy-static 스킬을 호출하여
   {ADS_REPO_PATH}/docs/prototype/{파일명}.html 을 업로드
   ```
3. **결과 안내**: deploy-static 이 반환하는 사내 URL 그대로 전달
   ```
   ✅ 사내 공유 URL 발급 완료 (사내망 한정)
   → https://static-contents.datapl.datahou.se/v2/.../{파일명}.html
   ```
4. **거절 시**: 로컬 파일 경로 안내 (`{ADS_REPO_PATH}/docs/prototype/{파일명}.html` — 더블클릭 실행)

**전제 조건 확인** (실패 시 사용자에게 안내 후 호스팅 단계 스킵):
- `aws --version` 실행 가능 (aws CLI 설치됨)
- `~/.aws/config` 에 `mgmt-developer` 프로필 등록됨
- `aws sts get-caller-identity --profile mgmt-developer` 가 `Account: 534193482673` 반환 (SSO 세션 유효)
- 위 중 하나라도 실패 시: deploy-static 의 가이드 메시지를 그대로 사용자에게 전달하고 호스팅 단계 스킵

**환경 설치는 사용자가 직접 진행** (라우터 정책):
- aws CLI 자동 설치 시도 X (`brew install awscli`, `installer -pkg` 등 자동 실행 금지)
- 사용자에게 설치 가이드 안내 후, 완료 알림 받으면 재시도
- 이 원칙은 다른 도메인의 환경 설치(Vercel CLI 등)에도 동일하게 적용

#### 4-C. 물류 호스팅 자동화

물류는 **누적 Next.js 사이트** 라는 특성이 있어, 한 번 배포하면 그동안 추가된 모든 페이지가 함께 production URL에 반영됩니다. 사용자에게 이 점을 명시적으로 경고한 뒤 동의 시 자동 실행합니다.

1. **사용자에게 묻기 (경고 포함)**:
   ```
   ⚠️ Vercel 외부 URL을 발급할까요?
      - admin-prototype 리포 전체가 배포됩니다
      - 이번에 추가한 페이지뿐 아니라 기존 누적된 모든 페이지가 같이 production URL에 반영됩니다
      - 이 시점에 의도치 않은 변경(작업 중인 다른 페이지 등)이 포함되지 않았는지 확인하세요
   ```
2. **동의 시 실행**:
   ```bash
   cd {LOGISTICS_REPO_PATH}
   vercel deploy --prod
   ```
3. **결과 안내**: Vercel CLI가 반환하는 URL을 그대로 사용자에게 전달
   ```
   ✅ 외부 URL 발급 완료 (누적 사이트 전체 갱신됨)
   → https://{프로젝트명}.vercel.app/{이번 페이지 경로}
   ```
4. **거절 시**: 로컬 dev 안내 (`cd {LOGISTICS_REPO_PATH} && npm run dev`)

**전제 조건 확인**:
- `vercel --version` 실행 가능 (Vercel CLI 설치됨)
- `vercel whoami` 가 본인 계정 반환 (로그인됨)
- admin-prototype 리포가 이미 Vercel 프로젝트와 연결되어 있어야 함 (이전 `vercel link` 또는 첫 `vercel deploy` 시 자동 prompt)
- 위 중 하나라도 실패 시 사용자에게 안내 후 호스팅 단계 스킵

**환경 설치는 사용자가 직접 진행** (라우터 정책):
- Vercel CLI / `vercel link` 자동 실행 X
- 사용자에게 설치·연결 가이드 안내 후 완료 알림 받으면 재시도

#### 4-D. 호스팅 단계 정책 요약

- ✅ admin-hub는 **호스팅을 자동화하지만 git push는 하지 않음**
- ✅ 호스팅은 **항상 사용자 동의 후 실행** (자동 강제 아님)
- ✅ 도메인별 정책 차이는 의도된 것 — 각 도메인의 보안 요건 존중
- ✅ 물류는 **누적 사이트 전체 갱신** 이라는 점을 사용자에게 명시적으로 경고한 뒤 실행
- ❌ 광고를 Vercel(외부)로 올리는 옵션은 제공하지 않음 (보안 정책 변경 필요)

---

## 라우터의 책임 경계

본 스킬이 하는 일:
- 도메인 선택 UI 제공
- 레포 경로 검증
- 적절한 sub-skill로 위임
- sub-skill 종료 후 **호스팅 자동화** (도메인별 정책에 따라, 사용자 동의 후만 실행). 자세한 내용은 위 "Step 4. 호스팅 자동화" 참고

본 스킬이 **하지 않는** 일:
- 도메인 sub-skill의 디자인 생성 절차(소스 탐색·가이드 적용·HTML/페이지 생성·검증) 변경
- 산출물 형식 강제 통일
- 결과물 안내 형식 통일 (sub-skill의 안내를 그대로 따름)
- 디자인 가이드 자체 보관 (각 도메인 레포가 SSOT)

각 도메인의 작업 절차/산출물/안내 형식은 sub-skill의 결정을 그대로 따릅니다.

**예외 — 광고 도메인 거버넌스 단계 우회**: 광고 도메인에 한해 거버넌스 단계(Jira Task / Index 파일 / 브랜치 / 커밋 / 푸시 / PR 생성 / Index Registry 업데이트)는 본 라우터에서 우회합니다. 디자인 생성 절차(Step C-2~C-8) 자체는 광고 sub-skill 지시 그대로 따릅니다. 자세한 내용은 위 "광고 도메인 주의사항" 참고.

**보완 — 호스팅 자동화**: sub-skill에 없는 호스팅 단계(URL 발급)는 본 라우터가 도메인별 정책에 따라 보완합니다. 단 git push는 어느 도메인에서도 admin-hub가 수행하지 않으며, 항상 사용자 동의 후만 실행합니다. 자세한 내용은 위 "Step 4. 호스팅 자동화" 참고.

---

## 트러블슈팅

**Q. 도메인 레포 경로가 잘못됨**
→ 환경변수 재설정 또는 clone 위치 확인

**Q. Sub-skill SKILL.md를 못 찾음**
→ 해당 도메인 레포가 최신 main 기준인지 확인. 가이드 경로가 변경되었을 수 있음.

**Q. 광고 도메인에서 다른 문서 타입(PRD, Scope 등)도 만들고 싶음**
→ 본 통합 스킬은 디자인 자동화 전용. 광고 레포에서 직접 `/add-doc` 호출하세요.

**Q. 광고 도메인에서 Jira/Index/PR 등 정식 거버넌스를 따르고 싶음**
→ 본 통합 스킬은 광고 도메인에 대해 거버넌스 우회 모드로만 동작합니다. 정식 워크플로우는 광고 레포에서 직접 `/add-doc prototype` 또는 `/add-doc ui-design` 을 호출하세요.

**Q. 통합 스킬로 만든 광고 prototype 결과를 동료에게 공유하고 싶음**
→ Step 4 호스팅 자동화에서 "사내 공유 URL 발급" 옵션을 선택하면 `/deploy-static` 이 자동 호출되어 사내망 URL이 발급됩니다 (사내망 한정).

**Q. 커머스 페이지를 외부 인터넷에서 보고 싶음**
→ Step 4 호스팅 자동화에서 "Vercel 배포" 옵션 선택. Vercel CLI 가 자동으로 빌드 + 배포 후 외부 URL을 안내합니다. `vercel login` 이 사전에 되어 있어야 합니다.

**Q. 광고를 외부 Vercel에 올리고 싶음**
→ 본 통합 스킬은 광고 = 사내 정적 서버만 지원합니다. 광고주·대행사 데이터 보호 정책상 외부 노출은 광고팀·보안팀 합의 필요. 합의 후 SKILL.md 정책을 변경해야 합니다.

**Q. Vercel CLI 가 없거나 로그인 안 되어 있음**
→ 호스팅 단계가 자동 스킵되고 로컬 dev 안내만 출력됩니다. 외부 URL 발급은 별도로 `vercel login` 후 재시도하세요.

**Q. Vercel 배포 시 `missing_scope` 에러가 나옴**
→ 비대화 모드에서는 `--scope` 가 필수입니다. Step 4-A의 scope 결정 절차에 따라 자동 처리되어야 하며, 안 되면 환경변수 `VERCEL_SCOPE` 를 직접 설정 후 재시도하세요.

**Q. Vercel 프로젝트명이 `dist` 로 만들어졌음**
→ `--name` 옵션 누락 시 폴더명에서 자동 추출되어 `./dist` → `dist`가 됩니다. Step 4-A 명령은 `--name {페이지명-kebab}` 을 항상 포함하도록 되어 있으며, 누락된 케이스에서는 Vercel 대시보드에서 프로젝트 이름을 수동으로 바꾸거나 프로젝트 삭제 후 재배포하세요.

**Q. 물류 페이지 하나만 추가했는데 vercel deploy 하면 다른 페이지도 같이 영향이 가나?**
→ 네. admin-prototype은 단일 Next.js 사이트라서 한 번 배포하면 그동안 누적된 모든 페이지가 같이 production URL에 반영됩니다. Step 4-C에서 경고 메시지를 보여드리며, 작업 중인 다른 페이지가 같이 올라가면 안 되는 상황이라면 배포를 거절하세요.

**Q. git push는 admin-hub가 자동으로 함?**
→ ❌ 어떤 도메인에서도 admin-hub는 git push를 자동 수행하지 않습니다. 호스팅은 git 영향 없이 Vercel CLI / 사내 정적 서버로만 진행됩니다.
