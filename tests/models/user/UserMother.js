import { IdentificationMother } from '../value/IdentificationMother.js'

export class UserMother {
    static TABLE_NAME = 'users'

    static dto() {
        return {
            id: IdentificationMother.dto().id,
            authId: 'validAuthId',
            name: 'validName',
            username: 'validUsername',
            email: 'valid@email.com',
            status: 0,
            lastLogin: '2020-01-02T00:00:00Z',
            lastConnection: '2020-01-03T00:00:00Z',
            signedIn: '2020-01-01T00:00:00Z',
            dayStartTime: 9
        }
    }

    static numberedDto(number) {
        const dto = this.dto()
        return {
            ...dto,
            id: dto.id + number,
            authId: dto.authId + number,
            name: dto.name + number,
            username: dto.username + number,
            email: dto.email + number,
        }
    }

    static invalidDto() {
        return {...this.dto(), authId: ''}
    }

    static isDataStored(datastore, table, id, property, expected) {
        return datastore.read(table, id)[property] === expected
    }
}
