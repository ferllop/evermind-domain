import {DomainError} from '../../../../src/domain/errors/DomainError.js'
import {assert} from '../../../test-config.js'
import request from 'supertest'
import {Response, Response as DomainResponse} from '../../../../src/use-cases/Response.js'

export class ApiAssertions {
    constructor(private response: request.Response) {}

    hasStatusCode(code: number) {
        assert.equal(this.response.status, code)
        return this
    }

    hasEmptyData() {
        assert.equal(this.response.body, {})
        return this
    }

    domain() {
        return new DomainResponseAssertions(this.response.body.domain)
    }
}

class DomainResponseAssertions {
    constructor(private domainResponse: DomainResponse<any>) {}

    hasError(error: DomainError) {
        this.is(Response.withDomainError(error))
        return this
    }

    hasData(data: object) {
        this.is(Response.OkWithData(data))
        return this
    }

    is(domainResponse: DomainResponse<any>) {
        assert.equal(this.domainResponse, {...domainResponse})
        return this
    }
}