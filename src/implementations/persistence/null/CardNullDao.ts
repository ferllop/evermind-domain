import {CardDao} from '../../../domain/card/CardDao.js'
import {Card} from '../../../domain/card/Card.js'

export class CardNullDao implements CardDao {
    delete(): Promise<void> {
        throw new Error('Method not implemented')
    }

    findByAuthorId(): Promise<Card[]> {
        throw new Error('Method not implemented')
    }

    findById(): Promise<Card> {
        throw new Error('Method not implemented')
    }

    findByLabelling(): Promise<Card[]> {
        throw new Error('Method not implemented')
    }

    insert(): Promise<void> {
        throw new Error('Method not implemented')
    }

    update(): Promise<void> {
        throw new Error('Method not implemented')
    }

}