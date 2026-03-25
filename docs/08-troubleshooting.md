# 08. 자주 발생하는 문제 & 해결 방법

## CORS 에러

**증상:** 브라우저 콘솔에 아래 에러
```
Access to XMLHttpRequest at 'http://localhost:8080/api/...' from origin
'http://localhost:5173' has been blocked by CORS policy
```

**해결 방법 1 (권장): Vite 프록시 설정**

`vite.config.ts`를 수정합니다:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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

그리고 `.env`를 수정합니다:
```properties
# 프록시 사용 시 빈 문자열로 설정 (상대 경로 사용)
VITE_API_BASE_URL=
```

**해결 방법 2: 백엔드 CORS 설정**

Spring Boot에 추가:
```kotlin
@Configuration
class WebConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowCredentials(true)
    }
}
```

---

## 백엔드 연결 불가 (Network Error)

**증상:** `Network Error` 또는 `ERR_CONNECTION_REFUSED`

**체크리스트:**
1. Spring Boot가 실행 중인지 확인
2. 포트 번호가 맞는지 확인 (기본: 8080)
3. `.env`의 `VITE_API_BASE_URL` 확인
4. 방화벽 설정 확인

---

## 화면이 업데이트 안 될 때

**원인:** `state`를 직접 수정하면 React가 변경을 감지하지 못함

```ts
// 잘못된 방법 - 직접 수정
branches.push(newBranch);  // React가 모름

// 올바른 방법 - 새 배열로 교체
setBranches([...branches, newBranch]);  // React가 변경 감지
```

---

## `useEffect` 무한 루프

**증상:** API가 계속 반복 호출됨

**원인:** 의존성 배열 잘못 설정

```tsx
// 잘못된 예 - 매 렌더링마다 실행
useEffect(() => {
  fetchData();
}); // 의존성 배열 없음!

// 올바른 예 - 최초 한 번만
useEffect(() => {
  fetchData();
}, []); // 빈 배열

// 올바른 예 - branchId 바뀔 때만
useEffect(() => {
  fetchBranchData(branchId);
}, [branchId]);
```

---

## TypeScript 타입 오류

**`Type 'string | undefined' is not assignable to type 'number'`**

URL 파라미터는 항상 `string | undefined`입니다:
```tsx
const { branchId } = useParams<{ branchId: string }>();
// branchId의 타입: string | undefined

// 해결: 타입 가드 + Number 변환
if (!branchId) return;
const id = Number(branchId);
```

---

## 페이지 이동 시 스크롤이 유지될 때

`App.tsx`에 ScrollRestoration 추가:
```tsx
import { ScrollRestoration } from 'react-router-dom';

// BrowserRouter 안에 추가
<ScrollRestoration />
```

---

## npm install 에러

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

---

## 개발 서버 포트 충돌

```bash
# 다른 포트로 실행
npm run dev -- --port 3000
```

또는 `vite.config.ts`에 고정:
```ts
server: {
  port: 3000,
}
```

---

## API 응답은 오는데 화면에 안 보일 때

브라우저 개발자 도구 (F12) 활용:
1. **Network 탭**: API 요청/응답 확인
2. **Console 탭**: JavaScript 에러 확인
3. **React DevTools 확장** 설치하면 컴포넌트 state/props 실시간 확인 가능

```tsx
// 디버깅 시 console.log 적극 활용
useEffect(() => {
  getBranches().then((res) => {
    console.log('API 응답:', res.data);  // 여기서 확인
    setBranches(res.data);
  });
}, []);
```
