// ===== DTO From Server =====
export interface CommonDTOEntity {
    // 서버에서 Date로 저장하지만, 네트워크로 받으면 결국 string
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

// ===== For Using Client =====
export interface CommonEntity {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
