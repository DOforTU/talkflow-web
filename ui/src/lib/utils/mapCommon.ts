import { CommonDTOEntity, CommonEntity } from "../types/common.interface";

export function mapCommon(dto: CommonDTOEntity): CommonEntity {
    return {
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
        deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
    };
}
