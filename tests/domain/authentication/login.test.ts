import {assert, suite} from '../../test-config.js'
import {DomainErrorCode, Response, UseCase} from '../../../src/index.js'
import {DomainError} from '../../../src/domain/errors/DomainError.js'
import {UserRepository} from '../../../src/domain/user/UserRepository.js'
import {Email} from '../../../src/domain/user/Email.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredUser,
} from '../../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'

type TokenDto = { token: string }

class Token {
    constructor(private readonly value: string){}

    getValue() {
        return this.value
    }

    toDto() {
        return {token: this.value}
    }
}

interface TokenGenerator {
    generateToken(): Promise<Token>
}

class TokenGeneratorStub implements TokenGenerator {
    generateToken(): Promise<Token> {
        return Promise.resolve(new Token('the-token'))
    }

}

type UserLogsInRequest = { email: string, pass: string }

class UserLogsInUseCase extends UseCase<UserLogsInRequest, TokenDto | null> {
    constructor(private tokenGenerator: TokenGenerator) {
        super(['email', 'pass'])
    }

    protected async internalExecute(request: UserLogsInRequest): Promise<Response<TokenDto | null>> {
        const user = await new UserRepository().findByEmail(new Email(request.email))
        if (user.isNull()) {
            throw new FailedLoginError()
        }
        const token = await this.tokenGenerator.generateToken()
        return Response.OkWithData(token.toDto())
    }
}

class FailedLoginError extends DomainError {
    constructor() {
        super(DomainErrorCode.LOGIN_FAILS, 'Login fails')
    }
}

const login = suite('User login use case')

login.before.each(async () => {
    await givenACleanInMemoryDatabase()
})

login('should return a token when the one time password is valid', async () => {
    const user = await givenAStoredUser()
    const request = {
        email: user.email,
        pass: 'the-one-time-password',
    }
    const result = await new UserLogsInUseCase(new TokenGeneratorStub()).execute(request)
    assert.equal(result, Response.OkWithData({token: 'the-token'}))
})

login('should return a FailedLoginError when email not exists', async () => {
    const request = {
        email: 'non-existing@example.com',
        pass: 'the-one-time-password',
    }
    const result = await new UserLogsInUseCase(new TokenGeneratorStub()).execute(request)
    assert.equal(result, Response.withDomainError(new FailedLoginError()))
})

login.run()