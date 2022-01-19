import {UserDto} from "../../../../domain/user/UserDto";
import {UserRow} from "./UserRow";
import {User} from "../../../../domain/user/User";
import {UserFactory} from "../../../../domain/user/UserFactory";

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