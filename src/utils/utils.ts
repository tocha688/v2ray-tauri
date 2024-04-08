export function margen(...objs: any[]) {
    let data: any = objs[0] instanceof Array ? [] : {};
    objs.forEach((obj: any) => {
        (function deep(obj) {
            Object.keys(obj).forEach(key => {
                if (!data[key]) {
                    data[key] = obj[key]
                    return;
                }
                if (typeof obj[key] == "object") {
                    data[key] = margen(data[key], obj[key])
                }else{
                    data[key] = obj[key]
                }
            })
        })(obj)
    })
    return data;
}