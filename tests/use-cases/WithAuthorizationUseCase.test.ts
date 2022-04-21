import {assert, suite} from '../test-config.js'
import {Response} from '../../src/use-cases/Response.js'
import {RequiredRequestFieldIsMissingError} from '../../src/domain/errors/RequiredRequestFieldIsMissingError.js'
import {WithAuthorizationUseCase, WithRequesterRequest} from '../../src/index.js'
import {InputDataNotValidError} from '../../src/domain/errors/InputDataNotValidError.js'
import {RequesterIdentification} from '../../src/domain/authorization/permission/RequesterIdentification.js'
import {UserIsNotAuthorizedError} from '../../src/domain/errors/UserIsNotAuthorizedError.js'
import {UserAuthorization} from '../../src/domain/authorization/permission/UserAuthorization.js'
import {PermissionValidator} from '../../src/domain/authorization/permission/PermissionValidator.js'
import {UserPermissions} from '../../src/domain/authorization/permission/UserPermissions.js'
import {PermissionValue} from '../../src/domain/authorization/permission/PermissionValue.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredUser,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'

class FailingPermission implements PermissionValidator<null> {
    validate(): PermissionValue[] {
        return ['CREATE_OWN_CARD'];
    }
}

class TestableUseCase extends WithAuthorizationUseCase<WithRequesterRequest, null> {
    private Permission?: new (permissions: UserPermissions) => PermissionValidator<unknown>

    constructor() {
        super(['fieldA'])
    }

    async internalExecute(): Promise<Response<null>> {
        const permissions = await this.getRequesterPermissions()
        if(this.Permission){
            UserAuthorization.userWithPermissions(permissions).assertCan(this.Permission)
        }
        return Response.OkWithoutData()
    }

    withPermission(permission: new (permission: UserPermissions) => PermissionValidator<unknown>){
        this.Permission = permission
        return this
    }
}

const useCase = suite('With authorization use Case')

useCase.before.each(async () => await givenACleanInMemoryDatabase())

useCase('should return whatever the use case return' +
    'when the required fields are present in request', async () => {
    const validRequest = {fieldA: 'someData', requesterId: 'someId'}
    assert.equal(
        await new TestableUseCase().execute(validRequest),
        Response.OkWithoutData())
})

useCase('should return REQUEST_FIELD_NOT_VALID ' +
    'when a required field is not present in request', async () => {
    const missingFieldRequest = {requesterId: 'someId'}
    assert.equal(
        await new TestableUseCase().execute(missingFieldRequest),
        Response.withDomainError(new RequiredRequestFieldIsMissingError(['fieldA'])))
})

useCase('should return REQUEST_FIELD_NOT_VALID ' +
    'when the requesterId field is not present in request', async () => {
    const missingRequesterRequest = {fieldA: 'someData'}
    assert.equal(
    // @ts-ignore
        await new TestableUseCase().execute(missingRequesterRequest),
        Response.withDomainError(new RequiredRequestFieldIsMissingError(['requesterId'])))
})

useCase(
    'given wrong requesterId, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidRequesterRequest = {
            requesterId: '',
            fieldA: 'someData',
            fieldB: 'someData',
        }
        const result = await new TestableUseCase().execute(invalidRequesterRequest)
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

useCase(
    'given a nonexistent requesterId, ' +
    'should return an object with null as data property and ' +
    'UserIsNotAuthorizedError DomainError', async () => {
        await givenAStoredUser()
        const nonexistentRequesterId = RequesterIdentification.create().getValue()
        const invalidRequesterRequest = {
            requesterId: nonexistentRequesterId,
            fieldA: 'someData',
            fieldB: 'someData',
        }
        const result = await new TestableUseCase()
            .withPermission(FailingPermission)
            .execute(invalidRequesterRequest)
        assert.equal(result, Response.withDomainError(new UserIsNotAuthorizedError(['CREATE_OWN_CARD'])))
    })

useCase(
    'given a nonexistent users table, ' +
    'should return an object with null as data property and ' +
    'UserIsNotAuthorizedError DomainError', async () => {
        const nonexistentRequesterId = RequesterIdentification.create().getValue()
        const invalidRequesterRequest = {
            requesterId: nonexistentRequesterId,
            fieldA: 'someData',
            fieldB: 'someData',
        }
        const result = await new TestableUseCase()
            .withPermission(FailingPermission)
            .execute(invalidRequesterRequest)
        assert.equal(result, Response.withDomainError(new UserIsNotAuthorizedError(['CREATE_OWN_CARD'])))
    })


useCase.run()