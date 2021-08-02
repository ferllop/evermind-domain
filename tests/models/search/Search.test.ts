import { PreconditionError } from '../../../src/lib/preconditions.js'
import { Search } from'../../../src/models/search/Search.js'
import { assert, suite } from'../../test-config.js'

const search = suite('Search')

search('should accept only queries with at least one character', () => {
    assert.throws(() => new Search(''), (error: Error) => error instanceof PreconditionError)
})

search('should be able to provide the author when a word prefixed with at symbol is provided alone', () => {
    const search = new Search('@author')
    assert.equal(search.getAuthorUsername(),'author')
})

search('should be able to provide the author when a word prefixed with at symbol is provided in a comma separated list', () => {
    const search = new Search('@author,label1')
    assert.equal(search.getAuthorUsername(), 'author')
})

search('should be able to provide only the first author when multiple authors are provided', () => {
    const search = new Search('@author1,@author2')
    assert.equal(search.getAuthorUsername(), 'author1')
})

search('should be able to provide a label when a word is not prefixed with at symbol', () => {
    const search = new Search('label')
    assert.equal(search.getLabels()[0], 'label')
})

search('should be able to provide all labels when multiple words withouth at symbol are provided', () => {
    const search = new Search('label1,label2,label3')
    assert.equal(search.getLabels(), ['label1', 'label2', 'label3'])
})

search('should be able to provide only labels when an author and labels are provided', () => {
    const search = new Search('label1,@author,label2')
    assert.equal(search.getLabels(), ['label1', 'label2'])
})

search('should confirm that has labels', () => {
    const search = new Search('label1,@author,label2')
    assert.ok(search.hasLabels())
})

search('should confirm that not has labels', () => {
    const search = new Search('@author')
    assert.not.ok(search.hasLabels())
})

search('should confirm that has author', () => {
    const search = new Search('label1,@author,label2')
    assert.ok(search.hasAuthor())
})

search('should confirm that not has author', () => {
    const search = new Search('label1,label2')
    assert.not.ok(search.hasAuthor())
})

search('label tokens should be case insensitive', () => {
    const lowerCaseSearch = new Search('label1,label2')
    const mixedCaseSearch = new Search('LABel1,labEL2')

    assert.equal(lowerCaseSearch.getLabels(), mixedCaseSearch.getLabels())
})

search('author tokens should be case insensitive', () => {
    const lowerCaseSearch = new Search('@author')
    const mixedCaseSearch = new Search('@AUTHOR')
    assert.equal(lowerCaseSearch.getAuthorUsername(), mixedCaseSearch.getAuthorUsername())
})

search.run()
