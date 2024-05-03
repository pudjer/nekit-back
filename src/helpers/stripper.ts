import { Model } from "mongoose"

export const striper = (tostrip: readonly string[]) => (res: any) => {
    if (typeof res !== 'object') return res
    if (res instanceof Model) res = res.toObject()
    for (const prop of tostrip) {
        if (prop in res) {
            (prop in res) && delete res[prop]
        }
    }
    return res
}