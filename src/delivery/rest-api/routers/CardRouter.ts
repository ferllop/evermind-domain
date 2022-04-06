import {Router} from './Router.js'
import {CreateCard} from '../actions/CreateCard.js'
import {ModifyCard} from '../actions/ModifyCard.js'
import {GetCard} from '../actions/GetCard.js'
import {DeleteCard} from '../actions/DeleteCard.js'
import {TransferCard} from '../actions/TransferCard.js'

export class CardRouter extends Router {
    constructor() {
        super(
            '/cards',
            new CreateCard(),
            new ModifyCard(),
            new GetCard(),
            new DeleteCard(),
            new TransferCard(),
        )
    }
}