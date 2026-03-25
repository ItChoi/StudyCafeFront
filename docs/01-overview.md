# 01. 프로젝트 전체 개요

## 이 프로젝트는 무엇인가?

`StudyCafe-front`는 백엔드 프로젝트 `StudyCafe` (Spring Boot + Kotlin)와 연동되는 **웹 프론트엔드**입니다.
사용자(회원)가 스터디카페의 지점을 찾고, 좌석을 예약하고, 이용권을 관리하는 화면을 제공합니다.

---

## 기술 스택

| 역할 | 기술 | 설명 |
|------|------|------|
| UI 프레임워크 | **React 19** | 화면을 컴포넌트 단위로 만드는 라이브러리 |
| 언어 | **TypeScript** | JavaScript에 타입을 추가한 언어. 백엔드의 Java/Kotlin처럼 컴파일 타임 타입 체크 가능 |
| 빌드 도구 | **Vite** | 개발 서버 + 번들러. Spring Boot의 Gradle과 비슷한 역할 |
| 페이지 라우팅 | **React Router v7** | URL별로 다른 화면을 보여주는 라이브러리 |
| HTTP 통신 | **Axios** | 백엔드 API를 호출하는 HTTP 클라이언트. Java의 RestTemplate/WebClient와 같은 역할 |
| 스타일링 | **CSS Modules** | 컴포넌트별 격리된 CSS. 클래스명 충돌 없음 |

---

## 백엔드 개발자를 위한 비유

| 프론트엔드 개념 | 백엔드 비유 |
|----------------|-------------|
| `App.tsx` | `Application.kt` (앱 진입점) |
| `React Component` | DTO + 뷰 렌더링 로직이 합쳐진 것 |
| `useState` | 요청 처리 중 임시로 값을 저장하는 변수 |
| `useEffect` | `@PostConstruct` - 컴포넌트가 마운트될 때 실행 |
| `Context API` | ThreadLocal / Spring Security Context - 전역 상태 공유 |
| `Custom Hook` | Service 레이어 - 비즈니스 로직 분리 |
| `CSS Module` | 컴포넌트-스코프 스타일 격리 |
| `.env` | `application.properties` |

---

## 프로젝트 디렉토리 구조

```
StudyCafe-front/
├── public/              # 정적 파일 (index.html, 아이콘 등)
├── src/
│   ├── api/             # 백엔드 API 호출 함수 모음
│   │   ├── client.ts        # Axios 인스턴스 (공통 설정)
│   │   ├── branchApi.ts     # 지점 관련 API
│   │   ├── reservationApi.ts # 예약 관련 API
│   │   └── passApi.ts       # 이용권 관련 API
│   │
│   ├── components/      # 재사용 가능한 UI 조각들
│   │   ├── common/          # 공통 컴포넌트 (로딩, 에러 등)
│   │   ├── layout/          # 레이아웃 (헤더 등)
│   │   ├── member/          # 회원 화면용 컴포넌트
│   │   └── admin/           # 관리자 화면용 컴포넌트
│   │
│   ├── pages/           # 각 URL에 대응하는 페이지 컴포넌트
│   │   ├── HomePage.tsx         → /
│   │   ├── LoginPage.tsx        → /login
│   │   ├── member/
│   │   │   ├── BranchListPage.tsx   → /branches
│   │   │   ├── BranchDetailPage.tsx → /branches/:branchId
│   │   │   ├── MyPassesPage.tsx     → /my/passes
│   │   │   └── MyReservationPage.tsx→ /my/reservations
│   │   └── admin/
│   │       └── AdminDashboardPage.tsx → /admin
│   │
│   ├── hooks/           # 커스텀 훅 (데이터 fetching 로직)
│   │   └── useBranches.ts
│   │
│   ├── context/         # 전역 상태 관리
│   │   └── AuthContext.tsx   # 로그인 상태
│   │
│   ├── types/           # TypeScript 타입 정의 (백엔드 도메인 모델 매핑)
│   │   └── index.ts
│   │
│   ├── utils/           # 순수 유틸리티 함수
│   │   └── format.ts    # 날짜, 금액, 상태 포맷팅
│   │
│   ├── App.tsx          # 라우터 설정 (Spring의 RequestMapping과 비슷)
│   ├── main.tsx         # React 앱 최초 실행 진입점
│   └── index.css        # 전역 스타일
│
├── docs/                # 이 문서들
├── .env                 # 환경 변수 (API 서버 주소 등)
├── package.json         # 의존성 관리 (build.gradle과 같은 역할)
├── tsconfig.json        # TypeScript 컴파일러 설정
└── vite.config.ts       # Vite 빌드 설정
```

---

## 화면 흐름 (URL 구조)

```
/                     홈 (랜딩 페이지)
/login                로그인
/branches             지점 목록
/branches/:id         지점 상세 + 좌석 배치도 + 예약
/my/passes            내 이용권 목록
/my/reservations      내 이용 현황 (퇴장, 연장, 이동)
/admin                관리자 대시보드
```
