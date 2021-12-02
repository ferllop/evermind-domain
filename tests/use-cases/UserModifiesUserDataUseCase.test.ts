import { ErrorType } from '../../src/models/errors/ErrorType.js'
import { Datastore } from '../../src/models/Datastore.js'
import { Response } from '../../src/use-cases/Response.js'
import { UserMother } from '../models/user/UserMother.js'
import { assert, suite } from '../test-config.js'
import { ImplementationsContainer } from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../src/implementations/implementations-container/Dependency.js'
import { UserModifiesUserDataUseCase } from '../../src/use-cases/UserModifiesUserDataUseCase.js'
import { DatastoreMother } from '../models/DatastoreMother.js'
import { InMemoryDatastore } from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'

const userModifiesUserDataUseCase = suite("User modifies user data use case")

let datastore: Datastore
userModifiesUserDataUseCase.before.each(() => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
    datastore = ImplementationsContainer.get(Dependency.DATASTORE) as Datastore
})

userModifiesUserDataUseCase(
    'given an unexisting table, ' +
    'should return an object with null as data property and ' +
    'RESOURCE_NOT_FOUND DomainError', async () => {
        const result = await new UserModifiesUserDataUseCase().execute(new UserMother().dto())
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userModifiesUserDataUseCase(
    'given a previously stored user and data to update it, ' +
    'the user should be updated in storage', async () => {
        const dsMother = await new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
        const newName = 'newName'
        await new UserModifiesUserDataUseCase().execute({ ...new UserMother().numberedDto(1), name: newName })
        assert.ok((await dsMother.stored(1)).hasPropertyValue('name', newName))
    })

userModifiesUserDataUseCase(
    'given a previously stored user and data to update it, ' +
    'should return an object with null as error property and ' +
    'null as data property', async () => {
        await new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
        const result = await new UserModifiesUserDataUseCase().execute({ ...new UserMother().numberedDto(1), name: 'newName' })
        assert.equal(result, Response.OkWithoutData())
    })

userModifiesUserDataUseCase(
    'given an unexisting user in an existing table, ' +
    'should return an object with null as data property and ' +
    'RESOURCE_NOT_FOUND DomainError', async () => {
        await new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
        const result = await new UserModifiesUserDataUseCase().execute({ ...new UserMother().numberedDto(1), id: 'notExistingId' })
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userModifiesUserDataUseCase(
    'given wrong user data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', async () => {
        const result = await new UserModifiesUserDataUseCase().execute(new UserMother().invalidDto())
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userModifiesUserDataUseCase.run()
