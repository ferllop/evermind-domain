import { assert, suite } from './test-config.js'

const testRunner = suite('TestRunner')

testRunner('should run tests', () => {
  assert.ok(true)
  assert.not.ok(false)
})

testRunner.run()
