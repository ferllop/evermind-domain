import { Identified } from '../../storage/datastores/Identified'
import { DateISO } from '../value/DateISO'

export type UserDto = Identified & {
    authId: string, 
    name: string, 
    username: string, 
    email: string, 
    status: number, 
    lastLogin: DateISO, 
    lastConnection: DateISO, 
    signedIn: DateISO, 
    dayStartTime: number
}
