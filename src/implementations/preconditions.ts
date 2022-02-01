import { precondition, PreconditionError } from 'preconditions'
import {Config} from './Config.js'

function evermindPrecondition(condition: boolean, message?: string) {
    if (Config.enablePreconditions) {
        process.env.ENABLE_PRECONDITIONS = 'true'
        precondition(condition, message)
    }
}

export {evermindPrecondition as precondition, PreconditionError}