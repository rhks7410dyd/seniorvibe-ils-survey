import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSurveyStore } from '../store/surveyStore';
import { PersonalInfo } from '../types';

interface PersonalInfoForm {
  email: string;
  name: string;
  ageGroup: string;
  gender: string;
  phone?: string;
}

function PersonalInfoPage() {
  const navigate = useNavigate();
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
      phone: ''
    }
  });

  const onSubmit = (data: PersonalInfoForm) => {
    setPersonalInfo(data as PersonalInfo);
    navigate('/survey');
  };

  const ageGroups = [
    '50대 미만',
    '50대',
    '60대',
    '70대',
    '80대 이상'
  ];

  const genders = ['남성', '여성', '기타'];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="card">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              인적정보 입력
            </h1>
            <p className="text-gray-600">
              설문 진행을 위해 기본 정보를 입력해주세요
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 이름 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                {...register('name', {
                  required: '이름을 입력해주세요',
                  minLength: {
                    value: 2,
                    message: '이름은 최소 2자 이상이어야 합니다'
                  }
                })}
                className="input-field"
                placeholder="홍길동"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: '이메일을 입력해주세요',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '올바른 이메일 형식이 아닙니다'
                  }
                })}
                className="input-field"
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* 연령대 */}
            <div>
              <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700 mb-2">
                연령대 <span className="text-red-500">*</span>
              </label>
              <select
                id="ageGroup"
                {...register('ageGroup', {
                  required: '연령대를 선택해주세요'
                })}
                className="input-field"
              >
                <option value="">연령대를 선택하세요</option>
                {ageGroups.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
              {errors.ageGroup && (
                <p className="mt-1 text-sm text-red-600">{errors.ageGroup.message}</p>
              )}
            </div>

            {/* 성별 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                성별 <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                {genders.map((gender) => (
                  <label key={gender} className="flex items-center">
                    <input
                      type="radio"
                      value={gender}
                      {...register('gender', {
                        required: '성별을 선택해주세요'
                      })}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">{gender}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>

            {/* 전화번호 (선택) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                전화번호 (선택)
              </label>
              <input
                id="phone"
                type="tel"
                {...register('phone', {
                  pattern: {
                    value: /^[0-9-]+$/,
                    message: '올바른 전화번호 형식이 아닙니다'
                  }
                })}
                className="input-field"
                placeholder="010-1234-5678"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary flex-1"
              >
                이전
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className="btn-primary flex-1"
              >
                다음
              </button>
            </div>
          </form>

          <p className="mt-6 text-sm text-gray-500 text-center">
            입력하신 정보는 브라우저에 안전하게 저장됩니다
          </p>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfoPage;
