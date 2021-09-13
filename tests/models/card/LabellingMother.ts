export class LabellingMother {
    static dto() {
        return {labelling: [this.existingLabel()]}
    }

    static dtoWithXLabels(labelsQty = 1) {
        return {
            labelling: Array(labelsQty)
                .fill(this.existingLabel())
                .map((label, index) => label + index)
        }
    }

    static numberedDto(number: number, labelsQty: number = 1) {
        return {
            labelling: this.dtoWithXLabels(labelsQty).labelling
                .map(label => label + 'ofcard' + number)
        }
    }

    static invalidDto()  {
        return {
            labelling: ['label#1']
        }
    }

    static existingLabel() {
        return 'label'
    }

    static nonExistingLabel() {
        return 'nonexistent'
    }
}
