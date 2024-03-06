import data from "@/assets/taitai.json"

const weibo = data.weibo

export function checkTaitaiWeibo(name: string) {
    for (const n in weibo) {
        if (name.indexOf(n) != -1) {
            return (weibo as any)[n]
        }
    }
    return null
}