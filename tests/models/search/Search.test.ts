import { Search } from'../../../src/models/search/Search.js'
import { LabelToken } from "../../../src/models/search/token/LabelToken.js"
import { AuthorToken } from "../../../src/models/search/token/AuthorToken.js"
import { assert, suite } from'../../test-config.js'
import { PreconditionError } from '../../../src/implementations/preconditions.js'

const search = suite('Search')

search('should accept only queries with at least one character', () => {
    assert.throws(() => new Search(''), (error: Error) => error instanceof PreconditionError)
})

search('should be able to provide the author when a word prefixed with at symbol is provided alone', () => {
    const search = new Search('@author')
    assert.ok(search.getAuthorUsername().equals(new AuthorToken('author')))
})

search('should be able to provide the author when a word prefixed with at symbol is provided in a comma separated list', () => {
    const search = new Search('@author,label1')
    assert.ok(search.getAuthorUsername().equals(new AuthorToken('author')))
})

search('should be able to provide only the first author when multiple authors are provided', () => {
    const search = new Search('@author1,@author2')
    assert.ok(search.getAuthorUsername().equals(new AuthorToken('author1')))
    assert.not.ok(search.getAuthorUsername().equals(new AuthorToken('author2')))
})

search('should be able to provide a label when a word is not prefixed with at symbol', () => {
    const search = new Search('label')
    assert.equal(search.getLabels()[0], new LabelToken('label'))
})

search('should be able to provide all labels when multiple words withouth at symbol are provided', () => {
    const search = new Search('label1,label2')
    assert.equal(search.getLabels()[0], new LabelToken('label1'))
    assert.equal(search.getLabels()[1], new LabelToken('label2'))
})

search('should trim spaces between tokens', () => {
    const search = new Search('label1, label2, label3, @author')
    assert.equal(search.getLabels()[1], new LabelToken('label2'))
    assert.equal(search.getAuthorUsername(), new AuthorToken('author'))
})

search('should be able to provide only labels when an author and labels are provided', () => {
    const search = new Search('label1,@author,label2')
    assert.equal(
        search.getLabels(), 
        [
            new LabelToken('label1'), 
            new LabelToken('label2')
        ])
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
