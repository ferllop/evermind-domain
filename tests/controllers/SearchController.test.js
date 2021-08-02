import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { CardRepository } from '../../src/storage/repositories/CardRepository.js'
import { assert, suite } from '../test-config.js'

const searchController = suite('Search Controller')

let datastore
searchController.before.each(() => {
    datastore = new InMemoryDatastore()
})

searchController('should recognize a search by label when a', () => {
    new SearchController().search('label1')
    
})
/*
recognize search by labels
recognize search by author
*/

class CardRepositoryMock extends CardRepository {
    constructor(datastore){
        super(datastore)
    }

    
    
}(datastore)
