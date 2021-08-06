import { precondition } from '../../lib/preconditions.js'
import { User } from '../../models/user/User.js'
import { UserDto } from '../../models/user/UserDto.js'
import { Mapper } from './Mapper.js'
import { Identification } from '../../models/value/Identification.js'
import { MayBeIdentified } from './MayBeIdentified.js'

export class UserMapper implements Mapper<User, UserDto> {

    isDtoValid(dto: MayBeIdentified<UserDto>): boolean {
        return Boolean(dto) &&
            User.isValid(
                dto.authId,
                dto.name,
                dto.username,
                dto.email,
                dto.status,
                dto.lastLogin,
                dto.lastConnection,
                dto.signedIn,
                dto.dayStartTime,
                'id' in dto ? dto.id : undefined
            )
    }

    fromDto(dto: UserDto): User {
        precondition(this.isDtoValid(dto))
        return new User(dto.authId, dto.name, dto.username, dto.email, dto.status, dto.lastLogin, dto.lastConnection, dto.signedIn, dto.dayStartTime, new Identification(dto.id))
    }

    toDto(user: User): UserDto {
        return {
            id: user.getId().toString(),
            authId: user.getAuthId().toString(),
            name: user.getName(),
            username: user.getUsername(),
            email: user.getEmail().toString(),
            status: user.getStatus().getOrdinal(),
            lastLogin: user.getLastLogin().toDtoFormat(),
            lastConnection: user.getLastConnection().toDtoFormat(),
            signedIn: user.getSignedIn().toDtoFormat(),
            dayStartTime: user.getDayStartTime()
        }
    }
}