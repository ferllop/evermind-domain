import { IdentificationMother } from '../value/IdentificationMother.js'
import { UserDto } from '../../../src/models/user/UserDto.js'
import { Mother } from "../../models/Mother.js"
import { User } from '../../../src/models/user/User.js'
import { UserBuilder } from './UserBuilder.js'
import { Identification } from '../../../src/models/value/Identification.js'
import { UserMapper } from '../../../src/storage/storables/UserMapper.js'

export class UserMother implements Mother<UserDto> {
    
    TABLE_NAME = 'users'
    user: User = new UserBuilder().build()

    standard() {
        return new UserMapper().fromDto(this.dto())
    }

    dto(): UserDto {
        return {
            id: IdentificationMother.dto().id,
            name: 'validName',
            username: 'validusername',
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
        this.user = new UserBuilder().setId(new Identification(id)).build()
        return this
    }

    getDto() {
       return new UserMapper().toDto(this.user) 
    }

}
