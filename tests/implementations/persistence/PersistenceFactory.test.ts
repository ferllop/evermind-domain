import {assert, suite} from '../../test-config.js'
import {PersistenceFactory} from '../../../src/implementations/persistence/PersistenceFactory.js'
import {CardPostgresDao} from '../../../src/implementations/persistence/postgres/card/CardPostgresDao.js'
import {CardInMemoryDao} from '../../../src/implementations/persistence/in-memory/CardInMemoryDao.js'
import {DomainError} from '../../../src/domain/errors/DomainError.js'
import {ErrorType} from '../../../src/domain/errors/ErrorType.js'
import {Config} from '../../../src/implementations/Config.js'

const persistenceFactory = suite('Persistence Factory')

persistenceFactory.before.each(() => {Config.persistenceType = undefined})

persistenceFactory('should throw error when no persistence type is provided', () => {
    assert.throws(
        () => PersistenceFactory.getCardDao(),
        (error: any) => error instanceof DomainError
            && error.getCode() === ErrorType.PERSISTENCE_METHOD_NOT_DECLARED)
})

persistenceFactory('should throw error when an unexisting persistence type is provided', () => {
    Config.persistenceType = 'unexisting-persistence-type'
    assert.throws(
        () => PersistenceFactory.getCardDao(),
        (error: any) => error instanceof DomainError
            && error.getCode() === ErrorType.PERSISTENCE_METHOD_NOT_DECLARED)
})

persistenceFactory('should provide CardPostgresDao when postgres is provided as type', () => {
    Config.persistenceType = 'postgres'
    assert.instance(PersistenceFactory.getCardDao(), CardPostgresDao)
})

persistenceFactory('should provide CardInMemoryDao when memory is provided as type', () => {
    Config.persistenceType = 'memory'
    assert.instance(PersistenceFactory.getCardDao(), CardInMemoryDao)
})

persistenceFactory.run()