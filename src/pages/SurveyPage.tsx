import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSurveyStore } from '../store/surveyStore';
import { surveyAPI } from '../services/api';
import LanguageSwitcher from '../components/LanguageSwitcher';

function SurveyPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const {
    personalInfo,
    questions,
    setQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswer,
    getProgress,
    sessionId,
    startedAt,
    setStartedAt,
    setPinNumber
  } = useSurveyStore();

  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [isSubmittingRef, setIsSubmittingRef] = useState(false);
  const [pendingTimeoutIds, setPendingTimeoutIds] = useState<Set<number>>(new Set());

  // 인적정보가 없으면 리다이렉트
  useEffect(() => {
    if (!personalInfo) {
      navigate('/personal-info');
    }
    if (!startedAt) {
      setStartedAt(new Date().toISOString());
    }
  }, [personalInfo, navigate, startedAt, setStartedAt]);

  // 질문 목록 가져오기 (언어에 따라)
  const { data: questionsData, isLoading, error } = useQuery({
    queryKey: ['questions', i18n.language],
    queryFn: () => surveyAPI.getQuestions({ lang: i18n.language })
  });

  // 질문 데이터를 스토어에 저장
  useEffect(() => {
    if (questionsData && questionsData.length > 0) {
      setQuestions(questionsData);
    }
  }, [questionsData, setQuestions]);

  // 설문 제출 mutation
  const submitMutation = useMutation({
    mutationFn: surveyAPI.submitSurvey,
    onSuccess: (data) => {
      // PIN 번호가 있으면 저장
      if (data.pinNumber) {
        setPinNumber(data.pinNumber);
      }
      navigate('/result');
    },
    onError: (error: any) => {
      console.error('Failed to submit survey:', error);

      let errorMessage = t('errors.submitError');

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    },
    onSettled: () => {
      // 성공/실패 상관없이 플래그 초기화
      setIsSubmittingRef(false);
    }
  });

  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const existingAnswer = answers[currentQuestion.id];
      setCurrentAnswer(existingAnswer?.value || null);
    }
  }, [currentQuestionIndex, questions, answers]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600">{t('errors.loadError')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-primary-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 mb-6">{t('errors.loadError')}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-warm text-white px-6 py-3 rounded-xl font-semibold hover:shadow-primary-lg transition-all"
          >
            {t('personalInfo.backButton')}
          </button>
        </div>
      </div>
    );
  }

  // 질문이 아직 로드되지 않은 경우 로딩 표시
  if (questions.length === 0 || !questions[currentQuestionIndex]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600">{t('errors.loadError')}</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canProceed = currentAnswer !== null && currentAnswer !== '';

  const handleNext = () => {
    if (!canProceed) return;

    setAnswer(currentQuestion.id, currentAnswer);

    if (isLastQuestion) {
      // 마지막 질문이면 제출
      handleSubmit();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 선택지 클릭 시 자동으로 다음 질문으로 이동
  const handleAutoNext = (value: any) => {
    // 이미 제출 중이면 무시 (즉시 확인)
    if (submitMutation.isPending || isSubmittingRef) return;

    // 기존 대기 중인 setTimeout들 모두 취소
    pendingTimeoutIds.forEach(id => clearTimeout(id));
    setPendingTimeoutIds(new Set());

    setCurrentAnswer(value);
    setAnswer(currentQuestion.id, value);

    // 마지막 질문이면 즉시 제출 (지연 없이)
    if (isLastQuestion) {
      handleSubmit();
      return;
    }

    // 마지막 질문이 아닌 경우만 setTimeout 사용
    const timeoutId = setTimeout(() => {
      setPendingTimeoutIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(timeoutId);
        return newSet;
      });

      if (submitMutation.isPending || isSubmittingRef) return;
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }, 300);

    setPendingTimeoutIds(prev => new Set(prev).add(timeoutId));
  };

  const handleSubmit = () => {
    if (!personalInfo || isSubmittingRef) return;

    // 즉시 제출 플래그 설정
    setIsSubmittingRef(true);

    const submitData = {
      sessionId,
      personalInfo,
      answers: Object.values(answers),
      completedAt: new Date().toISOString()
    };

    submitMutation.mutate(submitData);
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'single_choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleAutoNext(option.value)}
                className={`w-full flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  currentAnswer === option.value
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  currentAnswer === option.value
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-400'
                }`}>
                  {currentAnswer === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="ml-3 text-gray-700 font-medium">{option.text}</span>
              </button>
            ))}
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => {
              const selectedValues = Array.isArray(currentAnswer) ? currentAnswer : [];
              const isChecked = selectedValues.includes(option.value);

              return (
                <label
                  key={option.id}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    isChecked
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter((v: any) => v !== option.value);
                      setCurrentAnswer(newValues);
                    }}
                    className="w-5 h-5 text-primary-500 focus:ring-primary-400 rounded"
                  />
                  <span className="ml-3 text-gray-700 font-medium">{option.text}</span>
                </label>
              );
            })}
          </div>
        );

      case 'text':
        return (
          <textarea
            value={currentAnswer || ''}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors resize-none"
            placeholder={t('survey.textPlaceholder')}
          />
        );

      case 'scale':
      case 'rating':
        const minValue = currentQuestion.minValue || 1;
        const maxValue = currentQuestion.maxValue || 5;
        const values = Array.from(
          { length: maxValue - minValue + 1 },
          (_, i) => minValue + i
        );

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-2">
              {values.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleAutoNext(value)}
                  className={`flex-1 h-16 rounded-xl font-bold text-lg transition-all ${
                    currentAnswer === value
                      ? 'bg-gradient-warm text-white scale-105 shadow-primary'
                      : 'bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            {currentQuestion.criterion && (
              <p className="text-sm text-gray-600 text-center">{currentQuestion.criterion}</p>
            )}
          </div>
        );

      case 'yes_no':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              {/* O 버튼 */}
              <button
                type="button"
                onClick={() => handleAutoNext(true)}
                className={`relative p-6 rounded-2xl border-3 transition-all duration-300 transform ${
                  currentAnswer === true
                    ? 'border-primary-500 bg-primary-50 scale-105 shadow-primary-lg'
                    : 'border-gray-200 bg-white hover:border-primary-300 hover:scale-102'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                    currentAnswer === true
                      ? 'bg-gradient-warm'
                      : 'bg-gray-100'
                  }`}>
                    <span className={`text-3xl font-bold transition-all duration-300 ${
                      currentAnswer === true ? 'text-white' : 'text-gray-400'
                    }`}>
                      O
                    </span>
                  </div>
                  <span className={`text-base font-semibold transition-all duration-300 ${
                    currentAnswer === true ? 'text-primary-700' : 'text-gray-500'
                  }`}>
                    {t('personalInfo.genders.male') === '男性' ? 'はい' : t('personalInfo.genders.male') === 'Male' ? 'Yes' : '예'}
                  </span>
                </div>
              </button>

              {/* X 버튼 */}
              <button
                type="button"
                onClick={() => handleAutoNext(false)}
                className={`relative p-6 rounded-2xl border-3 transition-all duration-300 transform ${
                  currentAnswer === false
                    ? 'border-primary-500 bg-primary-50 scale-105 shadow-primary-lg'
                    : 'border-gray-200 bg-white hover:border-primary-300 hover:scale-102'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                    currentAnswer === false
                      ? 'bg-gradient-warm'
                      : 'bg-gray-100'
                  }`}>
                    <span className={`text-3xl font-bold transition-all duration-300 ${
                      currentAnswer === false ? 'text-white' : 'text-gray-400'
                    }`}>
                      X
                    </span>
                  </div>
                  <span className={`text-base font-semibold transition-all duration-300 ${
                    currentAnswer === false ? 'text-primary-700' : 'text-gray-500'
                  }`}>
                    {t('personalInfo.genders.male') === '男性' ? 'いいえ' : t('personalInfo.genders.male') === 'Male' ? 'No' : '아니오'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8 px-4 pt-24">
      {/* Header with Language Switcher and API Mode */}
      <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-3xl mx-auto">
        {/* 진행률 */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-medium mb-2">
            <span className="text-xs text-gray-600">
              {t('survey.question')} {currentQuestionIndex + 1} {t('survey.of')} {questions.length}
            </span>

          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
            <div
              className="bg-gradient-warm h-2 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 질문 카드 */}
        <div className="bg-white rounded-2xl shadow-primary-lg p-6 md:p-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full text-xs font-semibold mb-3">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {currentQuestion.required ? t('survey.required') : t('survey.optional')}
            </div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              {currentQuestion.title}
            </h2>
            {currentQuestion.criterion && (
              <p className="text-gray-600 text-sm">{currentQuestion.criterion}</p>
            )}
          </div>

          <div className="mb-6">{renderQuestion()}</div>

          {/* 버튼 - 서술형 질문이나 다중 선택 질문일 때만 다음 버튼 표시 */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('survey.previousButton')}
            </button>
            {(currentQuestion.type === 'text' || currentQuestion.type === 'multiple_choice') && (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed || submitMutation.isPending}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  canProceed && !submitMutation.isPending
                    ? 'bg-gradient-warm text-white hover:shadow-primary-lg transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {submitMutation.isPending
                  ? t('survey.submitButton') + '...'
                  : isLastQuestion
                  ? t('survey.submitButton')
                  : t('survey.nextButton')}
              </button>
            )}
          </div>
        </div>

        {/* 자동 저장 안내 */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500">
          <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{t('survey.saveProgress')}</span>
        </div>
      </div>
    </div>
  );
}

export default SurveyPage;
