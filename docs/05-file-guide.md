# 05. 파일별 상세 가이드

## `src/types/index.ts` - 타입 정의

백엔드의 도메인 모델(Entity/DTO)을 TypeScript 타입으로 매핑한 파일입니다.

```ts
// 백엔드 Branch 엔티티에 대응
export interface Branch {
  id: number;
  status: CommonStatus;  // 'ACTIVE' | 'INACTIVE'
  name: string;
  bizNumber: string;
  contactNumber: string;
  address: string;
  detailAddress: string;
}
```

**새로운 API 응답 타입을 추가할 때:**
1. 백엔드의 응답 DTO를 확인
2. `src/types/index.ts`에 인터페이스 추가
3. API 함수에서 제네릭 타입으로 사용: `apiClient.get<NewType>('/api/...')`

---

## `src/api/client.ts` - Axios 인스턴스

모든 API 요청의 기반입니다. **여기만 수정하면 전체 API 요청에 적용됩니다.**

수정이 필요한 경우:
- 기본 헤더 추가/변경
- 토큰 저장 방식 변경 (localStorage → cookie 등)
- 에러 공통 처리 로직 변경

---

## `src/context/AuthContext.tsx` - 로그인 상태 관리

앱 전체에서 로그인 상태를 공유합니다.

```ts
// 어떤 컴포넌트에서든 로그인 정보 접근
const { member, isLoggedIn, logout } = useAuth();
```

**백엔드 로그인 API 연동 시 수정 위치:**
`src/pages/LoginPage.tsx`의 `handleSubmit` 함수

```ts
const res = await apiClient.post('/api/auth/login', { nickname, password });
const { token, member } = res.data; // 백엔드 응답 형식에 맞게 수정
login(token, member);
```

---

## `src/components/layout/Header.tsx` - 상단 네비게이션

- 로그인 상태에 따라 메뉴가 달라짐
- `useAuth()`로 로그인 여부 확인
- `Link` 컴포넌트로 페이지 이동 (새로고침 없이 SPA 방식)

---

## `src/components/member/SeatMap.tsx` - 좌석 배치도

좌석을 격자(grid)로 보여주는 컴포넌트입니다.

```tsx
<SeatMap
  seats={seats}                   // 좌석 배열
  selectedSeatId={selectedSeat?.id} // 현재 선택된 좌석 ID
  onSelectSeat={setSelectedSeat}   // 좌석 클릭 시 콜백
/>
```

현재는 단순 격자 형태입니다. 실제 배치도를 구현하려면:
- 백엔드에서 좌석의 x, y 좌표를 제공
- CSS `position: absolute` + `left/top` 으로 절대 위치 배치

---

## `src/utils/format.ts` - 포맷 유틸리티

날짜, 금액, 상태값 등을 화면에 표시하기 좋은 형식으로 변환합니다.

```ts
formatDateTime('2024-03-15T14:30:00+09:00') // → "2024. 3. 15. 오후 2:30"
formatMinutes(90)                            // → "1시간 30분"
formatPrice(10000)                           // → "10,000원"
formatSeatType('FREE')                       // → "자유석"
formatStatus('IN_USE')                       // → "이용중"
```

---

## `.env` - 환경 변수

```properties
VITE_API_BASE_URL=http://localhost:8080
```

- `VITE_` 접두사가 없으면 프론트엔드 코드에서 읽을 수 없음
- `.env` 파일은 git에 커밋해도 되지만, 민감한 키는 `.env.local`에 작성 (git 무시됨)

---

## `package.json` - 의존성 및 스크립트

백엔드의 `build.gradle.kts`와 같은 역할입니다.

```json
{
  "dependencies": {
    "react": "^19.0.0",           // UI 라이브러리
    "react-dom": "^19.0.0",       // 브라우저에 React 렌더링
    "react-router-dom": "^7.x",   // 페이지 라우팅
    "axios": "^1.x"               // HTTP 클라이언트
  },
  "devDependencies": {
    "typescript": "~5.x",         // TypeScript 컴파일러
    "vite": "^6.x",               // 빌드 도구
    "@types/react": "^19.x"       // React TypeScript 타입 정의
  }
}
```

새 패키지 설치: `npm install 패키지명`

---

## `vite.config.ts` - 빌드 설정

개발 서버 프록시 설정이 유용합니다:

```ts
// vite.config.ts에 추가하면 CORS 없이 API 호출 가능
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```

이 설정을 추가하면 `http://localhost:5173/api/...` 요청이
자동으로 `http://localhost:8080/api/...`로 전달됩니다.
백엔드에 CORS 설정 없이도 개발할 수 있습니다.
