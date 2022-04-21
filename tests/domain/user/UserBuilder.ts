import {PersonName} from '../../../src/domain/user/PersonName.js'
import {Username} from '../../../src/domain/user/Username.js'
import {DayStartTime} from '../../../src/domain/shared/value/DayStartTime.js'
import {Identification} from '../../../src/domain/shared/value/Identification.js'
import {UserIdentification} from '../../../src/domain/user/UserIdentification.js'
import {UserFactory} from '../../../src/domain/user/UserFactory.js'

export class UserBuilder {
    private id: string
    private name: string
    private username: string
    private dayStartTime: number

    constructor() { 
            this.id = UserIdentification.create().getValue()
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
        return new UserFactory().recreate(new PersonName(this.name), new Username(this.username), new DayStartTime(this.dayStartTime), Identification.recreate(this.id))
    }

    buildDto() {
        return this.build().toDto()
    }
}
