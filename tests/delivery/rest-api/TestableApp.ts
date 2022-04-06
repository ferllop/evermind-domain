import request, {Test} from 'supertest'
import {App} from '../../../src/delivery/rest-api/app.js'
import {ApiAssertions} from './routers/ApiResponseAssertions.js'

export class TestableApp extends App {

    private lastResult?: request.Response
    private readonly request = request(this.express)

    private async getResult(request: Test, payload?: object) {
        if (!!payload) {
            return await request.send(payload)
        }
        return await request
    }

    async post(path: string, payload?: object) {
        const req = this.request.post(path)
        this.lastResult = await this.getResult(req, payload)
        return this.lastResult
    }

    async put(path: string, payload?: object) {
        const req = this.request.put(path)
        this.lastResult = await this.getResult(req, payload)
        return this.lastResult
    }

    async delete(path: string, payload?: object) {
        const req = this.request.delete(path)
        this.lastResult = await this.getResult(req, payload)
        return this.lastResult
    }

    async get(path: string, payload?: object){
        const req = this.request.get(path)
        this.lastResult = await this.getResult(req, payload)
        return this.lastResult
    }

    assert(): ApiAssertions {
        if(this.lastResult === undefined) {
            throw new Error('You must execute a request to be able to assert its result')
        }
        return new ApiAssertions(this.lastResult)
    }

}
