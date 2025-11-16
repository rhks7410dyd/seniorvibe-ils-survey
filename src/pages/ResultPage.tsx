import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSurveyStore } from '../store/surveyStore';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ApiModeIndicator from '../components/ApiModeIndicator';

function ResultPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { personalInfo, answers, resetSurvey, pinNumber } = useSurveyStore();

  const handleNewSurvey = () => {
    resetSurvey();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 pt-20">
      {/* Header with Language Switcher and API Mode */}
      <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
        <ApiModeIndicator />
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-primary-lg p-8 md:p-12 text-center">
          {/* 성공 아이콘 */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto shadow-primary">
                <svg
                  className="w-14 h-14 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-gradient-warm rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-4">
            {t('result.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {t('result.thankYou')}
          </p>
          <p className="text-lg text-gray-500 mb-8">
            {t('result.description')}
          </p>

          {/* PIN Number 출력 */}
          {pinNumber && (
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('result.pinNumberTitle')}
              </h2>
              <div className="flex items-center justify-center gap-2 md:gap-4">
                {pinNumber.split('').map((digit, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-primary-600">
                      {digit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 참가자 정보 */}
          {personalInfo && (
            <div className="bg-white border-2 border-primary-100 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('personalInfo.title')}
              </h2>
              <div className="space-y-3 text-left max-w-md mx-auto">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{t('personalInfo.name')}:</span>
                  <span className="font-semibold text-gray-900">{personalInfo.name}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{t('personalInfo.email')}:</span>
                  <span className="font-semibold text-gray-900">{personalInfo.email}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{t('personalInfo.ageGroup')}:</span>
                  <span className="font-semibold text-gray-900">
                    {t(`personalInfo.ageGroups.${personalInfo.ageGroup}`)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{t('personalInfo.gender')}:</span>
                  <span className="font-semibold text-gray-900">
                    {t(`personalInfo.genders.${personalInfo.gender}`)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="space-y-3 mb-8">
            <button
              onClick={handleNewSurvey}
              className="w-full max-w-md mx-auto bg-gradient-warm text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-primary-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {t('result.newSurveyButton')}
            </button>
          </div>

          {/* 추가 정보 */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {t('errors.networkError')}: tech-support@seniorvibe.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
