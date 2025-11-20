import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSurveyStore } from '../store/surveyStore';
import LanguageSwitcher from '../components/LanguageSwitcher';

function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { personalInfo, getProgress } = useSurveyStore();
  const progress = getProgress();

  const handleStart = () => {
    window.scrollTo(0, 0);
    navigate('/personal-info');
  };

  const handleContinue = () => {
    navigate('/survey');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 pt-20 pb-24">
      {/* Header with Language Switcher and API Mode */}
      <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-primary-lg p-8 md:p-12 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-warm rounded-full mb-3 shadow-primary">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-3">
            {t('app.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {t('app.subtitle')}
          </p>

          <div className="bg-primary-50 rounded-xl p-4 mb-6">
            <p className="text-base text-gray-700 mb-3">{t('landing.description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="flex flex-col items-center p-3 bg-white border-2 border-primary-100 rounded-xl hover:border-primary-300 transition-colors">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-700">{t('landing.estimatedTime')}</p>
                <p className="text-xs text-gray-500">3{t('landing.minutes')}</p>
              </div>
            </div>
            <div className="flex flex-col items-center p-3 bg-white border-2 border-primary-100 rounded-xl hover:border-primary-300 transition-colors">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-700">{t('landing.features.anonymous')}</p>
              </div>
            </div>
            <div className="flex flex-col items-center p-3 bg-white border-2 border-primary-100 rounded-xl hover:border-primary-300 transition-colors">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-700">{t('landing.features.giveDocument')}</p>
              </div>
            </div>
          </div>

          {personalInfo && progress > 0 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-xl p-6">
                <p className="text-primary-800 font-semibold mb-2 text-base">
                  {t('survey.saveProgress')}
                </p>
                <div className="w-full bg-white rounded-full h-3 mb-3 shadow-inner">
                  <div
                    className="bg-gradient-warm h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-700 font-medium">
                  {progress.toFixed(0)}% {t('survey.progress')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleContinue}
                  className="flex-1 bg-gradient-warm text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-primary-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {t('personalInfo.nextButton')}
                </button>
                <button
                  onClick={handleStart}
                  className="flex-1 bg-white border-2 border-primary-300 text-primary-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-50 transition-colors"
                >
                  {t('result.newSurveyButton')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Start Button */}
      <div className="fixed bottom-4 left-4 right-4 z-40">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleStart}
            className="w-full bg-gradient-warm text-white px-6 py-3 rounded-xl text-base font-semibold hover:shadow-primary-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
          >
            {t('landing.startButton')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
