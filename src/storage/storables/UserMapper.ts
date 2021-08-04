import { precondition } from '../../lib/preconditions.js'
import { User } from '../../models/user/User.js'
import { Identified } from '../datastores/Identified.js'
import { UserDto } from '../../models/user/UserDto.js'
import { Mapper } from './Mapper.js'

export class UserMapper implements Mapper<User, UserDto> {
    isDtoValid(dto: UserDto): boolean {
        return UserMapper.isDtoValid(dto)
    }
    fromDto(dto: Identified<UserDto>): User {
        return UserMapper.fromDto(dto)
    }
    toDto(entity: User): Identified<UserDto> {
        return UserMapper.toDto(entity)
    }
    
    
    static isDtoValid(dto: UserDto): boolean {
        return Boolean(dto) && User.isValid(dto.authId, dto.name, dto.username, dto.email, dto.status, dto.lastLogin, dto.lastConnection, dto.signedIn, dto.dayStartTime)
    }

    
    static fromDto(dto: Identified<UserDto>): User {
        precondition(UserMapper.isDtoValid(dto))
        return new User(dto.authId, dto.name, dto.username, dto.email, dto.status, dto.lastLogin, dto.lastConnection, dto.signedIn, dto.dayStartTime, dto.id)
    }

    static toDto(user: User): Identified<UserDto> {
        return {
            id: user.getId().toString(),
            authId: user.getAuthId().toString(), 
            name: user.getName(), 
            username: user.getUsername(), 
            email: user.getEmail().toString(), 
            status: user.getStatus().ordinal(), 
            lastLogin: user.getLastLogin().toDtoFormat(), 
            lastConnection: user.getLastConnection().toDtoFormat(), 
            signedIn: user.getSignedIn().toDtoFormat(), 
            dayStartTime: user.getDayStartTime()
        }
    }
}
