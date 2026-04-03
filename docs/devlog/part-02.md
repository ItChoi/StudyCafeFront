# 백엔드 개발자를 위한 React 프론트 개발 플로우 가이드 — Part 2

> 이 문서는 Spring Boot 백엔드 경험은 있지만 React 프론트 개발이 처음인 분을 위한 가이드입니다.
> "이 코드는 어디에 쓰는 건가?", "새 화면은 어떻게 추가하는 건가?"에 답합니다.

---

## 1. 브라우저에서 화면이 뜨는 원리 (Spring과 비교)

### Spring MVC 방식 (서버 사이드 렌더링)
```
브라우저 요청 → Spring Controller → HTML 생성 → 브라우저에 전달 → 화면 표시
```
URL마다 서버가 새 HTML을 만들어서 내려줍니다.

### React 방식 (클라이언트 사이드 렌더링, SPA)
```
브라우저 최초 요청 → index.html + JS 번들 1번만 다운로드
이후 URL 이동 → JS가 DOM을 직접 교체 → 서버 요청 없음
데이터 필요할 때만 → API 서버 호출 (JSON만 주고받음)
```

핵심: **서버는 API만 제공, 화면 전환은 브라우저 JS가 처리합니다.**

---

## 2. 진입점 파일 3개 — 실행 흐름

```
index.html
  └─ /src/main.tsx        (자바로 치면 main() 메서드)
       └─ /src/App.tsx     (라우팅 설정, Spring의 WebMvcConfigurer와 유사)
            └─ pages/*.tsx  (실제 화면)
```

### `index.html` — 뼈대 HTML (건드릴 일 거의 없음)
```html
<body>
  <div id="root"></div>                    <!-- React가 여기에 화면을 그립니다 -->
  <script type="module" src="/src/main.tsx"></script>
</body>
```

### `src/main.tsx` — React 앱 시작점
```tsx
createRoot(document.getElementById('root')!).render(
  <App />
)
```
`id="root"` div에 React 앱을 마운트합니다. 거의 수정하지 않습니다.

### `src/App.tsx` — 라우팅 설정 (Spring의 @RequestMapping 모음)
```tsx
<Routes>
  <Route path="/"              element={<HomePage />} />
  <Route path="/login"         element={<LoginPage />} />
  <Route path="/branches"      element={<BranchListPage />} />
  <Route path="/branches/:id"  element={<BranchDetailPage />} />
</Routes>
```
URL 경로와 화면 컴포넌트를 연결합니다. **새 페이지를 만들면 여기에 Route를 추가합니다.**

---

## 3. 디렉터리 구조 — 역할별 분류

```
src/
├── main.tsx                  # 진입점 (main 메서드)
├── App.tsx                   # 라우팅 설정
├── index.css                 # 전역 CSS
│
├── pages/                    # 화면 단위 컴포넌트 (Spring Controller와 유사)
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── member/
│   │   ├── BranchListPage.tsx
│   │   └── BranchDetailPage.tsx
│   └── admin/
│       └── AdminDashboardPage.tsx
│
├── components/               # 재사용 가능한 UI 조각 (Spring의 공통 유틸과 유사)
│   ├── layout/
│   │   └── Header.tsx        # 모든 페이지에 공통 노출되는 헤더
│   ├── common/
│   │   ├── LoadingSpinner.tsx # 로딩 표시
│   │   └── ErrorMessage.tsx   # 에러 표시
│   └── member/
│       ├── BranchCard.tsx    # 지점 카드 UI
│       └── SeatMap.tsx       # 좌석 배치도 UI
│
├── api/                      # API 호출 함수 모음 (Spring의 FeignClient / RestTemplate과 유사)
│   ├── client.ts             # Axios 기본 설정 (baseURL, 토큰 자동 첨부)
│   ├── branchApi.ts          # 지점 관련 API
│   ├── passApi.ts            # 이용권 관련 API
│   └── reservationApi.ts     # 예약 관련 API
│
├── hooks/                    # 데이터 가져오기 로직 (서비스 레이어와 유사)
│   └── useBranches.ts        # 지점 목록/좌석 조회 훅
│
├── context/                  # 전역 상태 (로그인 정보 등)
│   └── AuthContext.tsx       # 로그인 상태 관리 (Spring의 SecurityContext와 유사)
│
├── types/                    # TypeScript 타입 정의 (Spring의 DTO/Entity와 유사)
│   └── index.ts
│
└── utils/                    # 순수 유틸 함수
    └── format.ts
```

---

## 4. 컴포넌트 — HTML을 작성하는 단위

React에서 화면은 **컴포넌트(Component)** 단위로 작성합니다.  
컴포넌트는 **함수**이고, **JSX(HTML처럼 생긴 문법)를 반환**합니다.

```tsx
// src/pages/member/BranchListPage.tsx

export default function BranchListPage() {
  // 자바스크립트 로직
  const { branches, loading, error } = useBranches();

  if (loading) return <LoadingSpinner />;   // 다른 컴포넌트를 HTML 태그처럼 사용
  if (error) return <ErrorMessage message={error} />;

  // return 안이 실제 HTML (JSX)
  return (
    <main className={styles.main}>
      <h1>지점 목록</h1>
      <div className={styles.grid}>
        {branches.map((branch) => (
          <BranchCard key={branch.id} branch={branch} />  {/* 컴포넌트 재사용 */}
        ))}
      </div>
    </main>
  );
}
```

### JSX 문법 — HTML과 다른 점

| HTML | JSX | 이유 |
|------|-----|------|
| `class="..."` | `className="..."` | `class`는 JS 예약어 |
| `for="..."` | `htmlFor="..."` | `for`는 JS 예약어 |
| `<input>` | `<input />` | JSX는 반드시 닫는 태그 필요 |
| `<!-- 주석 -->` | `{/* 주석 */}` | JSX 주석 문법 |
| `onclick="..."` | `onClick={함수}` | 이벤트 핸들러는 camelCase + 함수 참조 |

### 자바스크립트 변수를 JSX에 넣는 법
```tsx
const name = "홍길동";
return <h1>안녕하세요, {name}님</h1>;   // 중괄호 {}로 JS 표현식 삽입
```

---

## 5. CSS Modules — 스타일 작성법

이 프로젝트는 **CSS Modules**를 사용합니다. 파일명이 `*.module.css`입니다.

```css
/* BranchListPage.module.css */
.main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
```

```tsx
// BranchListPage.tsx
import styles from './BranchListPage.module.css';

return (
  <main className={styles.main}>        {/* styles.클래스명 으로 적용 */}
    <div className={styles.grid}>
```

**장점:** 클래스명이 자동으로 고유화되어 다른 파일의 `.main`과 충돌하지 않습니다.

---

## 6. State (상태) — 화면을 바꾸는 데이터

React에서 화면에 영향을 주는 데이터는 **State**로 관리합니다.  
State가 바뀌면 자동으로 화면이 다시 그려집니다 (리렌더링).

```tsx
import { useState } from 'react';

function LoginPage() {
  // [현재 값, 값을 바꾸는 함수] = useState(초기값)
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <input
      value={nickname}                              // State를 화면에 표시
      onChange={(e) => setNickname(e.target.value)} // 입력 시 State 업데이트
    />
  );
}
```

**백엔드 비유:** 지역 변수가 아닌, 변경될 때마다 View를 자동 갱신하는 Observable 변수라고 보면 됩니다.

---

## 7. API 호출 — 백엔드와 통신하는 방법

### 계층 구조 (Spring의 Controller → Service → Repository와 유사)

```
Page 컴포넌트
  └─ Custom Hook (useBranches.ts)    ← 로딩/에러 상태 관리
       └─ API 함수 (branchApi.ts)    ← Axios 호출
            └─ apiClient (client.ts) ← baseURL, 토큰 자동 첨부
```

### Step 1: `src/api/client.ts` — Axios 인스턴스 (공통 설정)
```ts
const apiClient = axios.create({
  baseURL: 'http://localhost:8080',  // 백엔드 주소
  timeout: 10000,
});

// 모든 요청에 JWT 토큰 자동 첨부
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Step 2: `src/api/branchApi.ts` — API 함수 정의
```ts
import apiClient from './client';

export const getBranches = () =>
  apiClient.get<Branch[]>('/api/branches');

export const getBranch = (branchId: number) =>
  apiClient.get<Branch>(`/api/branches/${branchId}`);

export const createBranch = (data: Omit<Branch, 'id'>) =>
  apiClient.post<Branch>('/api/admin/branches', data);
```

### Step 3: `src/hooks/useBranches.ts` — 데이터 훅 (로딩/에러 포함)
```ts
export function useBranches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {   // 컴포넌트가 화면에 처음 표시될 때 실행 (Spring의 @PostConstruct와 유사)
    getBranches()
      .then((res) => setBranches(res.data))
      .catch(() => setError('불러오기 실패'))
      .finally(() => setLoading(false));
  }, []);  // [] = 의존성 배열. 빈 배열이면 최초 1회만 실행

  return { branches, loading, error };
}
```

### Step 4: Page 컴포넌트에서 사용
```tsx
function BranchListPage() {
  const { branches, loading, error } = useBranches(); // 훅 호출 한 줄로 끝

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return ( ... );
}
```

### POST 요청 (폼 제출) 예시 — LoginPage.tsx
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();  // 폼 기본 동작(페이지 새로고침) 방지
  setLoading(true);

  try {
    const res = await apiClient.post('/api/auth/login', { nickname, password });
    const { token, member } = res.data;
    login(token, member);    // Context에 로그인 정보 저장
    navigate('/');           // 홈으로 이동
  } catch {
    setError('로그인 실패');
  } finally {
    setLoading(false);
  }
};
```

---

## 8. 화면 전환 — React Router

### `<Link>` — 클릭 시 이동 (HTML `<a>` 태그 대신 사용)
```tsx
import { Link } from 'react-router-dom';

<Link to="/branches">지점 찾기</Link>
<Link to={`/branches/${branch.id}`}>상세 보기</Link>
```

### `useNavigate()` — 코드에서 이동 (로그인 후 리다이렉트 등)
```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/');           // 홈으로 이동
navigate('/login');      // 로그인 페이지로 이동
navigate(-1);            // 뒤로가기
```

### `useParams()` — URL 경로 파라미터 읽기
```tsx
import { useParams } from 'react-router-dom';

// App.tsx에서: <Route path="/branches/:branchId" ...>
function BranchDetailPage() {
  const { branchId } = useParams<{ branchId: string }>();
  const id = Number(branchId);
  // ...
}
```

---

## 9. 전역 상태 (Context) — 로그인 정보 공유

여러 컴포넌트에서 공유해야 하는 데이터(로그인 정보 등)는 **Context**로 관리합니다.  
Spring의 `SecurityContextHolder`와 비슷한 개념입니다.

### 사용법
```tsx
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { isLoggedIn, member, logout } = useAuth();

  return (
    <header>
      {isLoggedIn ? (
        <>
          <span>{member?.nickname}님</span>
          <button onClick={logout}>로그아웃</button>
        </>
      ) : (
        <Link to="/login">로그인</Link>
      )}
    </header>
  );
}
```

---

## 10. 공통 컴포넌트 — 재사용하는 방법

`src/components/` 안의 컴포넌트는 여러 페이지에서 불러다 씁니다.

```tsx
// 사용 예시
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import BranchCard from '../../components/member/BranchCard';

// JSX에서 HTML 태그처럼 사용
<LoadingSpinner />
<ErrorMessage message="에러 메시지" />
<BranchCard branch={branchData} />
```

**컴포넌트에 데이터를 전달할 때는 Props를 씁니다.**  
Props는 함수 인자와 동일합니다.
```tsx
// BranchCard.tsx 정의부
interface Props {
  branch: Branch;
}
export default function BranchCard({ branch }: Props) {
  return <div>{branch.name}</div>;
}

// 사용부
<BranchCard branch={myBranch} />   // branch prop 전달
```

---

## 11. 새 페이지 추가하는 전체 순서

예시: **공지사항 목록 페이지** (`/notices`) 추가

### Step 1: API 함수 추가 — `src/api/noticeApi.ts`
```ts
import apiClient from './client';
import type { Notice } from '../types';

export const getNotices = () =>
  apiClient.get<Notice[]>('/api/notices');
```

### Step 2: 타입 추가 — `src/types/index.ts`
```ts
export interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}
```

### Step 3: 훅 추가 (선택) — `src/hooks/useNotices.ts`
```ts
import { useState, useEffect } from 'react';
import { getNotices } from '../api/noticeApi';
import type { Notice } from '../types';

export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getNotices()
      .then((res) => setNotices(res.data))
      .catch(() => setError('공지사항을 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, []);

  return { notices, loading, error };
}
```

### Step 4: 페이지 컴포넌트 작성 — `src/pages/NoticePage.tsx`
```tsx
import { useNotices } from '../hooks/useNotices';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import styles from './NoticePage.module.css';

export default function NoticePage() {
  const { notices, loading, error } = useNotices();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className={styles.main}>
      <h1>공지사항</h1>
      <ul>
        {notices.map((notice) => (
          <li key={notice.id}>
            <h2>{notice.title}</h2>
            <p>{notice.createdAt}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

### Step 5: CSS 파일 작성 — `src/pages/NoticePage.module.css`
```css
.main {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}
```

### Step 6: 라우팅 등록 — `src/App.tsx`
```tsx
import NoticePage from './pages/NoticePage';  // import 추가

// Routes 안에 Route 추가
<Route path="/notices" element={<NoticePage />} />
```

### Step 7: 헤더 링크 추가 (선택) — `src/components/layout/Header.tsx`
```tsx
<Link to="/notices">공지사항</Link>
```

---

## 12. 개발 서버 실행

```bash
npm run dev    # 개발 서버 시작 (기본 포트 5173)
npm run build  # 프로덕션 빌드 (dist/ 폴더에 생성)
```

`.env` 파일로 백엔드 주소를 설정할 수 있습니다:
```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## 13. 전체 데이터 흐름 요약

```
[브라우저 URL 변경]
       ↓
[App.tsx Route 매핑] → 해당 Page 컴포넌트 렌더링
       ↓
[Page 컴포넌트 초기화] → useEffect 실행
       ↓
[Custom Hook] → API 함수 호출
       ↓
[API 함수 (branchApi.ts)] → Axios 요청
       ↓
[apiClient (client.ts)] → JWT 토큰 첨부 후 백엔드 전송
       ↓
[백엔드 응답 수신] → State 업데이트 (setBranches)
       ↓
[State 변경 감지] → 컴포넌트 자동 리렌더링
       ↓
[JSX → 브라우저 화면 반영]
```

---

## 핵심 요약 (한 줄씩)

| 역할 | 파일/위치 | Spring 비유 |
|------|-----------|-------------|
| 앱 진입점 | `src/main.tsx` | `main()` 메서드 |
| 라우팅 설정 | `src/App.tsx` | `WebMvcConfigurer` / `@RequestMapping` 모음 |
| 화면 | `src/pages/**/*.tsx` | Thymeleaf 템플릿 |
| 공통 UI | `src/components/**/*.tsx` | 공통 Fragment / 레이아웃 |
| API 호출 | `src/api/*.ts` | `FeignClient` / `RestTemplate` |
| 비즈니스 로직 + 상태 | `src/hooks/*.ts` | Service 레이어 |
| 전역 상태 | `src/context/*.tsx` | `SecurityContextHolder` / Bean |
| 타입 정의 | `src/types/index.ts` | DTO / Entity 클래스 |
| 스타일 | `*.module.css` | — |
