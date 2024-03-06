export function getAssetPath(fp: string, url: string) {
    return getAssetsFileS3(fp, url)
}

const getAssetsFileS3 = (fp: string, url: string) => {
    return `https://storage.jx3openplayer.com/${encodeURIComponent(`data/${url}/${fp}`)}`
};

const getAssetsFileLocal = (fp: string, url: string) => {
    return `/data/${url}/${fp}`
};