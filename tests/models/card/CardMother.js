import { Datastore } from '../../../src/storage/datastores/Datastore.js'
import { CardBuilder } from './CardBuilder.js'

export class CardMother {
    static CARDS_TABLE = 'cards'

    static qty
    static storedCardDto
  
    /** @param {number} qty */
    static having(qty) {
        this.qty = qty
        return this
    }
    
    /** @param {Datastore} datastore */
    static storedIn(datastore) {
        for(let i = 1; i <= this.qty; i++) {
            datastore.create(this.CARDS_TABLE, this.numberedDto(i))
        }
    }

    static cardExists(id, datastore) {
     return Boolean(datastore.read(CardMother.CARDS_TABLE, CardMother.numberedIdDto(id).id))
    }

    static storedCard(id, datastore) {
        this.storedCardDto = datastore.read(CardMother.CARDS_TABLE, CardMother.numberedIdDto(id).id)
        return this
    }

    static hasAuthorId(authorId) {
        return this.storedCardDto.authorID === authorId
    }

    static isCardDataStored(datastore) {
        return datastore.read(CardMother.CARDS_TABLE, this.idDto().id).authorID === this.dto().authorID
    }

    static standard() {
        return new CardBuilder()
            .setAuthorID(this.dto().authorID)
            .setQuestion(this.dto().question)
            .setAnswer(this.dto().answer)
            .setLabelling(this.dto().labelling)
            .build()
    }

    static dto() {
        return {
            authorID: 'authorID',
            question: 'question',
            answer: 'answer',
            labelling: ['labelling'],
            ...CardMother.idDto()
        }
    }

    static numberedDto(number) {
        const dto = this.dto()
        return {
            authorID: dto.authorID + number,
            question: dto.question + number,
            answer: dto.answer + number,
            labelling: [dto.labelling[0] + number],
            id: dto.id + number
        }
    }

    static invalidDto() {
        return { ...CardMother.dto(), ...this.invalidIdDto(), authorID:''}
    }

    static invalidIdDto() {
        return { id: ''}
    }

    static idDto(){
        return { id: 'the-id'}
    }

    static numberedIdDto(number){
        return { id: this.idDto().id + number}
    }
}
