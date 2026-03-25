# 02. 시작하기 (Getting Started)

## 사전 준비

- **Node.js 20 이상** 설치 필요
  - 확인: `node -v`
  - 설치: https://nodejs.org

---

## 1단계: 의존성 설치

```bash
cd StudyCafe-front
npm install
```

`node_modules/` 폴더가 생성됩니다.
> Java의 `gradle build` / Maven의 `mvn install`과 동일한 역할

---

## 2단계: 환경 변수 설정

`.env` 파일을 열어 백엔드 서버 주소를 확인합니다:

```properties
VITE_API_BASE_URL=http://localhost:8080
```

- 백엔드(Spring Boot)가 `8080` 포트에서 실행 중이면 그대로 사용
- 포트가 다르면 수정
- 변수명이 반드시 `VITE_` 로 시작해야 프론트엔드에서 읽을 수 있음

---

## 3단계: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 **http://localhost:5173** 접속

> - 파일을 저장하면 **자동으로 화면이 갱신**됨 (Hot Module Replacement)
> - Spring Boot의 `spring-boot-devtools`와 동일한 기능

---

## 4단계: 프로덕션 빌드 (배포용)

```bash
npm run build
```

`dist/` 폴더에 정적 파일이 생성됩니다.
이 파일들을 Nginx, S3 등에 배포하면 됩니다.

---

## 개발 서버와 백엔드 동시 실행

터미널 2개를 열어서:

**터미널 1 (백엔드):**
```bash
cd StudyCafe
./gradlew bootRun
# 또는
./gradlew bootRun --args='--spring.profiles.active=local'
```

**터미널 2 (프론트엔드):**
```bash
cd StudyCafe-front
npm run dev
```

---

## CORS 설정 안내

백엔드에서 프론트엔드 요청을 허용하려면 Spring Boot에 CORS 설정이 필요합니다.

```kotlin
// Spring Boot에 추가 필요
@Configuration
class WebConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173") // 프론트 개발 서버 주소
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
            .allowCredentials(true)
    }
}
```

---

## npm 명령어 정리

| 명령어 | 설명 |
|--------|------|
| `npm install` | 의존성 설치 |
| `npm run dev` | 개발 서버 실행 (localhost:5173) |
| `npm run build` | 프로덕션 빌드 (dist/ 폴더 생성) |
| `npm run preview` | 빌드된 파일 미리보기 |
| `npm run lint` | ESLint 코드 검사 |
