import { useNavigate } from 'react-router-dom';
import { useSurveyStore } from '../store/surveyStore';

function ResultPage() {
  const navigate = useNavigate();
  const { personalInfo, resetSurvey } = useSurveyStore();

  const handleNewSurvey = () => {
    resetSurvey();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="card text-center">
          {/* 성공 아이콘 */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            설문이 완료되었습니다!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            소중한 의견을 주셔서 감사합니다.
          </p>

          {/* 참가자 정보 */}
          {personalInfo && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                참가자 정보
              </h2>
              <div className="space-y-2 text-left max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-gray-600">이름:</span>
                  <span className="font-medium text-gray-900">{personalInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">이메일:</span>
                  <span className="font-medium text-gray-900">{personalInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">연령대:</span>
                  <span className="font-medium text-gray-900">{personalInfo.ageGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">성별:</span>
                  <span className="font-medium text-gray-900">{personalInfo.gender}</span>
                </div>
              </div>
            </div>
          )}

          {/* 안내 메시지 */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-primary-900 mb-2">
              다음 단계
            </h3>
            <p className="text-primary-800">
              설문 결과는 통계 분석 후 박람회 서비스 개선에 활용됩니다.
              <br />
              추가 문의사항이 있으시면 이메일로 연락 부탁드립니다.
            </p>
          </div>

          {/* 버튼 */}
          <div className="space-y-3">
            <button
              onClick={handleNewSurvey}
              className="btn-primary w-full max-w-md mx-auto"
            >
              새로운 설문 시작하기
            </button>
            <button
              onClick={() => window.location.href = 'https://seniorvibe.com'}
              className="btn-secondary w-full max-w-md mx-auto"
            >
              홈페이지로 이동
            </button>
          </div>

          {/* 추가 정보 */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              문의: tech-support@seniorvibe.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
