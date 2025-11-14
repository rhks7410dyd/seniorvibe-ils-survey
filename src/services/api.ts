import axios, { AxiosInstance } from 'axios';
import {
  Question,
  SurveySubmitRequest,
  ApiResponse,
  QuestionsResponse,
  SubmitResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 요청 ID 추가
    config.headers['X-Request-ID'] = crypto.randomUUID();
    config.headers['X-Client-Version'] = '1.0.0';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 서버 응답이 있는 경우
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // 요청이 전송되었지만 응답이 없는 경우
      console.error('Network Error:', error.message);
    } else {
      // 요청 설정 중 오류가 발생한 경우
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const surveyAPI = {
  // 질문 목록 가져오기
  getQuestions: async (params?: {
    category?: string;
    lang?: string;
  }): Promise<Question[]> => {
    try {
      const response = await apiClient.get<ApiResponse<QuestionsResponse>>(
        '/survey/questions',
        { params }
      );
      return response.data.data?.questions || [];
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      // 개발 중 목 데이터 반환
      return getMockQuestions();
    }
  },

  // 설문 제출
  submitSurvey: async (data: SurveySubmitRequest): Promise<SubmitResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<SubmitResponse>>(
        '/survey/submit',
        data
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error?.message || 'Submit failed');
    } catch (error) {
      console.error('Failed to submit survey:', error);
      throw error;
    }
  },

  // 참가자 등록
  registerParticipant: async (data: {
    email: string;
    name: string;
    ageGroup: string;
    gender: string;
    surveyResultId?: string;
    eventCode?: string;
    marketingConsent?: boolean;
  }): Promise<any> => {
    try {
      const response = await apiClient.post<ApiResponse>(
        '/user/register-participant',
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to register participant:', error);
      throw error;
    }
  }
};

// 개발용 목 데이터
function getMockQuestions(): Question[] {
  return [
    {
      id: 'q_001',
      type: 'single_choice',
      category: 'health',
      title: '현재 귀하의 건강 상태는 어떻습니까?',
      options: [
        { id: 'opt_001_1', text: '매우 건강함', value: 5 },
        { id: 'opt_001_2', text: '건강함', value: 4 },
        { id: 'opt_001_3', text: '보통', value: 3 },
        { id: 'opt_001_4', text: '건강하지 않음', value: 2 },
        { id: 'opt_001_5', text: '매우 건강하지 않음', value: 1 }
      ],
      required: true,
      order: 1
    },
    {
      id: 'q_002',
      type: 'scale',
      category: 'technology',
      title: '스마트폰 사용에 얼마나 익숙하십니까?',
      description: '1점(전혀 익숙하지 않음)부터 5점(매우 익숙함)까지 선택해주세요',
      required: true,
      order: 2,
      minValue: 1,
      maxValue: 5
    },
    {
      id: 'q_003',
      type: 'multiple_choice',
      category: 'lifestyle',
      title: '평소 관심 있는 활동을 모두 선택해주세요',
      options: [
        { id: 'opt_003_1', text: '운동/체육', value: 'exercise' },
        { id: 'opt_003_2', text: '독서', value: 'reading' },
        { id: 'opt_003_3', text: '여행', value: 'travel' },
        { id: 'opt_003_4', text: '음악/공연', value: 'music' },
        { id: 'opt_003_5', text: '요리', value: 'cooking' }
      ],
      required: true,
      order: 3
    },
    {
      id: 'q_004',
      type: 'text',
      category: 'general',
      title: '박람회에서 가장 기대하시는 것은 무엇인가요?',
      required: false,
      order: 4
    },
    {
      id: 'q_005',
      type: 'rating',
      category: 'general',
      title: '이 설문조사의 편의성을 평가해주세요',
      description: '1점(매우 불편함)부터 5점(매우 편리함)까지 평가해주세요',
      required: true,
      order: 5,
      minValue: 1,
      maxValue: 5
    }
  ];
}

export default apiClient;
