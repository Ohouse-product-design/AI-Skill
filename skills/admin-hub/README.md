# admin-hub

오늘의집 사내 어드민 디자인 자동화의 **단일 진입점 라우터**.

스킬 본체는 가이드를 보관하지 않습니다. 도메인을 선택받아 해당 도메인 레포의 sub-skill을 그대로 실행합니다. SSOT는 각 도메인 레포.

## 사용법

```
/admin-hub
```

호출하면 도메인을 묻고, 선택된 도메인 레포의 sub-skill SKILL.md를 Read하여 그 절차를 처음부터 끝까지 그대로 따릅니다.

## 사전 셋업 (CLI 도구) — 호스팅을 쓸 경우에만 필요

admin-hub의 디자인 생성까지는 추가 셋업 없이 동작합니다. **호스팅(URL 발급) 단계** 를 쓸 때만 도메인별로 다음 CLI가 필요합니다. 한 번 셋업하면 계속 사용 가능합니다.

| 도메인 | 필요 CLI | 셋업 명령 | 셋업 시간 |
|---|---|---|---|
| 🛒 커머스 (Vercel) | Vercel CLI | `npm i -g vercel && vercel login` | ~2분 |
| 📢 광고 (사내 정적 서버) | aws CLI + SSO 설정 | 아래 별도 절차 참고 | ~10분 (최초) |
| 📦 물류 (Vercel) | Vercel CLI | 커머스와 동일 | (위와 공유) |

**광고 호스팅을 안 쓰면 aws CLI는 불필요합니다.** 광고 도메인을 자주 만들지 않는 사용자는 디자인 생성까지만 진행하고, 호스팅이 필요할 때만 셋업하면 됩니다.

### 📢 광고 호스팅용 aws CLI + SSO 셋업 (최초 1회)

```bash
# 1. aws CLI 설치 (이미 있으면 건너뛰기)
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "/tmp/AWSCLIV2.pkg"
sudo installer -pkg /tmp/AWSCLIV2.pkg -target /

# 2. SSO 프로필 등록 (대화형 — 사내 가이드에서 SSO start URL 확인 필요)
aws configure sso --profile mgmt-developer
#   SSO session name: bucketplace-sso-session
#   SSO start URL:    (사내 가이드 또는 동료에게 확인. https://*.awsapps.com/start 형태)
#   SSO region:       ap-northeast-2
#   Account ID:       534193482673
#   Role:             Athena-Mgmt
#   region:           ap-northeast-2
#   output:           json
#   CLI profile name: mgmt-developer

# 3. 검증
aws sts get-caller-identity --profile mgmt-developer
# → Account: 534193482673 나오면 성공
```

이후에는 `aws sso login --sso-session bucketplace-sso-session` 만 주기적으로 (보통 하루 1회 토큰 만료 시) 실행하면 됩니다.

> **참고**: aws CLI + SSO는 광고 도메인 외에도 Athena 쿼리(`ads-data-analytics` 스킬 등) 등 사내 SSO 기반 도구에 모두 활용되는 표준 셋업입니다. 광고팀 동료들은 거의 모두 이미 셋업된 상태이며, 비-광고팀이 처음 광고 작업을 할 때 1회 진입 비용이 발생합니다.

### Vercel CLI 셋업 (커머스/물류용, 최초 1회)

```bash
npm i -g vercel
vercel login   # 브라우저 승인
```

이후 admin-hub 호스팅 단계가 호출되면 자동으로 빌드/배포되며, scope/name 등은 admin-hub가 알아서 처리합니다.

## 환경변수 설정 (선택)

각 도메인 레포 경로를 환경변수로 설정해두면 매번 묻지 않습니다.

```bash
export COMMERCE_REPO_PATH=~/repos/comm-po
export ADS_REPO_PATH=~/repos/ads-division
export LOGISTICS_REPO_PATH=~/repos/admin-prototype
```

미설정 시 호출할 때마다 경로를 묻습니다.

## 도메인별 Sub-skill 매핑

| 도메인 | 레포 | Sub-skill 경로 | 산출물 | 호스팅 (admin-hub 단) |
|---|---|---|---|---|
| 커머스 | `bucketplace/comm-po` | `skills/admin-design/SKILL.md` | 독립 실행 React 프로젝트 | Vercel CLI (외부 URL, 페이지 단위) |
| 광고 | `bucketplace/ads-division` | `.claude/skills/add-doc/SKILL.md` (Path B/C, 거버넌스 우회) | 로컬 단일 HTML 파일 (Jira/Index/PR 미생성) | 사내 정적 서버 (사내망 URL, 파일 단위) |
| 물류 | `bucketplace/admin-prototype` | `.claude/skills/prd-to-prototype/SKILL.md` | Next.js 페이지 | Vercel CLI (외부 URL, 누적 사이트 전체 갱신 — 경고 후 동의 시) |

> **광고 도메인 거버넌스 우회**: 통합 스킬에서 광고를 호출하면 Jira Task / Index 파일 / 브랜치 / 커밋 / 푸시 / PR 생성을 모두 스킵하고 로컬 HTML만 생성합니다. 정식 거버넌스가 필요한 경우 광고 레포에서 직접 `/add-doc` 을 호출하세요. 자세한 동작은 `SKILL.md` 의 "광고 도메인 주의사항" 참고.

> **호스팅 자동화**: sub-skill 종료 후 도메인별 정책에 따라 URL 발급을 보완합니다. 커머스/물류는 Vercel CLI(외부 URL), 광고는 `/deploy-static`(사내망 URL). 물류는 누적 사이트 특성상 배포 시 사이트 전체가 갱신되므로 경고 메시지를 별도로 띄웁니다. git push는 어떤 도메인에서도 admin-hub가 자동 수행하지 않으며, 호스팅은 항상 사용자 동의 후 실행됩니다. 자세한 동작은 `SKILL.md` 의 "Step 4. 호스팅 자동화" 참고.

## 새 도메인 추가하는 법

admin-hub는 라우터이므로 새 도메인 추가는 다음 순서:

1. **도메인 레포에 sub-skill을 만든다** (`SKILL.md` 작성)
2. `SKILL.md`의 "사전 준비" 표에 도메인/레포/환경변수 행 추가
3. "실행 절차 Step 1"의 도메인 선택 메뉴에 새 옵션 추가
4. "실행 절차 Step 3"의 Sub-skill 진입점 표에 경로 추가

가이드/템플릿은 admin-hub에 두지 않고 해당 도메인 레포에 둡니다.

## 책임 경계

자세한 내용은 `SKILL.md`의 "라우터의 책임 경계" 섹션 참조.

요약:
- 라우터는 **선택·경로검증·위임 + 호스팅 자동화 (보완)** 만 합니다
- 산출물 형식이나 안내 형식을 도메인 간 통일하지 않습니다
- 각 도메인의 디자인 생성 절차는 sub-skill이 단독으로 결정합니다
- **예외**: 광고 도메인에 한해 거버넌스 단계(Jira/Index/PR)는 라우터에서 우회합니다 (디자인 생성 절차 자체는 sub-skill 그대로)
- **보완**: sub-skill에 없는 호스팅 단계(URL 발급)는 라우터가 도메인별 정책에 따라 보완합니다 (커머스=Vercel, 광고=사내서버, 물류=Vercel + 누적 경고). git push는 어느 도메인에서도 자동 수행 안 함
