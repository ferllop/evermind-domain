import { PersonName } from '../../../src/models/user/PersonName.js';
import { User } from '../../../src/models/user/User.js';
import { Username } from '../../../src/models/user/Username.js';
import { DayStartTime } from '../../../src/models/value/DayStartTime.js';
import { Identification } from '../../../src/models/value/Identification.js';
import { UserMapper } from '../../../src/models/user/UserMapper.js';

export class UserBuilder {
    private id: string
    private name: string;
    private username: string;
    private dayStartTime: number;

    constructor() { 
            this.id = 'anId'
            this.name = 'aName'
            this.username = 'aUsername'
            this.dayStartTime = 9
    }

    setId(id: string) {
        this.id = id
        return this
    }

    setName(name: string) {
        this.name = name
        return this
    }

    setUsername(username: string) {
        this.username = username
        return this
    }

    setDayStartTime(number: number) {
        this.dayStartTime = number
        return this
    }

    build() {
        return User.recreate(
            new PersonName(this.name),
            new Username(this.username),
            new DayStartTime(this.dayStartTime), 
            Identification.recreate(this.id)
        )
    }

    buildDto() {
        return new UserMapper().toDto(this.build())
    }

    
}
