import { DateISO } from '../value/DateISO'

export type UserDto = {
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
