import { useState, useEffect } from 'react';
import axios from 'axios';
import { Question } from '../types/survey.types';
import { getOXQuestionsUrl } from '../utils/urlMapping';
import { getMockQuestions } from '../services/mockData';

interface UseOXQuestionsOptions {
  category?: string;
  lang?: string;
  autoFetch?: boolean;
  useMock?: boolean;
}

interface UseOXQuestionsReturn {
  questions: Question[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const useOXQuestions = (options: UseOXQuestionsOptions = {}): UseOXQuestionsReturn => {
  const { category, lang = 'ko', autoFetch = true, useMock = USE_MOCK_DATA } = options;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOXQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      let allQuestions: Question[];

      if (useMock) {
        console.log('[MOCK MODE] Using mock O/X questions data');
        await new Promise(resolve => setTimeout(resolve, 300));
        allQuestions = getMockQuestions(lang);
      } else {
        console.log('[SERVER MODE] Fetching O/X questions from webhook URL');
        const webhookUrl = getOXQuestionsUrl();
        const response = await axios.get(webhookUrl, {
          params: { category, lang },
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Version': '1.0.0',
            'X-Request-ID': crypto.randomUUID()
          }
        });

        if (response.data?.questions) {
          allQuestions = response.data.questions;
        } else if (Array.isArray(response.data)) {
          allQuestions = response.data;
        } else {
          throw new Error('Invalid response format');
        }
      }

      // O/X 질문만 필터링 (yes_no 타입)
      const oxQuestions = allQuestions.filter(q => q.type === 'yes_no');

      setQuestions(oxQuestions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch O/X questions';
      setError(errorMessage);
      console.error('Error fetching O/X questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchOXQuestions();
    }
  }, [category, lang, autoFetch, useMock]);

  return {
    questions,
    loading,
    error,
    refetch: fetchOXQuestions
  };
};