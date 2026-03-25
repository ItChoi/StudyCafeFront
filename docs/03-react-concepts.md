# 03. 백엔드 개발자를 위한 React 핵심 개념

## React란?

React는 **UI를 컴포넌트(Component) 단위로 만드는 JavaScript 라이브러리**입니다.
"컴포넌트"는 화면의 한 부분을 담당하는 함수입니다.

```tsx
// 이것이 컴포넌트 - 함수가 HTML을 반환
function BranchCard({ branch }: { branch: Branch }) {
  return (
    <div>
      <h3>{branch.name}</h3>
      <p>{branch.address}</p>
    </div>
  );
}
```

---

## JSX / TSX

HTML처럼 생겼지만 JavaScript(TypeScript)입니다.
파일 확장자가 `.tsx` = TypeScript + JSX

```tsx
// JSX - 자바스크립트 안에 HTML을 쓸 수 있음
const element = <h1>Hello, {name}</h1>;

// 중괄호 {} 안에는 JS 표현식 사용 가능
const price = <p>{(10000).toLocaleString()}원</p>;

// 조건부 렌더링
const badge = <span>{isActive ? '영업중' : '휴업'}</span>;

// 배열 렌더링 (map 사용)
const list = (
  <ul>
    {branches.map((b) => (
      <li key={b.id}>{b.name}</li>  // key는 필수! 백엔드의 PK 역할
    ))}
  </ul>
);
```

---

## useState - 컴포넌트 내 상태 관리

컴포넌트가 기억해야 하는 값을 저장합니다.
값이 바뀌면 화면이 자동으로 다시 렌더링됩니다.

```tsx
import { useState } from 'react';

function Counter() {
  // [현재값, 값을 변경하는 함수] = useState(초기값)
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      클릭 횟수: {count}
    </button>
  );
}
```

**실제 예시 - 로딩 상태 관리:**
```tsx
const [loading, setLoading] = useState(true);
const [branches, setBranches] = useState<Branch[]>([]);

// API 호출 후 상태 업데이트
setLoading(false);
setBranches(response.data);
```

> 백엔드 비유: 메서드 내의 지역 변수인데, 값이 바뀌면 화면이 자동으로 갱신됨

---

## useEffect - 사이드 이펙트 처리

컴포넌트가 화면에 나타날 때(마운트), 또는 특정 값이 바뀔 때 실행됩니다.
주로 **API 호출**에 사용합니다.

```tsx
import { useState, useEffect } from 'react';

function BranchListPage() {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    // 이 함수는 컴포넌트가 처음 화면에 나타날 때 실행됨
    getBranches().then((res) => {
      setBranches(res.data);
    });
  }, []); // 빈 배열 [] = 최초 한 번만 실행

  // ...
}
```

**의존성 배열에 따른 실행 시점:**
```tsx
useEffect(() => { ... }, []);           // 최초 마운트 시 한 번만
useEffect(() => { ... }, [branchId]);   // branchId가 바뀔 때마다
useEffect(() => { ... });               // 매 렌더링마다 (거의 안 씀)
```

> 백엔드 비유: `@PostConstruct` - 빈이 초기화된 후 실행

---

## Props - 부모에서 자식으로 데이터 전달

```tsx
// 부모 컴포넌트
function BranchListPage() {
  const branches = [...];

  return (
    <div>
      {branches.map((branch) => (
        // branch를 자식에게 props로 전달
        <BranchCard key={branch.id} branch={branch} />
      ))}
    </div>
  );
}

// 자식 컴포넌트 - props를 받아서 사용
function BranchCard({ branch }: { branch: Branch }) {
  return <h3>{branch.name}</h3>;
}
```

> 백엔드 비유: 메서드에 인자(파라미터)를 전달하는 것

---

## 커스텀 훅 (Custom Hook)

`use`로 시작하는 함수. 재사용 가능한 로직을 추출합니다.

```tsx
// hooks/useBranches.ts - Service 레이어처럼 데이터 fetching 로직 분리
function useBranches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBranches()
      .then((res) => setBranches(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { branches, loading };
}

// 사용하는 곳
function BranchListPage() {
  const { branches, loading } = useBranches(); // 깔끔하게 재사용
  // ...
}
```

> 백엔드 비유: Service 클래스 - Controller에서 비즈니스 로직을 분리하는 것처럼, 컴포넌트에서 데이터 로직을 분리

---

## Context API - 전역 상태 관리

로그인 정보처럼 여러 컴포넌트에서 공유해야 하는 데이터를 관리합니다.

```tsx
// 1. Context 생성 (AuthContext.tsx)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Provider로 앱을 감싸면 하위 모든 컴포넌트에서 사용 가능 (App.tsx)
<AuthProvider>
  <App />
</AuthProvider>

// 3. 어디서든 useAuth()로 꺼내서 사용
function Header() {
  const { member, logout } = useAuth();
  return <span>{member?.nickname}님</span>;
}
```

> 백엔드 비유: Spring Security의 SecurityContextHolder - 요청 처리 중 어디서나 인증 정보 접근 가능

---

## React Router - 페이지 라우팅

URL에 따라 다른 컴포넌트(페이지)를 보여줍니다.

```tsx
// App.tsx - Spring의 @RequestMapping과 유사
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/branches" element={<BranchListPage />} />
  <Route path="/branches/:branchId" element={<BranchDetailPage />} />
</Routes>
```

**URL 파라미터 읽기:**
```tsx
// /branches/42 접속 시
function BranchDetailPage() {
  const { branchId } = useParams<{ branchId: string }>();
  // branchId = "42"  (문자열이므로 Number() 변환 필요)
}
```

**프로그래밍 방식 이동:**
```tsx
const navigate = useNavigate();
navigate('/login');           // 로그인 페이지로 이동
navigate(`/branches/${id}`);  // 특정 지점 페이지로 이동
navigate(-1);                 // 뒤로가기
```
