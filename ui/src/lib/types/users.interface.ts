import { CommonDTOEntity, CommonEntity, UUID } from "./common.interface";

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
export interface CurrentUserDTO extends UserDTO {
    profile: Profile | null;
}

// ===== User DTO From Server =====
export interface UserDTO extends CommonDTOEntity {
    id: UUID;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    provider: UserProvider;
    lastLogin?: string | null;
}

// ===== User For Using Client =====
export interface User extends CommonEntity {
    id: UUID;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    provider: UserProvider;
    lastLogin?: Date | null;
}

// ===== User Profile For Using Client =====
export interface Profile {
    id: UUID;
    username: string;
    timezone: SupportedTimezone;
    language: SupportedLanguage;
    avatarUrl: string;
    bio?: string | null;
}
