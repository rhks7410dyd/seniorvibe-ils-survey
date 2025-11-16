import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'ko', name: t('language.ko') },
    { code: 'en', name: t('language.en') },
    { code: 'ja', name: t('language.ja') }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{t('language.select')}:</span>
      <div className="flex gap-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`px-3 py-1 text-sm rounded-md transition-all ${
              i18n.language === lang.code
                ? 'bg-primary-500 text-white shadow-primary'
                : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
