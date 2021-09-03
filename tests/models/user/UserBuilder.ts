import { PersonName } from '../../../src/models/user/PersonName.js';
import { User } from '../../../src/models/user/User.js';
import { Username } from '../../../src/models/user/Username.js';
import { DayStartTime } from '../../../src/models/value/DayStartTime.js';
import { Identification } from '../../../src/models/value/Identification.js';
import { UserMapper } from '../../../src/storage/storables/UserMapper.js';

export class UserBuilder {
    private id: Identification
    private name: string;
    private username: string;
    private dayStartTime: DayStartTime;

    constructor() { 
            this.id = Identification.create()
            this.name = 'name'
            this.username = 'username'
            this.dayStartTime = new DayStartTime(9)
    }

    setId(id: Identification) {
        this.id = id
        return this
    }

    build() {
        return User.recreate(
            new PersonName(this.name),
            new Username(this.username),
            this.dayStartTime, 
            this.id
        )
    }

    buildDto() {
        return new UserMapper().toDto(this.build())
    }

    
}
