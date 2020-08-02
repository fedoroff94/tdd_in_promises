const MyPromise = require('./promise.js')
const t = setTimeout

describe('Promise test', () => {

    let executorSpy
    let promise
    const successResult = 42
    let errorResult = 'I am error'

    beforeEach(() => {
        executorSpy = jest.fn(r => {
            t(() => r(successResult), 3000)

        })
        promise = new MyPromise(executorSpy)
    })

    test('should exists and to be typeof function', () => {
        expect(MyPromise).toBeDefined()
        expect(typeof MyPromise).toBe('function')
    })

    test('Instance should has methods then, catch, finally', () => {
        expect(promise.then).toBeDefined()
        expect(promise.catch).toBeDefined()
        expect(promise.finally).not.toBeUndefined()
    })

    test('should call executor function', () => {
        expect(executorSpy).toHaveBeenCalled()
    })

    test('should get data in then block and chain them', async () => {
        const result = await promise.then(num => num).then(num => num * 2)
        expect(result).toBe(successResult * 2)
    })

    test('should catch error', () => {
        const errorExecutor = (_, r) => {
            t(() => r(errorResult), 150)
        }
        const errorPromise = new MyPromise(errorExecutor)
        return new Promise(resolve => {
            errorPromise.catch(err => {
                expect(err).toBe(errorResult)
                resolve()
            })
        })
    })

    test('should call finally method', async () => {
        const  finallySpy = jest.fn(() => {})
        await promise.finally(finallySpy)
    })
})