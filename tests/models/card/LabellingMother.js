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

    /**
     * @param {number} number 
     * @param {number} labelsQty 
     * @returns {object}
     */
    static numberedDto(number, labelsQty = 1) {
        return {
            labelling: this.dtoWithXLabels(labelsQty).labelling
                .map(label => label + 'ofCard' + number)
        }
    }

    static existingLabel() {
        return 'label'
    }

    static nonExistingLabel() {
        return 'nonexistent'
    }
}
