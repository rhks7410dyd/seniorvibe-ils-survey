# SeniorVibe ILS Survey

박람회 참가자를 위한 인터랙티브 설문조사 웹 애플리케이션입니다.

## 주요 특징

- **다국어 지원**: 한국어, 영어, 일본어 지원 (i18next)
- **Mock/Server 모드**: 개발용 Mock 데이터와 실제 서버 API 전환 가능
- **주황색 디자인**: 따뜻한 느낌의 주황색 기반 UI/UX
- **회원가입 불필요**: OAuth2 인증 없이 퍼블릭 접근 가능
- **자동 저장**: 브라우저 LocalStorage를 활용한 진행상황 자동 저장
- **반응형 디자인**: 모바일, 태블릿, 데스크탑 모든 환경 지원
- **간편한 배포**: GitHub Pages를 통한 정적 호스팅

## 기술 스택

### Frontend
- React 18 + TypeScript
- React Hook Form
- React Query (TanStack Query)
- Zustand
- Tailwind CSS (주황색 기반 커스텀 테마)
- React Router v6
- i18next (다국어 지원)
- Vite

## 시작하기

### 사전 요구사항
- Node.js 18.0.0 이상
- npm 9.0.0 이상

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 필요한 환경변수 설정

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 배포

```bash
# GitHub Pages에 배포
npm run deploy
```

## 프로젝트 구조

```
seniorvibe-ils-survey/
├── public/              # 정적 파일
├── src/
│   ├── components/      # 재사용 가능한 컴포넌트
│   ├── pages/          # 페이지 컴포넌트
│   ├── hooks/          # 커스텀 훅
│   ├── store/          # Zustand 스토어
│   ├── services/       # API 및 외부 서비스
│   ├── types/          # TypeScript 타입 정의
│   ├── utils/          # 유틸리티 함수
│   ├── styles/         # 전역 스타일
│   ├── App.tsx
│   └── main.tsx
├── .github/
│   └── workflows/      # GitHub Actions 워크플로우
└── README.md
```

## 환경변수

```env
# API 설정
VITE_API_BASE_URL=http://localhost:8080/api/v1
# Mock 데이터 사용 여부 (true: Mock 모드, false: 서버 모드)
VITE_USE_MOCK_DATA=true

# 앱 설정
VITE_APP_TITLE=SeniorVibe ILS Survey
VITE_APP_VERSION=0.1.0
```

### Mock 모드 vs 서버 모드

- **Mock 모드** (`VITE_USE_MOCK_DATA=true`): 로컬 개발 시 실제 서버 없이 Mock 데이터로 테스트 가능
- **서버 모드** (`VITE_USE_MOCK_DATA=false`): 실제 백엔드 API 서버와 연동

## 다국어 지원

애플리케이션은 다음 언어를 지원합니다:
- 한국어 (ko)
- 영어 (en)
- 일본어 (ja)

사용자는 UI 우측 상단의 언어 전환 버튼으로 언어를 변경할 수 있습니다.

## 디자인 시스템

프로젝트는 따뜻한 느낌의 주황색 기반 디자인 시스템을 사용합니다:
- **Primary Color**: Orange (#f97316)
- **Secondary Color**: Amber (#d97706)
- **Accent Color**: Blue (#3b82f6)

`tailwind.config.js`에서 커스텀 색상 팔레트를 확인할 수 있습니다.

## 라이센스

This project is licensed under the MIT License.

## 문의

- 기술 지원: tech-support@seniorvibe.com
- 이슈 트래커: https://github.com/yourusername/seniorvibe-ils-survey/issues


