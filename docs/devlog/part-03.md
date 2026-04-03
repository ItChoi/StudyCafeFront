# 새 화면 추가 + API 데이터 바인딩 실전 순서 — Part 3

> 예시: **이용권 구매 페이지** (`/branches/:branchId/purchase`) 추가

---

## 작업 순서 한눈에 보기

```
1. src/types/index.ts               → 데이터 구조 정의 (DTO)
2. src/api/passApi.ts               → 백엔드 엔드포인트 연결
3. src/hooks/useBranchPasses.ts     → 로딩/에러 포함 데이터 가져오기 로직
4. src/pages/.../PurchasePassPage.tsx       → 화면 + 이벤트 처리
5. src/pages/.../PurchasePassPage.module.css → 스타일
6. src/App.tsx                      → URL 라우팅 등록
7. (선택) 다른 페이지에 진입 링크 추가
```

---

## STEP 1. 타입 확인 — `src/types/index.ts`

API 응답 데이터 모양을 타입으로 정의합니다. 이미 있으면 넘어갑니다.

```ts
export interface BranchPass {
  id: number;
  branchId: number;
  name: string;
  passType: PassType;  // 'TIME' | 'PERIOD' | 'COUNT'
  price: number;
}
```

---

## STEP 2. API 함수 확인/추가 — `src/api/passApi.ts`

백엔드 엔드포인트 1개 = 함수 1개

```ts
// GET — 이용권 목록 조회
export const getBranchPasses = (branchId: number) =>
  apiClient.get<BranchPass[]>(`/api/branches/${branchId}/passes`);

// POST — 이용권 구매
export const purchasePass = (branchPassId: number) =>
  apiClient.post<MemberBranchPass>('/api/passes/purchase', { branchPassId });
```

---

## STEP 3. Hook 작성 — `src/hooks/useBranchPasses.ts` (새로 생성)

로딩/에러 상태 + GET API 호출 로직을 묶는 파일.  
**Hook은 GET 전용으로 쓰는 패턴**이고, POST/PATCH는 Page 컴포넌트에서 직접 호출합니다.

```ts
import { useState, useEffect } from 'react';
import { getBranchPasses } from '../api/passApi';
import type { BranchPass } from '../types';

export function useBranchPasses(branchId: number) {
  const [passes, setPasses] = useState<BranchPass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBranchPasses(branchId)
      .then((res) => setPasses(res.data))
      .catch(() => setError('이용권 목록을 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [branchId]);  // branchId가 바뀌면 재호출

  return { passes, loading, error };
}
```

---

## STEP 4. 페이지 컴포넌트 작성 — `src/pages/member/PurchasePassPage.tsx` (새로 생성)

```tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBranchPasses } from '../../hooks/useBranchPasses';
import { purchasePass } from '../../api/passApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import styles from './PurchasePassPage.module.css';

export default function PurchasePassPage() {
  // ① URL 파라미터 꺼내기 (/branches/:branchId/purchase)
  const { branchId } = useParams<{ branchId: string }>();
  const navigate = useNavigate();

  // ② Hook 호출 한 줄로 데이터 패치 완료 (컴포넌트 마운트 시 자동 API 호출)
  const { passes, loading, error } = useBranchPasses(Number(branchId));

  // ③ POST 요청용 로컬 상태
  const [purchasing, setPurchasing] = useState(false);

  // ④ 버튼 클릭 → POST 요청
  const handlePurchase = async (passId: number) => {
    setPurchasing(true);
    try {
      await purchasePass(passId);
      alert('구매 완료!');
      navigate('/my/passes');  // 구매 후 내 이용권 페이지로 이동
    } catch {
      alert('구매 실패. 다시 시도해주세요.');
    } finally {
      setPurchasing(false);
    }
  };

  // ⑤ 로딩/에러는 공통 컴포넌트 사용
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // ⑥ 데이터 바인딩 + 렌더링
  return (
    <main className={styles.main}>
      <h1>이용권 구매</h1>
      <ul className={styles.list}>
        {passes.map((pass) => (
          <li key={pass.id} className={styles.item}>
            <span>{pass.name}</span>
            <span>{pass.price.toLocaleString()}원</span>
            <button
              onClick={() => handlePurchase(pass.id)}
              disabled={purchasing}
            >
              구매
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

---

## STEP 5. CSS 작성 — `src/pages/member/PurchasePassPage.module.css` (새로 생성)

```css
.main {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
```

---

## STEP 6. 라우팅 등록 — `src/App.tsx`

```tsx
// 1. import 추가
import PurchasePassPage from './pages/member/PurchasePassPage';

// 2. Routes 안에 Route 추가
<Route path="/branches/:branchId/purchase" element={<PurchasePassPage />} />
```

---

## STEP 7. 진입 링크 추가 (선택) — 다른 페이지에서

```tsx
// BranchDetailPage.tsx 등에서
import { Link } from 'react-router-dom';

<Link to={`/branches/${branch.id}/purchase`}>이용권 구매하기</Link>
```

---

## 핵심 규칙 정리

| 상황 | 어디에 코드 작성 |
|------|-----------------|
| 새 API 엔드포인트 연결 | `src/api/*.ts` 에 함수 추가 |
| 화면 로드 시 데이터 자동 조회 (GET) | `src/hooks/use*.ts` 에 훅 작성 후 Page에서 호출 |
| 버튼 클릭 등 이벤트로 API 호출 (POST/PATCH/DELETE) | Page 컴포넌트 안 핸들러 함수에서 직접 호출 |
| 새 DTO/응답 타입 | `src/types/index.ts` 에 추가 |
| 새 URL 경로 | `src/App.tsx` 에 `<Route>` 추가 |
| 스타일 | 페이지/컴포넌트와 같은 경로에 `*.module.css` 생성 |
