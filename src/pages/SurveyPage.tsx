import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSurveyStore } from '../store/surveyStore';
import { surveyAPI } from '../services/api';
import { Question } from '../types';

function SurveyPage() {
  const navigate = useNavigate();
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
    setStartedAt
  } = useSurveyStore();

  const [currentAnswer, setCurrentAnswer] = useState<any>(null);

  // 인적정보가 없으면 리다이렉트
  useEffect(() => {
    if (!personalInfo) {
      navigate('/personal-info');
    }
    if (!startedAt) {
      setStartedAt(new Date().toISOString());
    }
  }, [personalInfo, navigate, startedAt, setStartedAt]);

  // 질문 목록 가져오기
  const { isLoading, error } = useQuery({
    queryKey: ['questions'],
    queryFn: surveyAPI.getQuestions,
    enabled: questions.length === 0,
    onSuccess: (data) => {
      setQuestions(data);
    }
  });

  // 설문 제출 mutation
  const submitMutation = useMutation({
    mutationFn: surveyAPI.submitSurvey,
    onSuccess: () => {
      navigate('/result');
    },
    onError: (error) => {
      console.error('Failed to submit survey:', error);
      alert('설문 제출에 실패했습니다. 다시 시도해주세요.');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">질문을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center">
          <p className="text-red-600 mb-4">질문을 불러오는데 실패했습니다.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            처음으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = getProgress();
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

  const handleSubmit = () => {
    if (!personalInfo) return;

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
              <label
                key={option.id}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  currentAnswer === option.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option.value}
                  checked={currentAnswer === option.value}
                  onChange={(e) => setCurrentAnswer(Number(e.target.value) || e.target.value)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => {
              const selectedValues = currentAnswer || [];
              const isChecked = selectedValues.includes(option.value);

              return (
                <label
                  key={option.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isChecked
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
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
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                  />
                  <span className="ml-3 text-gray-700">{option.text}</span>
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
            className="input-field resize-none"
            placeholder="답변을 입력해주세요..."
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
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {values.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCurrentAnswer(value)}
                  className={`w-14 h-14 rounded-full font-semibold transition-all ${
                    currentAnswer === value
                      ? 'bg-primary-600 text-white scale-110'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>낮음</span>
              <span>높음</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 진행률 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>질문 {currentQuestionIndex + 1} / {questions.length}</span>
            <span>{progress.toFixed(0)}% 완료</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 질문 카드 */}
        <div className="card">
          <div className="mb-6">
            <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-3">
              {currentQuestion.category}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentQuestion.title}
            </h2>
            {currentQuestion.description && (
              <p className="text-gray-600">{currentQuestion.description}</p>
            )}
            {currentQuestion.required && (
              <p className="text-sm text-red-600 mt-2">* 필수 질문입니다</p>
            )}
          </div>

          <div className="mb-8">{renderQuestion()}</div>

          {/* 버튼 */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed || submitMutation.isPending}
              className="btn-primary flex-1"
            >
              {submitMutation.isPending
                ? '제출 중...'
                : isLastQuestion
                ? '제출하기'
                : '다음'}
            </button>
          </div>
        </div>

        {/* 자동 저장 안내 */}
        <p className="text-center text-sm text-gray-500 mt-4">
          답변은 자동으로 저장됩니다
        </p>
      </div>
    </div>
  );
}

export default SurveyPage;
