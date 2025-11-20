import axios, { AxiosInstance } from 'axios';
import {
  Question,
  SurveySubmitRequest,
  ApiResponse,
  SubmitResponse
} from '../types';
import {
  getMockQuestions,
  mockSubmitSurvey,
  mockRegisterParticipant
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

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
    // Mock 모드인 경우 즉시 mock 데이터 반환
    if (USE_MOCK_DATA) {
      console.log('[MOCK MODE] Using mock questions data');
      await new Promise(resolve => setTimeout(resolve, 300)); // 네트워크 지연 시뮬레이션
      return getMockQuestions(params?.lang || 'ko');
    }

    // Server 모드인 경우 실제 API 호출
    try {
      console.log('[SERVER MODE] Fetching questions from API');

      // 백엔드 응답 타입 정의
      interface BackendQuestion {
        id: number;
        questionText: string;
        source: string;
        subjectiveMemo: string;
        criterion: string;
      }

      interface BackendResponse {
        isSuccess: boolean;
        code: string;
        message: string;
        result: {
          questions: BackendQuestion[];
          totalCount: number;
        };
      }

      const response = await apiClient.get<BackendResponse>('/ils/questions', { params });

      if (response.data.isSuccess && response.data.result) {
        console.log('Backend response questions:', response.data.result.questions);

        // 백엔드 응답을 프런트엔드 타입으로 변환
        return response.data.result.questions.map((q, index) => {
          console.log('Question mapping:', q);
          return {
            id: q.id.toString(),
            type: 'yes_no' as const,
            category: 'health' as const,
            title: q.questionText,
            description: q.criterion,
            criterion: q.criterion,
            required: true,
            order: index + 1
          };
        });
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      throw error;
    }
  },

  // 설문 제출 (ILS 회원가입)
  submitSurvey: async (data: SurveySubmitRequest): Promise<SubmitResponse> => {
    // Mock 모드인 경우 mock 응답 반환
    if (USE_MOCK_DATA) {
      console.log('[MOCK MODE] Using mock submit response');
      return mockSubmitSurvey(data);
    }

    // Server 모드인 경우 실제 API 호출
    try {
      console.log('[SERVER MODE] Creating ILS user with survey data');

      // 프론트엔드 데이터를 백엔드 형식으로 변환
      const surveyAnswers: { [key: number]: boolean } = {};
      data.answers.forEach(answer => {
        const questionId = parseInt(answer.questionId);
        // NaN이나 유효하지 않은 숫자는 제외
        if (!isNaN(questionId) && isFinite(questionId)) {
          surveyAnswers[questionId] = answer.value;
        }
      });

      const ilsUserData = {
        email: data.personalInfo.email,
        name: data.personalInfo.name,
        gender: data.personalInfo.gender.toUpperCase(),
        ageGroup: data.personalInfo.ageGroup,
        surveyAnswers: surveyAnswers
      };

      const response = await apiClient.post<{
        isSuccess: boolean;
        code: string;
        message: string;
        result: {
          name: string;
          email: string;
          pin: string;
        };
      }>('/ils/user-create', ilsUserData);

      if (response.data.isSuccess && response.data.result) {
        // ILS 응답을 SubmitResponse 형식으로 변환
        return {
          sessionId: data.sessionId,
          pinNumber: response.data.result.pin,
          completedAt: new Date().toISOString()
        };
      }
      throw new Error(response.data.message || 'ILS user creation failed');
    } catch (error) {
      console.error('Failed to create ILS user:', error);
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
    PinNumber?: string;
  }): Promise<any> => {
    // Mock 모드인 경우 mock 응답 반환
    if (USE_MOCK_DATA) {
      console.log('[MOCK MODE] Using mock register response');
      return mockRegisterParticipant(data);
    }

    // Server 모드인 경우 실제 API 호출
    try {
      console.log('[SERVER MODE] Registering participant via API');
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

// 현재 API 모드 확인 함수
export const getAPIMode = (): 'mock' | 'server' => {
  return USE_MOCK_DATA ? 'mock' : 'server';
};

export default apiClient;
