import { Identified } from '../../../src/storage/datastores/Identified.js'

export class IdentificationMother {
    /**
     * @returns {Identified}
     */
    static invalidDto() {
        return { id: ''}
    }

    /**
     * @returns {Identified}
     */
    static dto(){
        return { id: 'the-id'}
    }

    /**
     * @param {number} number 
     * @returns {Identified}
     */
    static numberedDto(number){
        return { id: this.dto().id + number}
    }
}
