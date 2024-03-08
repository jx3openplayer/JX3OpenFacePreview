import localforage from 'localforage'

export function getAssetPath(fp: string, url: string) {
    return getAssetsFileS3(fp, url)
}

const getAssetsFileS3 = (fp: string, url: string) => {
    return `https://storage.jx3openplayer.com/${encodeURIComponent(`data/${url}/${fp}`)}`
};

const getAssetsFileLocal = (fp: string, url: string) => {
    return `/data/${url}/${fp}`
};

export async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const cachedb = localforage.createInstance({
    name: 'cache',
})

interface CacheFile {
    timesc: number
    file: Blob
}

export async function cache(fileid: string, loader: () => Promise<Blob>, timeout?: number) {
    const old = await cachedb.getItem<CacheFile>(fileid)
    if (old != null) {
        if (timeout && Date.now() - old.timesc > timeout) {
            const update = async () => {
                const file = await loader()
                await cachedb.setItem(fileid, { timesc: Date.now(), file })
            }
            update()
        }
        return old.file
    }
    const file = await loader()
    await cachedb.setItem(fileid, { timesc: Date.now(), file })
    return file
}

export async function cacheurl(url: string) {
    const old = await cachedb.getItem<CacheFile>(url)
    if (old != null) return old.file
    const file = await (await fetch(url)).blob()
    await cachedb.setItem(url, { timesc: Date.now(), file })
    return file
}

interface CacheJson {
    timesc: number
    json: any
}

export async function cachejson(url: string) {
    const old = await cachedb.getItem<CacheJson>(url)
    const update = async () => {
        const file = await (await fetch(url)).json()
        await cachedb.setItem(url, { timesc: Date.now(), json: file })
        return file
    }
    if (old != null) {
        update()
        return old.json
    }
    return await update()
}

interface IndexDataSource {
    [key: string]: {
        [key: string]: any[],
    }
}

// const dbVersion = 1
// const storename = 'face-db'

// const openReq = indexedDB.open(storename, dbVersion)
// openReq.onupgradeneeded = (event: any) => {
//     let db = event.target.result
//     if (!db.objectStoreNames.contains("index")) {
//         const s = db.createObjectStore("index")
//         s.createIndex("")
//     }
// }

const config = localforage.createInstance({
    name: 'config',
})


let indexfile: IndexDataSource | null = null

/**
 * 准备索引数据
 * 可能有几种情况：
 * 1. 用户第一次访问，则数据库中不存在索引文件，必须重新下载。此时应该先通知其他组件显示提示信息。
 * 2. 用户第二次访问，已经存在索引文件，因此可以先返回已有的数据，然后异步下载更新新的数据，在更新完成后通知其他组件显示刷新信息。
 */
export async function prepareIndexData(firstDownload: () => void) {
    const oldindex = await config.getItem<IndexDataSource>('index')
    if (oldindex != null) {
        indexfile = oldindex
    } else {
        firstDownload()
    }
    await updateIndexData()
}

async function updateIndexData() {
    const r = await fetch(`https://storage.jx3openplayer.com/${encodeURIComponent('data/faces-index.json')}`)
    const j = await r.json() as IndexDataSource
    indexfile = j
    await config.setItem("index", j)
    console.log("索引更新完成！")
    return j
}

export async function getIndexData(): Promise<IndexDataSource> {
    if (indexfile != null) {
        return indexfile
    }
    return new Promise((res) => {
        const h = setInterval(() => {
            if (indexfile != null) {
                res(indexfile)
                clearInterval(h)
            }
        }, 50)
    })
}

interface ConfigData {
    taitai: {
        weibo: {
            [key: string]: string
        }
    },
    fakehair: string[],
    faceoff: number,
}

let configdata: ConfigData = {
    taitai: {
        weibo: {}
    },
    fakehair: [],
    faceoff: 1
}

export async function updateConfig() {
    let oldconfig = await config.getItem<ConfigData>("config")
    if (oldconfig != null) {
        configdata = oldconfig
    }
    const r = await fetch(`https://storage.jx3openplayer.com/${encodeURIComponent('data/faces-config.json')}`)
    const j = await r.json() as ConfigData
    configdata = j
    await config.setItem("config", j)
    return j
}

export function getConfig() {
    return configdata
}

export interface IndexMapItem {
    id: string
    name: string
    sex: 'girl' | 'female' | 'man' | 'boy'
    p?: number
    style: 'real' | 'fantacy'
    time: number
}
let indexMap: {
    [key: string]: IndexMapItem
} | null = null

function _generateMap(_dataSource: IndexDataSource) {
    let obj: any = {};
    for (let sexType in _dataSource) {
        for (let faceType in _dataSource[sexType]) {
            for (let face of _dataSource[sexType][faceType]) {
                let _face = {
                    ...face,
                    sex: sexType,
                    style: faceType,
                };
                obj[face.id] = _face;
            }
        }
    };
    indexMap = obj
}
export async function generateIdMap() {
    let _dataSource = await getIndexData();
    if (indexMap === null) {
        _generateMap(_dataSource)
    }
    return indexMap!;
}