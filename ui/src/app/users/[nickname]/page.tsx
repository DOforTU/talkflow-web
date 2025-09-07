"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { profileApi } from "@/lib/api/profile";
import { followApi } from "@/lib/api/follow";
import { Profile } from "@/lib/types/user.interface";
import { useAuthStore } from "@/store/authStore";
import FollowList from "@/components/user-page/FollowList";
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
    
    // 팔로우 관련 상태
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const isOwnProfile = isAuthenticated && currentUserProfile?.nickname === nickname;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const data = await profileApi.getProfileByNickname(nickname);
                setProfileData(data);

                // 팔로우 수 가져오기
                const followCounts = await followApi.getFollowCounts(data.id);
                setFollowersCount(followCounts.followers);
                setFollowingCount(followCounts.followings);

                // 로그인한 사용자인 경우 팔로우 상태 확인
                if (isAuthenticated && !isOwnProfile) {
                    const myFollowings = await followApi.getMyFollowings();
                    const isCurrentlyFollowing = myFollowings.some(following => following.id === data.id);
                    setIsFollowing(isCurrentlyFollowing);
                }
            } catch (err) {
                setError("프로필을 찾을 수 없습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        if (nickname) {
            fetchProfile();
        }
    }, [nickname, isAuthenticated, isOwnProfile]);

    const handleFollow = async () => {
        if (!profileData) return;
        
        try {
            await followApi.toggleFollow(profileData.id);
            
            // 팔로우 상태 토글
            const newFollowingState = !isFollowing;
            setIsFollowing(newFollowingState);
            
            // 팔로워 수 업데이트
            if (newFollowingState) {
                setFollowersCount((prev) => prev + 1);
            } else {
                setFollowersCount((prev) => prev - 1);
            }
        } catch (err) {
            console.error("팔로우/언팔로우 실패:", err);
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
                    {profileData && (
                        <FollowList
                            profileId={profileData.id}
                            followersCount={followersCount}
                            followingCount={followingCount}
                        />
                    )}

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
