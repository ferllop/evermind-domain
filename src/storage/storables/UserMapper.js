import { precondition } from '../../lib/preconditions.js'
import { User } from '../../models/user/User.js'
import { UserStatus } from '../../models/user/UserStatus.js'

export class UserMapper {
    
    /** 
     * @param {object} dto
     * @returns {boolean} 
     */
    static isDtoValid(dto) {
        return Boolean(dto) && User.isValid(dto.authID, dto.name, dto.username, dto.email, UserStatus.getByOrdinal(dto.status), dto.lastLogin, dto.lastConnection, dto.signedIn, dto.dayStartTime)
    }

    /** 
     * @param {object} dto
     * @returns {User} 
     */
    static fromDto(dto) {
        precondition(UserMapper.isDtoValid(dto))
        return new User(dto.authID, dto.name, dto.username, dto.email, UserStatus.getByOrdinal(dto.status), dto.lastLogin, dto.lastConnection, dto.signedIn, dto.dayStartTime)
    }

    /**
     * @param {User} user 
     * @returns {object}
     */
    static toDto(user) {
        return {
            authID: user.getAuthID().toString(), 
            name: user.getName(), 
            username: user.getUsername(), 
            email: user.getEmail().toString(), 
            status: user.getStatus().ordinal(), 
            lastLogin: user.getLastLogin().toDtoFormat(), 
            lastConnection: user.lastConnection.toDtoFormat(), 
            signedIn: user.getSignedIn().toDtoFormat(), 
            dayStartTime: user.getDayStartTime()
        }
    }
}
