import {Authorization} from '../../src/domain/authorization/Authorization.js'

export class AlwaysAuthorizedAuthorization implements Authorization {
    assertCan(): void {
    }

    can(): boolean {
        return true
    }
}