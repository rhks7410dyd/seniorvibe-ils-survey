# O/X 설문 훅 구현 가이드

## 개요

O/X(Yes/No) 설문 리스트를 받아오는 React 훅을 구현했습니다. 이 훅은 환경변수 기반의 URL 매핑을 통해 웹훅으로부터 O/X 설문 데이터를 가져옵니다.

## 구현된 파일들

### 1. 환경변수 설정

#### `.env.example`
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_ROOT_URL=http://localhost:3000
VITE_USE_MOCK_DATA=true

# App Configuration
VITE_APP_TITLE=SeniorVibe ILS Survey
VITE_APP_VERSION=0.1.0
```

#### `.env.production`
```env
# Production Environment Configuration
VITE_USE_MOCK_DATA=true
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_ROOT_URL=https://your-production-domain.com

# App Configuration
VITE_APP_TITLE=SeniorVibe ILS Survey
VITE_APP_VERSION=0.1.0
```

### 2. URL 매핑 유틸리티

#### `src/utils/urlMapping.ts`
ROOT_URL 기반으로 API 엔드포인트를 매핑하는 유틸리티:

```typescript
const ROOT_URL = import.meta.env.VITE_ROOT_URL || 'http://localhost:3000';

interface URLMappingConfig {
  oxQuestions: string;
}

export const urlMapping: URLMappingConfig = {
  oxQuestions: `${ROOT_URL}/api/survey/ox-questions`
};

export const getOXQuestionsUrl = (): string => {
  return urlMapping.oxQuestions;
};

export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = ROOT_URL.endsWith('/') ? ROOT_URL.slice(0, -1) : ROOT_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};
```

### 3. O/X 설문 훅

#### `src/hooks/useOXQuestions.ts`
메인 훅 구현:

```typescript
interface UseOXQuestionsOptions {
  lang?: string;           // 언어 설정 (기본: 'ko')
  autoFetch?: boolean;     // 자동 데이터 가져오기 (기본: true)
  useMock?: boolean;       // 목 데이터 사용 여부
}

interface UseOXQuestionsReturn {
  questions: Question[];   // O/X 질문 리스트
  loading: boolean;        // 로딩 상태
  error: string | null;    // 에러 메시지
  refetch: () => Promise<void>; // 수동 재요청 함수
}
```

#### `src/hooks/index.ts`
훅 내보내기:

```typescript
export { useOXQuestions } from './useOXQuestions';
```

## 사용 방법

### 기본 사용법

```typescript
import { useOXQuestions } from '@/hooks/useOXQuestions';

function OXSurveyComponent() {
  const { questions, loading, error, refetch } = useOXQuestions();

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      {questions.map(question => (
        <div key={question.id}>
          <h3>{question.title}</h3>
          <p>{question.description}</p>
          {/* O/X 답변 UI */}
        </div>
      ))}
    </div>
  );
}
```

### 고급 사용법

```typescript
// 특정 언어로 O/X 질문 가져오기
const { questions } = useOXQuestions({
  lang: 'ko'
});

// 수동으로 데이터 가져오기
const { questions, loading, refetch } = useOXQuestions({
  autoFetch: false
});

// 버튼 클릭 시 데이터 가져오기
const handleLoadQuestions = () => {
  refetch();
};

// 목 데이터 강제 사용
const { questions } = useOXQuestions({
  useMock: true
});
```

## API 엔드포인트

### 웹훅 URL 구조
- **기본 URL**: `${VITE_ROOT_URL}/api/survey/ox-questions`
- **로컬 개발**: `http://localhost:3000/api/survey/ox-questions`
- **프로덕션**: `https://your-production-domain.com/api/survey/ox-questions`

### 요청 파라미터
- `lang` (선택): 언어 코드 (기본값: 'ko')

### 요청 헤더
```json
{
  "Content-Type": "application/json",
  "X-Client-Version": "1.0.0",
  "X-Request-ID": "uuid-v4-string"
}
```

### 응답 형식

#### 성공 응답 (옵션 1)
```json
{
  "questions": [
    {
      "id": "q1",
      "type": "yes_no",
      "title": "하루에 8시간 이상 잠을 자시나요?",
      "description": "충분한 수면은 건강에 중요합니다.",
      "required": true,
      "order": 1
    }
  ]
}
```

#### 성공 응답 (옵션 2)
```json
[
  {
    "id": "q1",
    "type": "yes_no",
    "title": "하루에 8시간 이상 잠을 자시나요?",
    "description": "충분한 수면은 건강에 중요합니다.",
    "required": true,
    "order": 1
  }
]
```

## 동작 모드

### Mock 모드
- `VITE_USE_MOCK_DATA=true`인 경우
- `src/services/mockData.ts`의 데이터 사용
- 네트워크 지연 시뮬레이션 (300ms)

### Server 모드
- `VITE_USE_MOCK_DATA=false`인 경우
- 실제 웹훅 URL로 HTTP 요청
- 타임아웃: 10초

## 에러 처리

### 에러 종류
1. **네트워크 에러**: 서버 연결 실패
2. **타임아웃 에러**: 10초 초과 시
3. **응답 형식 에러**: 예상과 다른 응답 구조
4. **필터링 에러**: O/X 질문이 없는 경우

### 에러 처리 방법
```typescript
const { questions, error, refetch } = useOXQuestions();

if (error) {
  console.error('O/X 질문 로딩 실패:', error);
  // 재시도 버튼 제공
  return <button onClick={refetch}>다시 시도</button>;
}
```

## 데이터 필터링

### 자동 필터링
- 모든 질문 중 `type === 'yes_no'`인 질문만 자동 필터링
- 다른 타입의 질문들은 제외됨

### 질문 타입
기존 시스템에서 지원하는 질문 타입:
- `single_choice`: 단일 선택
- `multiple_choice`: 다중 선택
- `text`: 텍스트 입력
- `rating`: 평점
- `scale`: 척도
- `yes_no`: O/X (이 훅에서 사용)

## 설정 및 배포

### 개발 환경 설정
1. `.env.local` 파일 생성:
```env
VITE_ROOT_URL=http://localhost:3000
VITE_USE_MOCK_DATA=true
```

### 프로덕션 배포
1. `.env.production`에서 `VITE_ROOT_URL` 수정:
```env
VITE_ROOT_URL=https://your-actual-domain.com
```

2. 웹훅 서버 설정:
   - `https://your-actual-domain.com/api/survey/ox-questions` 엔드포인트 구현
   - O/X 타입 질문들 반환하도록 설정

## 확장 가능성

### 추가 기능 고려사항
1. **캐싱**: React Query 또는 SWR 도입
2. **재시도 로직**: 실패 시 자동 재시도
3. **오프라인 지원**: 로컬 스토리지 활용
4. **실시간 업데이트**: WebSocket 연동
5. **다국어 지원**: i18n 통합

### URL 매핑 확장
```typescript
// urlMapping.ts 확장 예시
export const urlMapping: URLMappingConfig = {
  oxQuestions: `${ROOT_URL}/api/survey/ox-questions`,
  scaleQuestions: `${ROOT_URL}/api/survey/scale-questions`,
  textQuestions: `${ROOT_URL}/api/survey/text-questions`
};
```

## 문제 해결

### 일반적인 문제
1. **CORS 에러**: 웹훅 서버에서 CORS 헤더 설정 필요
2. **타임아웃**: 서버 응답 시간 확인
3. **빈 결과**: 실제 O/X 질문이 있는지 확인
4. **환경변수 미적용**: 애플리케이션 재시작 필요

### 디버깅 방법
```typescript
// 개발자 도구 콘솔에서 확인
console.log('웹훅 URL:', getOXQuestionsUrl());
console.log('Mock 모드:', import.meta.env.VITE_USE_MOCK_DATA);
```