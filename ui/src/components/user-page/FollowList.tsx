"use client";

import { useState } from "react";
import Image from "next/image";
import { Profile } from "@/lib/types/user.interface";
import { followApi } from "@/lib/api/follow";
import "./FollowList.css";
import { useRouter } from "next/navigation";

interface FollowListProps {
    profileId: number;
    followersCount: number;
    followingCount: number;
    onFollowersClick?: () => void;
    onFollowingsClick?: () => void;
}

export default function FollowList({
    profileId,
    followersCount,
    followingCount,
    onFollowersClick,
    onFollowingsClick,
}: FollowListProps) {
    const router = useRouter();
    const [followers, setFollowers] = useState<Profile[]>([]);
    const [followings, setFollowings] = useState<Profile[]>([]);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingsModal, setShowFollowingsModal] = useState(false);
    const [followModalLoading, setFollowModalLoading] = useState(false);

    const handleFollowersClick = async () => {
        try {
            setFollowModalLoading(true);
            setShowFollowersModal(true);
            const followersData = await followApi.getFollowers(profileId);
            setFollowers(followersData);
            onFollowersClick?.();
        } catch (err) {
            console.error("Failed to fetch followers:", err);
        } finally {
            setFollowModalLoading(false);
        }
    };

    const handleFollowingsClick = async () => {
        try {
            setFollowModalLoading(true);
            setShowFollowingsModal(true);
            const followingsData = await followApi.getFollowings(profileId);
            setFollowings(followingsData);
            onFollowingsClick?.();
        } catch (err) {
            console.error("Failed to fetch followings:", err);
        } finally {
            setFollowModalLoading(false);
        }
    };

    // 사용자 클릭 시 해당 사용자 페이지로 이동
    const handleProfileClick = (nickname: string) => {
        router.push(`/users/${nickname}`);
    };

    return (
        <>
            <div className="follow-stats">
                <span onClick={handleFollowingsClick} style={{ cursor: "pointer" }}>
                    <strong>{followingCount}</strong> Following
                </span>
                <span onClick={handleFollowersClick} style={{ cursor: "pointer" }}>
                    <strong>{followersCount}</strong> Followers
                </span>
            </div>

            {showFollowersModal && (
                <div className="modal-overlay" onClick={() => setShowFollowersModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Followers</h3>
                            <button className="modal-close" onClick={() => setShowFollowersModal(false)}>
                                x
                            </button>
                        </div>
                        <div className="modal-body">
                            {followModalLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <div className="profile-list">
                                    {followers.map((follower) => (
                                        // 사용자 클릭 시 해당 사용자 페이지로 이동
                                        <div
                                            key={follower.id}
                                            className="profile-item"
                                            onClick={() => handleProfileClick(follower.nickname)}
                                        >
                                            {follower.avatarUrl ? (
                                                <Image
                                                    src={follower.avatarUrl}
                                                    alt={follower.nickname}
                                                    width={40}
                                                    height={40}
                                                    className="profile-item-image"
                                                />
                                            ) : (
                                                <div className="profile-item-placeholder">
                                                    {follower.nickname.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="profile-item-info">
                                                <p className="profile-item-nickname">{follower.nickname}</p>
                                                {follower.bio && <p className="profile-item-bio">{follower.bio}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showFollowingsModal && (
                <div className="modal-overlay" onClick={() => setShowFollowingsModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Following</h3>
                            <button className="modal-close" onClick={() => setShowFollowingsModal(false)}>
                                x
                            </button>
                        </div>
                        <div className="modal-body">
                            {followModalLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <div className="profile-list">
                                    {followings.map((following) => (
                                        <div
                                            key={following.id}
                                            className="profile-item"
                                            onClick={() => handleProfileClick(following.nickname)}
                                        >
                                            {following.avatarUrl ? (
                                                <Image
                                                    src={following.avatarUrl}
                                                    alt={following.nickname}
                                                    width={40}
                                                    height={40}
                                                    className="profile-item-image"
                                                />
                                            ) : (
                                                <div className="profile-item-placeholder">
                                                    {following.nickname.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="profile-item-info">
                                                <p className="profile-item-nickname">{following.nickname}</p>
                                                {following.bio && <p className="profile-item-bio">{following.bio}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
