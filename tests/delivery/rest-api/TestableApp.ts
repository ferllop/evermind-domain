import request from 'supertest'
import {App} from '../../../src/delivery/rest-api/app.js'

export class TestableApp extends App {

    private request(){
        return request(this.express)
    }

    post(path: string){
        return this.request().post(path)
    }

    put(path: string){
        return this.request().put(path)
    }

    delete(path: string){
        return this.request().delete(path)
    }

    get(path: string){
        return this.request().get(path)
    }

}