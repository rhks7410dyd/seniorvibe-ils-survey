import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSurveyStore } from '../store/surveyStore';
import { PersonalInfo } from '../types';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface PersonalInfoForm {
  email: string;
  name: string;
  ageGroup: string;
  gender: string;
  eventCode?: string;
  marketingConsent?: boolean;
}

function PersonalInfoPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setPersonalInfo, personalInfo } = useSurveyStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<PersonalInfoForm>({
    mode: 'onChange',
    defaultValues: personalInfo || {
      email: '',
      name: '',
      ageGroup: '',
      gender: '',
      eventCode: '',
      marketingConsent: true
    }
  });

  const onSubmit = (data: PersonalInfoForm) => {
    setPersonalInfo(data as PersonalInfo);
    navigate('/survey');
  };

  const ageGroups = Object.entries(t('personalInfo.ageGroups', { returnObjects: true }) as Record<string, string>)
    .map(([value, label]) => ({ value, label }));

  const genders = [
    { value: 'male', label: t('personalInfo.genders.male') },
    { value: 'female', label: t('personalInfo.genders.female') },
    { value: 'other', label: t('personalInfo.genders.other') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 pt-20">
      {/* Header with Language Switcher and API Mode */}
      <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-primary-lg p-8 md:p-12">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-11 h-11 bg-gradient-warm rounded-full mb-3 shadow-primary">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-2">
              {t('personalInfo.title')}
            </h1>
            <p className="text-sm text-gray-600">
              {t('personalInfo.description')}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 이름 */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-2">
                {t('personalInfo.name')} <span className="text-primary-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                {...register('name', {
                  required: t('errors.required'),
                  minLength: {
                    value: 2,
                    message: t('errors.required')
                  }
                })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors text-sm"
                placeholder={t('personalInfo.namePlaceholder')}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-primary-600">{errors.name.message}</p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-2">
                {t('personalInfo.email')} <span className="text-primary-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: t('errors.required'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('errors.invalidEmail')
                  }
                })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors text-sm"
                placeholder={t('personalInfo.emailPlaceholder')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-primary-600">{errors.email.message}</p>
              )}
            </div>

            {/* 연령대 */}
            <div>
              <label htmlFor="ageGroup" className="block text-xs font-semibold text-gray-700 mb-2">
                {t('personalInfo.ageGroup')} <span className="text-primary-500">*</span>
              </label>
              <select
                id="ageGroup"
                {...register('ageGroup', {
                  required: t('errors.required')
                })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors bg-white text-sm"
              >
                <option value="">{t('personalInfo.ageGroup')}</option>
                {ageGroups.map((age) => (
                  <option key={age.value} value={age.value}>
                    {age.label}
                  </option>
                ))}
              </select>
              {errors.ageGroup && (
                <p className="mt-1 text-sm text-primary-600">{errors.ageGroup.message}</p>
              )}
            </div>

            {/* 성별 */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                {t('personalInfo.gender')} <span className="text-primary-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {genders.map((gender) => (
                  <label
                    key={gender.value}
                    className="relative flex items-center justify-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 transition-colors has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
                  >
                    <input
                      type="radio"
                      value={gender.value}
                      {...register('gender', {
                        required: t('errors.required')
                      })}
                      className="sr-only"
                    />
                    <span className="text-xs font-medium text-gray-700">{gender.label}</span>
                    <div className="absolute top-2 right-2 w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center transition-colors peer-checked:border-primary-500">
                      <div className="w-3 h-3 bg-primary-500 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm text-primary-600">{errors.gender.message}</p>
              )}
            </div>

            {/* 이벤트 코드 (선택) */}
            <div>
              <label htmlFor="eventCode" className="block text-xs font-semibold text-gray-700 mb-2">
                {t('personalInfo.eventCode')}
              </label>
              <input
                id="eventCode"
                type="text"
                {...register('eventCode')}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors text-sm"
                placeholder={t('personalInfo.eventCodePlaceholder')}
              />
            </div>

            {/* 마케팅 동의 */}
            <div className="bg-gray-50 rounded-xl p-3">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  {...register('marketingConsent')}
                  className="mt-1 w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-xs text-gray-700">
                  {t('personalInfo.marketingConsent')}
                </span>
              </label>
            </div>

            {/* 버튼 */}
            <div className="flex flex-col sm:flex-row gap-2 pt-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                {t('personalInfo.backButton')}
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isValid
                    ? 'bg-gradient-warm text-white hover:shadow-primary-lg transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('personalInfo.nextButton')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfoPage;
