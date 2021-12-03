import { Level } from '../../../src/domain/subscription/Level.js'
import { assert, suite } from '../../test-config.js'

const level = suite('Level')

level('should know which level is next', () => {
    const level0 = Level.LEVEL_0
    assert.equal(level0.next(), Level.LEVEL_1)
})

level('should know which level is previous', () => {
    const level7 = Level.LEVEL_7
    assert.equal(level7.previous(), Level.LEVEL_6)
})

level('should return itself when asking about next when level is last', () => {
    const lastLevel = Level.getValues()[Level.getValues().length -1]
    assert.equal(lastLevel.next(), lastLevel)
})

level('should return itself when asking about previous when level is the first', () => {
    const firstLevel = Level.getValues()[0]
    assert.equal(firstLevel.previous(), firstLevel)
})

level('should have a value', () => {
    assert.equal(Level.LEVEL_7.getValue(), 120)
})

level.run()
