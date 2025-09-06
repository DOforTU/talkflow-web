"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { profileApi } from "@/lib/api/profile";
import { Profile } from "@/lib/types/user.interface";
import { useAuthStore } from "@/store/authStore";
import "./UserPage.css";

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const nickname = params.nickname as string;

    const { user, profile: currentUserProfile, isAuthenticated } = useAuthStore();

    const [profileData, setProfileData] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false); // 임시 상태

    // 임시 팔로우/팔로워 수
    const [followersCount, setFollowersCount] = useState(1234);
    const [followingCount, setFollowingCount] = useState(567);

    const isOwnProfile = isAuthenticated && currentUserProfile?.nickname === nickname;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const data = await profileApi.getProfileByNickname(nickname);
                setProfileData(data);

                // 임시 팔로우 상태 설정 (실제로는 API에서 가져와야 함)
                setIsFollowing(Math.random() > 0.5);
            } catch (err) {
                setError("프로필을 찾을 수 없습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        if (nickname) {
            fetchProfile();
        }
    }, [nickname]);

    const handleFollow = () => {
        // 임시 팔로우 로직
        setIsFollowing(!isFollowing);
        if (isFollowing) {
            setFollowersCount((prev) => prev - 1);
        } else {
            setFollowersCount((prev) => prev + 1);
        }
    };

    const handleProfileSettings = () => {
        router.push("/all/settings/profile");
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <p>프로필을 로딩 중입니다...</p>
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="error-container">
                <p>{error || "프로필을 찾을 수 없습니다."}</p>
            </div>
        );
    }

    return (
        <div className="user-profile-page">
            {/* 프로필 헤더 */}
            <div className="profile-header">
                {/* 프로필 이미지 */}
                <div className="profile-page-image-container">
                    {profileData.avatarUrl ? (
                        <Image
                            src={profileData.avatarUrl}
                            alt={profileData.nickname}
                            width={100}
                            height={100}
                            className="profile-page-image"
                        />
                    ) : (
                        <div className="profile-page-image-placeholder">
                            {profileData.nickname.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* 프로필 정보 */}
                <div className="profile-info">
                    <h1 className="profile-nickname">{profileData.nickname}</h1>

                    {profileData.bio && <p className="profile-bio">{profileData.bio}</p>}

                    {/* 팔로우 정보 */}
                    <div className="follow-stats">
                        <span>
                            <strong>{followingCount}</strong> 팔로잉
                        </span>
                        <span>
                            <strong>{followersCount}</strong> 팔로워
                        </span>
                    </div>

                    {/* 버튼 영역 */}
                    {isAuthenticated && (
                        <div className="profile-buttons">
                            {isOwnProfile ? (
                                <button onClick={handleProfileSettings} className="profile-settings-btn">
                                    프로필 설정
                                </button>
                            ) : (
                                <button
                                    onClick={handleFollow}
                                    className={`follow-btn ${isFollowing ? "following" : "not-following"}`}
                                >
                                    {isFollowing ? "언팔로우" : "팔로우"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 콘텐츠 영역 (추후 확장) */}
            <div className="content-area">
                <p>사용자의 게시글이 여기에 표시됩니다.</p>
            </div>
        </div>
    );
}
