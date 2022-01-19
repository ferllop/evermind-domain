import {UserPostgresMapper} from '../../../../../src/implementations/persistence/postgres/user/UserPostgresMapper'
import {User} from '../../../../../src/domain/user/User'

export class UserPostgresMapperTestHelper extends UserPostgresMapper {
    userToRow = (user: User) => {
        const {dayStartTime, ...rest} = user.toDto()
        return {
            ...rest,
            day_start_time: dayStartTime,
        }
    }
}