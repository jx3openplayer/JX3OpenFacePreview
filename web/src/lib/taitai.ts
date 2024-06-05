import { getConfig } from "./assets"


export function checkTaitaiWeibo(name: string) {
    const weibo = getConfig().taitai.weibo
    for (const n in weibo) {
        if (name.indexOf(n) != -1) {
            return (weibo as any)[n]
        }
    }
    return null
}