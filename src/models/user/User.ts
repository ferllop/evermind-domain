import { Identification } from '../value/Identification.js'
import { Entity } from '../Entity.js'
import { DayStartTime } from '../value/DayStartTime.js'
import { PersonName } from './PersonName.js'
import { Username } from './Username.js'
import { Card } from '../card/Card.js'
import { Subscription } from '../subscription/Subscription.js'

export class User extends Entity {

    constructor(private name: PersonName, private username: Username, private dayStartTime: DayStartTime, id: Identification) {
        super(id)
    }

    static create(name: PersonName, username: Username) {
        return new User(name, username, new DayStartTime(), Identification.create())
    }

    getName() {
        return this.name
    }

    getUsername() {
        return this.username
    }

    getDayStartTime() {
        return this.dayStartTime
    }

    subscribe(card: Card) {
        return Subscription.create(this.getId(), card.getId())        
    }

    static isValid(name: string, username: string, dayStartTime: number, id?: string): boolean {
        return PersonName.isValid(name) &&
            Username.isValid(username) &&
            DayStartTime.isValid(dayStartTime) &&
            (Boolean(id) ? Identification.isValid(id) : true)
    }
}
