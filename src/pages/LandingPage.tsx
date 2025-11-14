import { useNavigate } from 'react-router-dom';
import { useSurveyStore } from '../store/surveyStore';

function LandingPage() {
  const navigate = useNavigate();
  const { personalInfo, getProgress } = useSurveyStore();
  const progress = getProgress();

  const handleStart = () => {
    navigate('/personal-info');
  };

  const handleContinue = () => {
    navigate('/survey');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="card text-center">
          <h1 className="text-4xl font-bold text-primary-700 mb-4">
            SeniorVibe ILS Survey
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            박람회 참가자를 위한 설문조사
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-3 text-gray-700">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>예상 소요시간: 약 3-5분</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-gray-700">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>회원가입 불필요</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-gray-700">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>자동 저장 기능</span>
            </div>
          </div>

          {personalInfo && progress > 0 ? (
            <div className="space-y-4">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-primary-800 font-medium mb-2">
                  진행 중인 설문이 있습니다
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {progress.toFixed(0)}% 완료
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleContinue}
                  className="btn-primary flex-1"
                >
                  이어서 작성하기
                </button>
                <button
                  onClick={handleStart}
                  className="btn-secondary flex-1"
                >
                  새로 시작하기
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleStart}
              className="btn-primary w-full max-w-md mx-auto"
            >
              설문 시작하기
            </button>
          )}

          <p className="mt-6 text-sm text-gray-500">
            본 설문은 익명으로 진행되며, 수집된 정보는 통계 목적으로만 사용됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
