export class IdentificationMother {
    static invalidDto() {
        return { id: ''}
    }

    static dto(){
        return { id: 'the-id'}
    }

    static numberedDto(number){
        return { id: this.dto().id + number}
    }
}
