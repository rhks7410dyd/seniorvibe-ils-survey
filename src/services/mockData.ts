import { Question, SurveySubmitRequest, SubmitResponse } from '../types';

// Mock 질문 데이터 (다국어 지원)
export const getMockQuestions = (lang: string = 'ko'): Question[] => {
  const questions: Record<string, Question[]> = {
    ko: [
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
        type: 'yes_no',
        category: 'technology',
        title: '스마트 기기를 사용하여 건강 관리를 하고 계신가요?',
        description: 'O 또는 X를 선택해주세요',
        required: true,
        order: 5
      },
      {
        id: 'q_006',
        type: 'yes_no',
        category: 'general',
        title: '박람회 정보를 정기적으로 받아보시겠습니까?',
        required: true,
        order: 6
      },
      {
        id: 'q_007',
        type: 'rating',
        category: 'general',
        title: '이 설문조사의 편의성을 평가해주세요',
        description: '1점(매우 불편함)부터 5점(매우 편리함)까지 평가해주세요',
        required: true,
        order: 7,
        minValue: 1,
        maxValue: 5
      }
    ],
    en: [
      {
        id: 'q_001',
        type: 'single_choice',
        category: 'health',
        title: 'How would you rate your current health condition?',
        options: [
          { id: 'opt_001_1', text: 'Very Healthy', value: 5 },
          { id: 'opt_001_2', text: 'Healthy', value: 4 },
          { id: 'opt_001_3', text: 'Average', value: 3 },
          { id: 'opt_001_4', text: 'Unhealthy', value: 2 },
          { id: 'opt_001_5', text: 'Very Unhealthy', value: 1 }
        ],
        required: true,
        order: 1
      },
      {
        id: 'q_002',
        type: 'scale',
        category: 'technology',
        title: 'How familiar are you with using smartphones?',
        description: 'Please select from 1 (Not familiar at all) to 5 (Very familiar)',
        required: true,
        order: 2,
        minValue: 1,
        maxValue: 5
      },
      {
        id: 'q_003',
        type: 'multiple_choice',
        category: 'lifestyle',
        title: 'Please select all activities you are interested in',
        options: [
          { id: 'opt_003_1', text: 'Exercise/Sports', value: 'exercise' },
          { id: 'opt_003_2', text: 'Reading', value: 'reading' },
          { id: 'opt_003_3', text: 'Travel', value: 'travel' },
          { id: 'opt_003_4', text: 'Music/Concerts', value: 'music' },
          { id: 'opt_003_5', text: 'Cooking', value: 'cooking' }
        ],
        required: true,
        order: 3
      },
      {
        id: 'q_004',
        type: 'text',
        category: 'general',
        title: 'What are you most looking forward to at the exhibition?',
        required: false,
        order: 4
      },
      {
        id: 'q_005',
        type: 'yes_no',
        category: 'technology',
        title: 'Do you use smart devices for health management?',
        description: 'Please select Yes or No',
        required: true,
        order: 5
      },
      {
        id: 'q_006',
        type: 'yes_no',
        category: 'general',
        title: 'Would you like to receive regular exhibition updates?',
        required: true,
        order: 6
      },
      {
        id: 'q_007',
        type: 'rating',
        category: 'general',
        title: 'Please rate the convenience of this survey',
        description: 'Please rate from 1 (Very inconvenient) to 5 (Very convenient)',
        required: true,
        order: 7,
        minValue: 1,
        maxValue: 5
      }
    ],
    ja: [
      {
        id: 'q_001',
        type: 'single_choice',
        category: 'health',
        title: '現在のあなたの健康状態はいかがですか？',
        options: [
          { id: 'opt_001_1', text: '非常に健康', value: 5 },
          { id: 'opt_001_2', text: '健康', value: 4 },
          { id: 'opt_001_3', text: '普通', value: 3 },
          { id: 'opt_001_4', text: '健康でない', value: 2 },
          { id: 'opt_001_5', text: '非常に健康でない', value: 1 }
        ],
        required: true,
        order: 1
      },
      {
        id: 'q_002',
        type: 'scale',
        category: 'technology',
        title: 'スマートフォンの使用にどのくらい慣れていますか？',
        description: '1点（全く慣れていない）から5点（非常に慣れている）まで選択してください',
        required: true,
        order: 2,
        minValue: 1,
        maxValue: 5
      },
      {
        id: 'q_003',
        type: 'multiple_choice',
        category: 'lifestyle',
        title: '普段興味のある活動をすべて選択してください',
        options: [
          { id: 'opt_003_1', text: '運動/スポーツ', value: 'exercise' },
          { id: 'opt_003_2', text: '読書', value: 'reading' },
          { id: 'opt_003_3', text: '旅行', value: 'travel' },
          { id: 'opt_003_4', text: '音楽/コンサート', value: 'music' },
          { id: 'opt_003_5', text: '料理', value: 'cooking' }
        ],
        required: true,
        order: 3
      },
      {
        id: 'q_004',
        type: 'text',
        category: 'general',
        title: '展示会で最も期待していることは何ですか？',
        required: false,
        order: 4
      },
      {
        id: 'q_005',
        type: 'yes_no',
        category: 'technology',
        title: 'スマートデバイスを使用して健康管理をしていますか？',
        description: 'OまたはXを選択してください',
        required: true,
        order: 5
      },
      {
        id: 'q_006',
        type: 'yes_no',
        category: 'general',
        title: '展示会情報を定期的に受け取りますか？',
        required: true,
        order: 6
      },
      {
        id: 'q_007',
        type: 'rating',
        category: 'general',
        title: 'このアンケートの便利さを評価してください',
        description: '1点（非常に不便）から5点（非常に便利）まで評価してください',
        required: true,
        order: 7,
        minValue: 1,
        maxValue: 5
      }
    ]
  };

  return questions[lang] || questions['ko'];
};

// Mock 설문 제출 응답
export const mockSubmitSurvey = async (
  _data: SurveySubmitRequest
): Promise<SubmitResponse> => {
  // 실제 API 호출을 시뮬레이션하기 위해 약간의 지연 추가
  await new Promise(resolve => setTimeout(resolve, 500));

  // 6자리 PIN 번호 생성
  const pinNumber = Math.floor(100000 + Math.random() * 900000).toString();

  return {
    resultId: `mock_${crypto.randomUUID()}`,
    participantId: `participant_${crypto.randomUUID()}`,
    message: 'Survey submitted successfully',
    pinNumber
  };
};

// Mock 참가자 등록 응답
export const mockRegisterParticipant = async (data: {
  email: string;
  name: string;
  ageGroup: string;
  gender: string;
  surveyResultId?: string;
  eventCode?: string;
  marketingConsent?: boolean;
  PinNumber?: string;
}): Promise<any> => {
  // 실제 API 호출을 시뮬레이션하기 위해 약간의 지연 추가
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    success: true,
    data: {
      participantId: `mock_participant_${crypto.randomUUID()}`,
      email: data.email,
      name: data.name,
      registeredAt: new Date().toISOString(),
      PinNumber: data.PinNumber || null
    }
  };
};
