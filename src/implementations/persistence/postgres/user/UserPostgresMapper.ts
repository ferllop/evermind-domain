import {UserDto} from '../../../../domain/user/UserDto.js'
import {UserRow} from './UserRow.js'
import {User} from '../../../../domain/user/User.js'
import {UserFactory} from '../../../../domain/user/UserFactory.js'

export class UserPostgresMapper {
    postgresToDtoMap: Record<string, keyof UserDto> = {
        id: 'id',
        name: 'name',
        username: 'username',
        day_start_time: 'dayStartTime',
    }

    rowToUser = (row: UserRow): User => {
        const userDto = Object.keys(row).reduce((accum, key) => {
            const value = row[key as keyof UserRow]
            return {
                ...accum,
                [this.postgresToDtoMap[key]]: value
            }

        }, {})

        return new UserFactory().fromDto(userDto as UserDto)
    }
}