import {assert, suite} from '../../test-config.js'
import {PersistenceFactory} from '../../../src/implementations/persistence/PersistenceFactory.js'
import {CardPostgresDao} from '../../../src/implementations/persistence/postgres/card/CardPostgresDao.js'
import {CardInMemoryDao} from '../../../src/implementations/persistence/in-memory/CardInMemoryDao.js'
import {Config} from '../../../src/implementations/Config.js'
import {PersistenceMethodNotDeclaredError} from '../../../src/domain/errors/PersistenceMethodNotDeclaredError.js'
import {AlwaysAuthorizedAuthorization} from '../AlwaysAuthorizedAuthorization.js'
import {Authorization} from '../../../src/domain/authorization/Authorization.js'

type Context = {
    stub: Authorization
}

const persistenceFactory = suite<Context>('Persistence Factory')

persistenceFactory.before.each((context) => {
    context.stub = new AlwaysAuthorizedAuthorization()
})

persistenceFactory('should throw error when no persistence type is provided', ({stub}) => {
    Config.persistenceType = undefined
    assert.throws(
        () => PersistenceFactory.getCardDao(stub),
        (error: Error) => error instanceof PersistenceMethodNotDeclaredError)
})

persistenceFactory('should throw error when an unexisting persistence type is provided', ({stub}) => {
    Config.persistenceType = 'unexisting-persistence-type'
    assert.throws(
        () => PersistenceFactory.getCardDao(stub),
        (error: Error) => error instanceof PersistenceMethodNotDeclaredError)
})

persistenceFactory('should provide CardPostgresDao when postgres is provided as type', ({stub}) => {
    Config.persistenceType = 'postgres'
    assert.instance(PersistenceFactory.getCardDao(stub), CardPostgresDao)
})

persistenceFactory('should provide CardInMemoryDao when memory is provided as type', ({stub}) => {
    Config.persistenceType = 'memory'
    assert.instance(PersistenceFactory.getCardDao(stub), CardInMemoryDao)
})

persistenceFactory.run()