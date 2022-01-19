import { IdentificationMother } from '../value/IdentificationMother.js'
import { UserDto } from '../../../src/domain/user/UserDto.js'
import { Mother } from "../shared/Mother.js"
import { User } from '../../../src/domain/user/User.js'
import { UserBuilder } from './UserBuilder.js'
import { UserFactory } from '../../../src/domain/user/UserFactory.js'

export class UserMother implements Mother<UserDto> {
    
    TABLE_NAME = 'users'
    user: User = new UserBuilder().build()

    standard() {
        return new UserFactory().fromDto(this.dto())
    }

    dto(): UserDto {
        return {
            id: IdentificationMother.dto().id,
            name: 'validName',
            username: 'valid-username',
            dayStartTime: 9
        }
    }

    numberedDto(number: number): UserDto {
        const dto = this.dto()
        return {
            ...dto,
            id: dto.id + number,
            name: dto.name + number,
            username: dto.username + number,
        }
    }

    invalidDto(): UserDto {
        return { ...this.dto(), name: '' }
    }

    withId(id: string) {
        this.user = new UserBuilder().setId(id).build()
        return this
    }

    getDto() {
       return this.user.toDto()
    }

}
