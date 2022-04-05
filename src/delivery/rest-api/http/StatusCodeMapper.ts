import {HttpStatusCode} from './HttpStatusCode.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'

export class StatusCodeMapper {
    private readonly codeMap: Map<DomainErrorCode, HttpStatusCode>

    constructor() {
        this.codeMap = new Map()
            .set(DomainErrorCode.NO_ERROR, HttpStatusCode.OK)
            .set(DomainErrorCode.UNDOCUMENTED, HttpStatusCode.INTERNAL_SERVER_ERROR)
            .set(DomainErrorCode.DATA_FROM_STORAGE_NOT_VALID, HttpStatusCode.INTERNAL_SERVER_ERROR)
            .set(DomainErrorCode.INPUT_DATA_NOT_VALID, HttpStatusCode.BAD_REQUEST)
            .set(DomainErrorCode.USER_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST)
            .set(DomainErrorCode.CARD_ALREADY_EXISTS, HttpStatusCode.BAD_REQUEST)
            .set(DomainErrorCode.USER_IS_ALREADY_SUBSCRIBED_TO_CARD, HttpStatusCode.BAD_REQUEST)
            .set(DomainErrorCode.REQUIRED_REQUEST_FIELD_IS_MISSING, HttpStatusCode.BAD_REQUEST)
            .set(DomainErrorCode.PERSISTENCE_METHOD_NOT_DECLARED, HttpStatusCode.BAD_REQUEST)
            .set(DomainErrorCode.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND)
            .set(DomainErrorCode.CARD_NOT_FOUND, HttpStatusCode.NOT_FOUND)
            .set(DomainErrorCode.SUBSCRIPTION_NOT_FOUND, HttpStatusCode.NOT_FOUND)
    }

    getHttpStatusCode(domainErrorCode: DomainErrorCode) {
        return this.codeMap.get(domainErrorCode) ?? HttpStatusCode.INTERNAL_SERVER_ERROR
    }

    setHttpStatusCode(domainErrorCode: DomainErrorCode, httpStatusCode: HttpStatusCode) {
        return this.codeMap.set(domainErrorCode, httpStatusCode)
    }
}