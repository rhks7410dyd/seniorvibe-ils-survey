# SeniorVibe ILS Survey

박람회 참가자를 위한 인터랙티브 설문조사 웹 애플리케이션입니다.

## 주요 특징

- 회원가입 불필요: OAuth2 인증 없이 퍼블릭 접근 가능
- 자동 저장: 브라우저 LocalStorage를 활용한 진행상황 자동 저장
- 반응형 디자인: 모바일, 태블릿, 데스크탑 모든 환경 지원
- 간편한 배포: GitHub Pages를 통한 정적 호스팅

## 기술 스택

### Frontend
- React 18 + TypeScript
- React Hook Form
- React Query (TanStack Query)
- Zustand
- Tailwind CSS
- React Router v6
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
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_TITLE=SeniorVibe ILS Survey
VITE_APP_VERSION=0.1.0
```

## 라이센스

This project is licensed under the MIT License.

## 문의

- 기술 지원: tech-support@seniorvibe.com
- 이슈 트래커: https://github.com/yourusername/seniorvibe-ils-survey/issues


local로 실행했을 때, mock 데이터를 사용하는 방식과 서버에 연동되는 방식 두 가지를 구분해서 실행할 수 있도록 추가 구현해주고, 내용은 일본어와 영어까지 다국어로 반영되어야 하기 때문에 i18을 사용해서 다국어 대응을 구현해줘. 마지막으로 우리 회사의 기본 컬러가 따뜻한 느낌의         
주황색이기 때문에 [Image #1]의 내용을 고려해서 디자인을 주황색 위주의 감성으로 바꿔줘. 