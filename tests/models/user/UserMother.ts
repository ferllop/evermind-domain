import { IdentificationMother } from '../value/IdentificationMother.js'
import { UserDto } from '../../../src/models/user/UserDto.js'
import { Mother } from '../../storage/datastores/DatastoreMother.js'

export class UserMother implements Mother<UserDto> {
    
    TABLE_NAME = 'users'

    dto(): UserDto {
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

    numberedDto(number: number): UserDto {
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

    invalidDto(): UserDto {
        return { ...this.dto(), authId: '' }
    }

}
