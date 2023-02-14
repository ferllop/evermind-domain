import {Response, UseCase} from '../../src/index.js'
import { Request } from '../../src/types/index.js'

export class FakeUseCase extends UseCase<Request, any> {
    error?: Error
    responseData?: any

    constructor() {
        super([])
    }

    async internalExecute(): Promise<Response<null>> {
        if (this.error !== undefined) {
            throw this.error
        }
        if (this.responseData !== undefined) {
            return Response.OkWithData(this.responseData)
        }
        return Response.OkWithoutData()
    }

    withError(error: Error) {
        this.error = error
        return this
    }

    withResponseData(data: any) {
        this.responseData = data
        return this
    }

    withRequiredFields(...fields: string[]){
        this.requiredFields.push(...fields)
        return this
    }

}