import { performance } from 'perf_hooks'

export function uuid() {
    return performance.now().toString(36) + 
        Math.random().toString(36).substr(2)
}
