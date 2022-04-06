import {Router} from './Router.js'
import {SubscribeToCard} from '../actions/SubscribeToCard.js'
import {UnsubscribeToCard} from '../actions/UnsubscribeToCard.js'
import {SignUp} from '../actions/SignUp.js'
import {ModifyUser} from '../actions/ModifyUser.js'
import {GetUser} from '../actions/GetUser.js'
import {RemoveUserAccount} from '../actions/RemoveUserAccount.js'
import {GetUserSubscriptions} from '../actions/GetUserSubscriptions.js'

export class UserRouter extends Router {
    constructor() {
        super('/users',
            new SignUp(),
            new ModifyUser(),
            new GetUser(),
            new RemoveUserAccount(),
            new SubscribeToCard(),
            new UnsubscribeToCard(),
            new GetUserSubscriptions(),
        )
    }
}