const ROOT_URL = import.meta.env.VITE_ROOT_URL || 'http://localhost:3000';

interface URLMappingConfig {
  oxQuestions: string;
}

export const urlMapping: URLMappingConfig = {
  oxQuestions: `${ROOT_URL}/api/survey/ox-questions`
};

export const getOXQuestionsUrl = (): string => {
  return urlMapping.oxQuestions;
};

export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = ROOT_URL.endsWith('/') ? ROOT_URL.slice(0, -1) : ROOT_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};