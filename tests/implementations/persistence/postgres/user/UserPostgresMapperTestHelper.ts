import {UserPostgresMapper} from '../../../../../src/implementations/persistence/postgres/user/UserPostgresMapper.js'
import {StoredUser} from '../../../../../src/domain/user/StoredUser.js'

export class UserPostgresMapperTestHelper extends UserPostgresMapper {
    userToRow = (user: StoredUser) => {
        const {dayStartTime, ...rest} = user.toDto()
        return {
            ...rest,
            day_start_time: dayStartTime,
        }
    }
}