# 06. 새 기능 추가하기

## 새 페이지 추가하는 순서

예시: "이용권 구매 페이지" 추가

### 1. 타입 확인 (`src/types/index.ts`)
이미 있으면 건너뜀. 없으면 추가.
```ts
export interface PurchaseRequest {
  branchPassId: number;
}
```

### 2. API 함수 추가 (`src/api/passApi.ts`)
```ts
export const purchasePass = (branchPassId: number) =>
  apiClient.post<MemberBranchPass>('/api/passes/purchase', { branchPassId });
```

### 3. 페이지 컴포넌트 생성 (`src/pages/member/PassPurchasePage.tsx`)
```tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBranchPasses, purchasePass } from '../../api/passApi';
import type { BranchPass } from '../../types';

export default function PassPurchasePage() {
  const { branchId } = useParams<{ branchId: string }>();
  const [passes, setPasses] = useState<BranchPass[]>([]);

  useEffect(() => {
    if (!branchId) return;
    getBranchPasses(Number(branchId)).then((res) => setPasses(res.data));
  }, [branchId]);

  const handlePurchase = async (passId: number) => {
    await purchasePass(passId);
    alert('구매 완료!');
  };

  return (
    <main>
      <h1>이용권 구매</h1>
      {passes.map((pass) => (
        <div key={pass.id}>
          <span>{pass.name}</span>
          <button onClick={() => handlePurchase(pass.id)}>구매</button>
        </div>
      ))}
    </main>
  );
}
```

### 4. 라우트 등록 (`src/App.tsx`)
```tsx
import PassPurchasePage from './pages/member/PassPurchasePage';

// Routes 안에 추가
<Route path="/branches/:branchId/passes" element={<PassPurchasePage />} />
```

### 5. 링크 추가 (필요한 곳에)
```tsx
<Link to={`/branches/${branchId}/passes`}>이용권 구매</Link>
// 또는
navigate(`/branches/${branchId}/passes`);
```

---

## CSS 스타일 추가하기

컴포넌트마다 `.module.css` 파일을 함께 만듭니다.

```css
/* PassPurchasePage.module.css */
.main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
}
```

```tsx
// PassPurchasePage.tsx에서 import
import styles from './PassPurchasePage.module.css';

// className에 사용
<main className={styles.main}>
  <div className={styles.card}>...</div>
</main>
```

**CSS Modules의 특징:**
- 클래스명이 자동으로 고유하게 변환됨 (예: `card` → `_card_a1b2c`)
- 다른 파일의 `.card` 클래스와 충돌하지 않음

---

## 자주 쓰는 패턴

### 로딩 + 에러 처리 패턴
```tsx
const [data, setData] = useState<T | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchSomething()
    .then((res) => setData(res.data))
    .catch(() => setError('실패했습니다.'))
    .finally(() => setLoading(false));
}, []);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
if (!data) return null;
```

### 폼 제출 패턴
```tsx
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();  // 페이지 새로고침 방지
  setSubmitting(true);
  try {
    await createSomething(formData);
    navigate('/success');
  } catch {
    alert('실패했습니다.');
  } finally {
    setSubmitting(false);
  }
};

<form onSubmit={handleSubmit}>
  <button type="submit" disabled={submitting}>
    {submitting ? '처리 중...' : '제출'}
  </button>
</form>
```

### 조건부 렌더링 패턴
```tsx
// 로그인한 경우에만 보여주기
{isLoggedIn && <button>예약하기</button>}

// 관리자인 경우에만 보여주기
{isAdmin && <Link to="/admin">관리자</Link>}

// 데이터 유무에 따라
{branches.length === 0 ? (
  <p>지점이 없습니다.</p>
) : (
  branches.map((b) => <BranchCard key={b.id} branch={b} />)
)}
```

---

## 백엔드 API가 아직 없을 때 (Mock 데이터)

개발 중 백엔드 API가 준비되지 않았다면, 임시로 목 데이터를 사용합니다:

```ts
// src/api/branchApi.ts - 임시 목 처리
export const getBranches = async () => {
  // TODO: 백엔드 연동 후 아래 주석 해제
  // return apiClient.get<Branch[]>('/api/branches');

  // 임시 목 데이터
  return {
    data: [
      { id: 1, name: '강남점', status: 'ACTIVE', address: '서울 강남구', ... },
      { id: 2, name: '홍대점', status: 'ACTIVE', address: '서울 마포구', ... },
    ] as Branch[]
  };
};
```
