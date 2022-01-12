import { PreconditionError } from '../../../src/implementations/preconditions.js'
import { Hour } from '../../../src/domain/shared/value/Hour.js'
import { assert, suite } from '../../test-config.js'

const hour = suite("Hour")

hour('should know how to insert itself into a given date', () => {
    const date = new Date('Mon Jul 12 2021 10:10:10 GMT+0200')
    const actualHours = date.getHours()
    const modifiedDate = new Hour(actualHours + 1).setIntoDate(date)
    assert.equal(modifiedDate.getHours(), actualHours + 1)
})

hour('should accept only values equal to 0 or greater', () => {
    assert.throws(() => new Hour(-1), (error: Error) => error instanceof PreconditionError)
})

hour('should accept only values equal to 23 or less', () => {
    assert.throws(() => new Hour(24), (error: Error) => error instanceof PreconditionError)
})

hour.run()
