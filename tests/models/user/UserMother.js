import { IdentificationMother } from '../value/IdentificationMother.js'
import { UserDto } from '../../../src/models/user/UserDto.js'

export class UserMother {
    static TABLE_NAME = 'users'

    /**
     * @returns {UserDto}
     */
    static dto() {
        return {
            id: IdentificationMother.dto().id,
            authId: IdentificationMother.dto().id,
            name: 'validName',
            username: 'validusername',
            email: 'valid@email.com',
            status: 0,
            lastLogin: '2020-01-02T00:00:00Z',
            lastConnection: '2020-01-03T00:00:00Z',
            signedIn: '2020-01-01T00:00:00Z',
            dayStartTime: 9
        }
    }

    /**
     * @param {number} number 
     * @returns {UserDto}
     */
    static numberedDto(number) {
        const dto = this.dto()
        return {
            ...dto,
            id: dto.id + number,
            authId: dto.authId + number,
            name: dto.name + number,
            username: dto.username + number,
            email: dto.email + number,
        }
    }
    /**
     * 
     * @returns {UserDto}
     */
    static invalidDto() {
        return { ...this.dto(), authId: '' }
    }

}
