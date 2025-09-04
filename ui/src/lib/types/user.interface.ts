import { CommonDTOEntity, CommonEntity } from "./common.interface";

//  ===== Enum =====
export enum UserRole {
    USER = "user",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin",
}

export enum UserProvider {
    LOCAL = "local",
    GOOGLE = "google",
}

export enum SupportedTimezone {
    ASIA_SEOUL = "Asia/Seoul",
    UTC = "UTC",
}

export enum SupportedLanguage {
    KO = "ko",
    EN = "en",
}

// ===== Auth Context =====
export interface AuthContextType {
    currentUser: User | null;
    currentProfile: Profile | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setProfile: (profile: Profile | null) => void;
    clearUser: () => void;
    logout: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithLocal: (email: string, password: string) => Promise<boolean>;
}

// ===== Current User =====
export interface UserWithProfileDTO extends UserDTO {
    profile: Profile | null;
}

// ===== User DTO From Server =====
export interface UserDTO extends CommonDTOEntity {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    provider: UserProvider;
    version: number;
    lastLogin?: string | null;
}

// ===== User For Using Client =====
export interface User extends CommonEntity {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    provider: UserProvider;
    version: number;
    lastLogin?: Date | null;
}

// ===== User Profile For Using Client =====
export interface Profile {
    id: number;
    nickname: string;
    avatarUrl: string;
    version: number;

    // nullable
    language: SupportedLanguage | null;
    bio: string | null;
}

// ===== Request =====

export interface UpdateProfileDto {
    nickname?: string;
    avatarUrl?: string;
    language?: SupportedLanguage;
    bio?: string;
    version: number;
}
