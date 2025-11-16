import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { PersonalInfo, Answer, Question } from '../types';

interface SurveyState {
  // 세션 정보
  sessionId: string;

  // 인적정보
  personalInfo: PersonalInfo | null;
  setPersonalInfo: (info: PersonalInfo) => void;

  // 질문 목록
  questions: Question[];
  setQuestions: (questions: Question[]) => void;

  // 답변 관리
  answers: Record<string, Answer>;
  setAnswer: (questionId: string, value: any) => void;

  // 진행 상태
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;

  // 타임스탬프
  startedAt: string | null;
  setStartedAt: (time: string) => void;

  // PIN 번호
  pinNumber: string | null;
  setPinNumber: (pin: string) => void;

  // 유틸리티
  resetSurvey: () => void;
  getProgress: () => number;
  isCompleted: () => boolean;
}

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set, get) => ({
      sessionId: uuidv4(),

      personalInfo: null,
      setPersonalInfo: (info) => set({
        personalInfo: {
          ...info,
          savedAt: new Date().toISOString()
        }
      }),

      questions: [],
      setQuestions: (questions) => set({ questions }),

      answers: {},
      setAnswer: (questionId, value) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: {
              questionId,
              value,
              answeredAt: new Date().toISOString()
            }
          }
        })),

      currentQuestionIndex: 0,
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

      startedAt: null,
      setStartedAt: (time) => set({ startedAt: time }),

      pinNumber: null,
      setPinNumber: (pin) => set({ pinNumber: pin }),

      resetSurvey: () => set({
        sessionId: uuidv4(),
        personalInfo: null,
        questions: [],
        answers: {},
        currentQuestionIndex: 0,
        startedAt: null,
        pinNumber: null
      }),

      getProgress: () => {
        const state = get();
        if (state.questions.length === 0) return 0;
        return (Object.keys(state.answers).length / state.questions.length) * 100;
      },

      isCompleted: () => {
        const state = get();
        return state.questions.length > 0 &&
               Object.keys(state.answers).length === state.questions.length;
      }
    }),
    {
      name: 'survey-storage', // LocalStorage 키 이름
      partialize: (state) => ({
        sessionId: state.sessionId,
        personalInfo: state.personalInfo,
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
        startedAt: state.startedAt,
        pinNumber: state.pinNumber
      })
    }
  )
);
