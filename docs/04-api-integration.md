# 04. 백엔드 API 연동

## API 클라이언트 설정 (`src/api/client.ts`)

모든 API 요청의 공통 설정을 여기서 관리합니다.
Spring Boot의 `RestTemplate Bean 설정`과 같은 역할입니다.

```ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env에서 읽음
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});
```

### 인터셉터 (Interceptor)

Spring의 `HandlerInterceptor`와 동일한 개념입니다.

```ts
// 요청 인터셉터: 모든 요청에 JWT 토큰 자동 첨부
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 에러 시 로그인 페이지로 자동 이동
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## API 함수 작성 방법 (`src/api/*.ts`)

각 도메인별로 파일을 분리합니다. 백엔드의 Service 레이어와 대응됩니다.

```ts
// src/api/branchApi.ts

// GET /api/branches  →  지점 목록 조회
export const getBranches = () =>
  apiClient.get<Branch[]>('/api/branches');

// GET /api/branches/1  →  지점 단건 조회
export const getBranch = (branchId: number) =>
  apiClient.get<Branch>(`/api/branches/${branchId}`);

// POST /api/reservations  →  좌석 예약
export const reserveSeat = (data: { branchId: number; branchSeatId: number; memberBranchPassId: number }) =>
  apiClient.post<BranchSeatReservation>('/api/reservations', data);

// PATCH /api/reservations/1/cancel  →  예약 취소
export const cancelReservation = (reservationId: number) =>
  apiClient.patch(`/api/reservations/${reservationId}/cancel`);
```

---

## 컴포넌트에서 API 호출하기

```tsx
function BranchDetailPage() {
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBranch(1)
      .then((res) => setBranch(res.data))    // 성공 시
      .catch(() => setError('실패했습니다.'))  // 에러 시
      .finally(() => setLoading(false));      // 항상 실행 (로딩 종료)
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!branch) return null;

  return <h1>{branch.name}</h1>;
}
```

---

## 백엔드 API 응답 형식에 맞추기

백엔드가 아래처럼 응답 래퍼를 사용한다면:

```json
{
  "success": true,
  "data": { "id": 1, "name": "강남점" },
  "message": null
}
```

API 함수에서 `.data.data`로 접근하거나, 인터셉터에서 한 번 처리합니다:

```ts
// 방법 1: 호출 시 data.data로 접근
getBranch(1).then((res) => setBranch(res.data.data));

// 방법 2: 인터셉터에서 자동 변환 (권장)
apiClient.interceptors.response.use((response) => {
  if (response.data.data !== undefined) {
    response.data = response.data.data;
  }
  return response;
});
```

> 현재 프로젝트의 API 함수는 백엔드 응답 구조에 맞게 수정이 필요할 수 있습니다.
> 백엔드 실제 응답 스펙에 따라 `src/api/*.ts` 파일을 조정하세요.

---

## 환경별 API 주소 관리

```bash
# .env (개발)
VITE_API_BASE_URL=http://localhost:8080

# .env.production (프로덕션 배포 시)
VITE_API_BASE_URL=https://api.studycafe.com
```

빌드 시 자동으로 해당 환경의 변수가 적용됩니다.

---

## API 파일 목록

| 파일 | 담당 도메인 |
|------|------------|
| `src/api/client.ts` | Axios 인스턴스 및 인터셉터 |
| `src/api/branchApi.ts` | 지점, 좌석, 영업시간 |
| `src/api/reservationApi.ts` | 예약, 입장, 퇴장, 연장, 이동 |
| `src/api/passApi.ts` | 이용권 상품, 회원 보유 이용권 |
