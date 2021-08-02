import { precondition } from '../../lib/preconditions.js'
import { User } from '../../models/user/User.js'
import { Identified } from '../datastores/Identified.js'
import { UserDto } from '../../models/user/UserDto.js'

export class UserMapper {
    
    /** 
     * @param {UserDto} dto
     * @returns {boolean} 
     */
    static isDtoValid(dto) {
        return Boolean(dto) && User.isValid(dto.authId, dto.name, dto.username, dto.email, dto.status, dto.lastLogin, dto.lastConnection, dto.signedIn, dto.dayStartTime, dto.id)
    }

    /** 
     * @param {UserDto} dto
     * @returns {User} 
     */
    static fromDto(dto) {
        precondition(UserMapper.isDtoValid(dto))
        return new User(dto.authId, dto.name, dto.username, dto.email, dto.status, dto.lastLogin, dto.lastConnection, dto.signedIn, dto.dayStartTime, dto.id)
    }

    /**
     * @param {User} user 
     * @returns {Identified & any}
     */
    static toDto(user) {
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
