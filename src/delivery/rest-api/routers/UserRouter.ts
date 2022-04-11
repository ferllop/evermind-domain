import {Router} from './Router.js'
import {SubscribeToCard} from '../routes/SubscribeToCard.js'
import {UnsubscribeToCard} from '../routes/UnsubscribeToCard.js'
import {SignUp} from '../routes/SignUp.js'
import {ModifyUser} from '../routes/ModifyUser.js'
import {GetUser} from '../routes/GetUser.js'
import {RemoveUserAccount} from '../routes/RemoveUserAccount.js'
import {GetUserSubscriptions} from '../routes/GetUserSubscriptions.js'

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