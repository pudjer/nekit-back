import { bruteforce, bruteforceFunction } from "./bruteforce"

describe('bruteforce', () => {

    it('2', () => {
        const res = [...bruteforce(['aaaaa', 1,3,5], [3,3,3])]
        expect(res.length).toBe(12)
        const [aa, a4] = res[0]
        const [a5, a2] = res.at(-1)
        expect(aa).toBe('aaaaa')
        expect(a4).toBe(3)
        expect(a5).toBe(5)
        expect(a2).toBe(3)
    })

    it('3', () => {
        const res = [...bruteforce(['aaaaa', 1, 3, 5], [3, 3, 3], [3, 3, 3])]
        const [a5, a2, a4] = res.at(-1)
        expect(a4).toBe(3)
        expect(a5).toBe(5)
        expect(a2).toBe(3)
    })

    it('1', () => {
        const res = [...bruteforce(['aaaaa', 1, 3, 5])]
        expect(res.length).toBe(4)
    })

    it('0', () => {
        const res = [...bruteforce()]
        expect(res.length).toBe(0)
    })

    it('0', () => {
        const res = [...bruteforce([],[])]
        expect(res.length).toBe(0)
    })

    it('foo', () => {
        const foo = jest.fn((...args)=>{})
        const res = bruteforceFunction(foo)(['aaaaa', 1, 3, 5], [3, 3, 3], [3, 3, 3])
        expect(foo).toBeCalledTimes(36)
    })
})