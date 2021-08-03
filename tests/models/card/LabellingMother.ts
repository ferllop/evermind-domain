import { Labelling } from '../../../src/models/card/Labelling.js'

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

    static numberedDto(number: number, labelsQty: number = 1): object {
        return {
            labelling: new Labelling(this.dtoWithXLabels(labelsQty).labelling
                .map(label => label + 'ofCard' + number)).getLabels()
        }
    }

    static existingLabel() {
        return 'label'
    }

    static nonExistingLabel() {
        return 'nonexistent'
    }
}
