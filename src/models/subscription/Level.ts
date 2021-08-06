import { Enum } from '../../helpers/Enum.js'

export class Level extends Enum {
    private static values: Level[] = []

    static LEVEL_0 = new Level(0)
    static LEVEL_1 = new Level(1)
    static LEVEL_2 = new Level(3)
    static LEVEL_3 = new Level(7)
    static LEVEL_4 = new Level(15)
    static LEVEL_5 = new Level(30)
    static LEVEL_6 = new Level(60)
    static LEVEL_7 = new Level(120)

    constructor(private value: number) {
        super(Level.getValues())
        this.value = value
    }

    getValue() {
        return this.value
    }

    next() {
        if (this.isLast()) {
            return this
        }
        return Level.getValues()[this.getOrdinal() + 1]
    }

    previous() {
        if (this.getOrdinal() == 0) {
            return this
        }
        return Level.getValues()[this.getOrdinal() - 1]
    }

    static getValues() {
        return Level.values
    }


    isLast() {
        return this.getOrdinal() == Level.getValues().length - 1
    }

}
