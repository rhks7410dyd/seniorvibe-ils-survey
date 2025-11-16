import { useTranslation } from 'react-i18next';
import { getAPIMode } from '../services/api';

const ApiModeIndicator = () => {
  const { t } = useTranslation();
  const mode = getAPIMode();

  return (
    <div className="flex items-center gap-2">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
          mode === 'mock'
            ? 'bg-secondary-100 text-secondary-700'
            : 'bg-accent-100 text-accent-700'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            mode === 'mock' ? 'bg-secondary-500' : 'bg-accent-500'
          }`}
        />
        {t(`mode.${mode}`)}
      </div>
    </div>
  );
};

export default ApiModeIndicator;
