import {UserDto} from 'evermind-types'
import {UserRow} from './UserRow.js'
import {UserFactory} from '../../../../domain/user/UserFactory.js'
import {StoredUser} from '../../../../domain/user/StoredUser.js'

export class UserPostgresMapper {
    postgresToDtoMap: Record<string, keyof UserDto> = {
        id: 'id',
        name: 'name',
        username: 'username',
        day_start_time: 'dayStartTime',
    }

    rowToUser = (row: UserRow): StoredUser => {
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