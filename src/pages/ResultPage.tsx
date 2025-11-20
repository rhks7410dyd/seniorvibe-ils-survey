import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSurveyStore } from '../store/surveyStore';
import LanguageSwitcher from '../components/LanguageSwitcher';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

function ResultPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { resetSurvey, pinNumber } = useSurveyStore();
  const pinCardRef = useRef<HTMLDivElement>(null);

  const handleNewSurvey = () => {
    resetSurvey();
    navigate('/');
  };

  const handleSavePinImage = async () => {
    if (!pinCardRef.current) return;

    try {
      const canvas = await html2canvas(pinCardRef.current, {
        background: '#ffffff',
        useCORS: true,
        allowTaint: true
      });

      // 캔버스를 이미지로 변환
      const imageDataUrl = canvas.toDataURL('image/png');

      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = imageDataUrl;
      link.download = `pin-number-${pinNumber}.png`;

      // 임시로 DOM에 추가하고 클릭 후 제거
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to save PIN image:', error);
      alert('이미지 저장에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 pt-20">
      {/* Header with Language Switcher and API Mode */}
      <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-primary-lg p-8 md:p-12 text-center">
          {/* 성공 아이콘 */}
          <div className="mb-6">
            <div className="relative inline-block">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto shadow-primary">
                <svg
                  className="w-10 h-10 text-primary-600"
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
                <div className="w-6 h-6 bg-gradient-warm rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-3">
            {t('result.title')}
          </h1>
          <div className="text-base text-gray-600 mb-2">
            <p>{t('result.nextStep1')}</p>
            <p>{t('result.nextStep2')}</p>
          </div>
          <div className="text-sm text-gray-500 mb-6">
            <p>{t('result.description1')}</p>
            <p>{t('result.description2')}</p>
            <p>{t('result.description3')}</p>
          </div>
          
          {/* PIN Number 출력 */}
          {pinNumber && (
            <div className="mb-6">
              <div
                ref={pinCardRef}
                className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 mb-3 border-2 border-primary-100"
              >
                <div className="text-center">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    {t('result.pinNumberTitle')}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {pinNumber.split('').map((digit, index) => (
                      <div key={index} className="text-center">
                        <div className="text-4xl font-bold text-primary-600">
                          {digit}
                        </div>
                      </div>
                    ))}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mt-8">
                    {t('result.boothPost')}
                  </h2>
                  <img
                    src={`${import.meta.env.BASE_URL}images/booth-location.png`}
                    alt="Booth Location"
                    className="mx-auto w-full h-auto"
                    onLoad={() => console.log('Image loaded successfully')}
                    onError={(e) => {
                      console.error('Image failed to load:', e);
                      console.error('Image src:', e.currentTarget.src);
                      console.error('BASE_URL:', import.meta.env.BASE_URL);
                    }}
                  />
                </div>
              </div>

              {/* PIN 이미지 저장 버튼 */}
              <button
                onClick={handleSavePinImage}
                className="w-full max-w-md mx-auto block bg-white border-2 border-primary-300 text-primary-600 px-6 py-3 rounded-xl text-base font-semibold hover:bg-primary-50 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('result.savePinImage')}
                </div>
              </button>
            </div>
          )}

          {/* 버튼 */}
          <div className="space-y-2 mb-6">
            <button
              onClick={handleNewSurvey}
              className="w-full max-w-md mx-auto bg-gradient-warm text-white px-6 py-3 rounded-xl text-base font-semibold hover:shadow-primary-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {t('result.newSurveyButton')}
            </button>
          </div>

          {/* 추가 정보 */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              {t('errors.networkError')}: tech-support@seniorvibe.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
