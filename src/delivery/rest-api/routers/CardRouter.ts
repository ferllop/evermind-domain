import {Router} from './Router.js'
import {CreateCard} from '../routes/CreateCard.js'
import {ModifyCard} from '../routes/ModifyCard.js'
import {GetCard} from '../routes/GetCard.js'
import {DeleteCard} from '../routes/DeleteCard.js'
import {TransferCard} from '../routes/TransferCard.js'

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