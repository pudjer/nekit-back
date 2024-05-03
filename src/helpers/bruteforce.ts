export const bruteforce = function*(...arrofarr: any[][]){
    if(Array.isArray(arrofarr) && arrofarr.length>0){
        const indexes = []
        for(let i = 0; i<arrofarr.length;i++ ){
            indexes.push(0)
        }
        let i = 0
        while(true){
            if (indexes[i] < arrofarr[i].length){
                if (i === 0){
                    yield pullres(indexes, arrofarr)
                }else{
                    for (let j = 0; j < i; j++) {
                        indexes[j] = 0
                    }
                }
                indexes[i]++
                if (indexes[i] < arrofarr[i].length){
                    i = 0
                }
                
            }else{
                indexes[i] = 0
                i++
                if(arrofarr.length === i) break
            }
        }  
    }
}
 
const pullres = (indexes: number[], values: any[][]) => {
    const res = []
    for(let i = 0; i<values.length;i++ ){
        res.push(values[i][indexes[i]])
    }
    return res
}

export const bruteforceFunction = (foo: (...args: any[])=>any ) => (...arrofarr: any[][]) => {
    const toexec = bruteforce(...arrofarr)
    const res = []
    for(const i of toexec){
        const foores = foo(...i)
        if(foores instanceof Promise){
            res.push(foores)
        }
    }
    return Promise.all(res)
}