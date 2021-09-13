import { Identification } from '../value/Identification.js'
import { Entity } from '../Entity.js'
import { DayStartTime } from '../value/DayStartTime.js'
import { PersonName } from './PersonName.js'
import { Username } from './Username.js'
import { Subscription } from '../subscription/Subscription.js'
import { Card } from '../card/Card.js'
import { UserIdentification } from './UserIdentification.js'
import { UserDto } from './UserDto.js'
import { UserMapper } from './UserMapper.js'

export class User extends Entity {
    static NULL = new User(PersonName.NULL, Username.NULL, new DayStartTime(9), Identification.NULL)

    subscriptions: Subscription[]

    private constructor(private name: PersonName, private username: Username, private dayStartTime: DayStartTime, id: UserIdentification) {
        super(id)
        this.subscriptions = []
    }

    static create(name: PersonName, username: Username) {
        return new User(name, username, new DayStartTime(), Identification.create())
    }

    static recreate(name: PersonName, username: Username, dayStartTime: DayStartTime, id: Identification) {
        return new User(name, username, dayStartTime, id)
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

    subscribedTo(subscriptions: Subscription[]) {
        this.subscriptions = subscriptions
        return this
    }

    subscribeTo(card: Card) {
        if (this.getSubscription(card)) {
            return null
        }
        return Subscription.create(this.getId(), card.getId())
    }

    unsubscribeFrom(card: Card) {
        const subscription = this.getSubscription(card)
        return subscription || null
    }

    getSubscription(card: Card) {
        return this.subscriptions.find(
            subscription => subscription.getCardID().equals(card.getId())
        )
    }

    apply(user: Omit<Partial<UserDto>, 'id'>) {
        const thisAsDto = new UserMapper().toDto(this)
        const modifedCard = { ...thisAsDto, ...user}
        return new UserMapper().fromDto(modifedCard)
    }

    getNull() {
        return User.NULL
    }

    static isValid(name: string, username: string, dayStartTime: number, id?: string): boolean {
        return PersonName.isValid(name) &&
            Username.isValid(username) &&
            DayStartTime.isValid(dayStartTime) &&
            (Boolean(id) ? Identification.isValid(id) : true)
    }
}
