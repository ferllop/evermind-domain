import {assert} from "../../../test-config";

export function assertObjectListsAreEqualsInAnyOrder<T>(listA: T[], listsB: T[]) {
    assert.ok(
        listA
            .map(found => JSON.stringify(found))
            .every(found => listsB.map(card => JSON.stringify(card)).includes(found)))
}