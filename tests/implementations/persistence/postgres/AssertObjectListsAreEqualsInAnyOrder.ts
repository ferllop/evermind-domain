import {assert} from "../../../test-config";

export function assertObjectListsAreEqualsInAnyOrder<T>(listA: T[], listB: T[]) {
    assert.ok(
        listA
            .map(found => JSON.stringify(found))
            .every(found => listB.map(card => JSON.stringify(card)).includes(found)))
}