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
export async function cache(fileid: string, loader: () => Promise<Blob>) {
    const old = await cachedb.getItem<CacheFile>(fileid)
    if (old != null) return old.file
    const file = await loader()
    await cachedb.setItem(fileid, { timesc: Date.now(), file })
    return file
}