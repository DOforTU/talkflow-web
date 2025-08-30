'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { profileApi, UpdateProfileDto } from '@/lib/api/profile';
import ProfileImageUpload from '@/components/profile/ProfileImageUpload';
import { useRouter } from 'next/navigation';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, profile, setProfile } = useAuthStore();
  const [saving, setSaving] = useState(false);
  
  // 폼 상태
  const [formData, setFormData] = useState({
    nickname: '',
    avatarUrl: '',
    language: 'ko' as 'ko' | 'en',
    bio: '',
    version: 0
  });

  // 프로필 데이터 로드
  useEffect(() => {
    if (profile) {
      setFormData({
        nickname: profile.nickname || '',
        avatarUrl: profile.avatarUrl || '',
        language: (profile.language as 'ko' | 'en') || 'ko',
        bio: profile.bio || '',
        version: profile.version || 0
      });
    }
  }, [profile]);

  // 로그인하지 않은 사용자 리디렉션
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      avatarUrl: url
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      alert('프로필 정보를 불러올 수 없습니다.');
      return;
    }

    try {
      setSaving(true);
      
      const updateData: UpdateProfileDto = {
        nickname: formData.nickname,
        avatarUrl: formData.avatarUrl,
        language: formData.language,
        bio: formData.bio,
        version: formData.version
      };

      const updatedProfile = await profileApi.updateProfile(Number(profile.id), updateData);
      
      // 스토어의 프로필 정보 업데이트
      setProfile(updatedProfile);
      
      alert('프로필이 성공적으로 업데이트되었습니다!');
    } catch (error: unknown) {
      console.error('프로필 업데이트 실패:', error);
      
      // axios 에러인지 확인
      interface AxiosError {
        response?: {
          status: number;
        };
      }
      
      const isAxiosError = error && typeof error === 'object' && 'response' in error;
      const status = isAxiosError ? (error as AxiosError).response?.status : null;
      
      if (status === 409) {
        alert('동시 수정이 발생했습니다. 페이지를 새로고침하고 다시 시도해주세요.');
      } else if (status === 400) {
        alert('입력 데이터가 올바르지 않습니다. 다시 확인해주세요.');
      } else {
        alert('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">프로필 설정</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 프로필 이미지 */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                프로필 이미지
              </label>
              <ProfileImageUpload
                currentImageUrl={formData.avatarUrl}
                onImageUrlChange={handleImageUrlChange}
                disabled={saving}
              />
            </div>

            {/* 닉네임 */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                닉네임
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                disabled={saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="닉네임을 입력하세요"
                minLength={4}
                maxLength={30}
                pattern="^[a-zA-Z0-9_가-힣]+$"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                4-30자, 영문/숫자/한글/밑줄(_)만 사용 가능 (공백 불가)
              </p>
            </div>

            {/* 언어 설정 */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                언어
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                disabled={saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* 자기소개 */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                자기소개
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="자기소개를 입력하세요 (선택사항)"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                최대 500자
              </p>
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={saving}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        </div>

        {/* 디버그 정보 */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">디버그 정보 (Google Storage 테스트용)</h3>
          <div className="space-y-2 text-sm">
            <div><strong>사용자 ID:</strong> {user.id}</div>
            <div><strong>프로필 ID:</strong> {profile.id}</div>
            <div><strong>현재 닉네임:</strong> {profile.nickname}</div>
            <div><strong>현재 아바타 URL:</strong> {profile.avatarUrl}</div>
            <div><strong>프로필 버전:</strong> {formData.version}</div>
            <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 font-medium">Google Storage 테스트 방법:</p>
              <ul className="mt-2 text-yellow-700 text-xs list-disc list-inside">
                <li>이미지를 선택하면 Google Cloud Storage에 업로드됩니다</li>
                <li>저장 후 기존 이미지는 자동으로 삭제됩니다</li>
                <li>Network 탭에서 API 호출을 확인할 수 있습니다</li>
                <li>업로드된 이미지 URL이 아바타 URL에 표시됩니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}