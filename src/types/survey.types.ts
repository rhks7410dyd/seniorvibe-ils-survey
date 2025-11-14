// 질문 타입
export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'text'
  | 'rating'
  | 'scale';

// 질문 카테고리
export type QuestionCategory =
  | 'health'
  | 'lifestyle'
  | 'technology'
  | 'social'
  | 'general';

// 질문 옵션
export interface QuestionOption {
  id: string;
  text: string;
  value: number | string;
}

// 질문
export interface Question {
  id: string;
  type: QuestionType;
  category: QuestionCategory;
  title: string;
  description?: string;
  options?: QuestionOption[];
  required: boolean;
  order: number;
  minValue?: number;
  maxValue?: number;
}

// 인적정보
export interface PersonalInfo {
  email: string;
  name: string;
  ageGroup: string;
  gender: string;
  phone?: string;
  savedAt?: string;
}

// 답변
export interface Answer {
  questionId: string;
  value: any;
  answeredAt: string;
}

// 설문 진행 상태
export interface SurveyProgress {
  currentQuestionIndex: number;
  answers: Record<string, Answer>;
  startedAt: string;
  lastUpdatedAt: string;
}

// LocalStorage 데이터 구조
export interface LocalStorageData {
  sessionId: string;
  personalInfo: PersonalInfo | null;
  surveyProgress: SurveyProgress;
}

// API 요청/응답 타입
export interface SurveySubmitRequest {
  sessionId: string;
  personalInfo: PersonalInfo;
  answers: Answer[];
  completedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  message?: string;
  timestamp: string;
}

export interface QuestionsResponse {
  questions: Question[];
  totalCount: number;
  estimatedTime: number;
}

export interface SubmitResponse {
  resultId: string;
  participantId: string;
  message: string;
}
