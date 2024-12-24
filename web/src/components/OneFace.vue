<script setup lang="ts">
import { NCard, NImage, NImageGroup, NFlex, NButton, NTime, NBadge, NTag, NTooltip, NFloatButton, NIcon, useMessage } from 'naive-ui'
import { ref, onMounted, inject, type Ref, watch } from 'vue';
import { saveAs } from 'file-saver'
import { type CollectData, collectEvents } from '@/interface/face'
import localforage from 'localforage'
import { getAssetPath, cache, cacheurl, getConfig, recordDownload } from '@/lib/assets'
import { checkTaitaiWeibo } from '@/lib/taitai'
import { panelEvents } from '@/interface/panels'
const {
    facestyle,
    sex,
    id,
    facesize,
    hideSide,
    name,
    time,
    likes,
    suffix,
    price,
    code,
} = defineProps<{
    facestyle: string,
    sex: string,
    id: string,
    facesize: string,
    hideSide?: boolean,
    name: string,
    time: Date,
    likes?: number,
    suffix?: string,
    price?: number,
    code?: string,
}>()

const message = useMessage()
const url = `${facestyle}/${sex}/${id}`

// const getAssetsFile = (fp: string) => {
//     return `/data/${url}/${fp}`
// };

const getAssetsFile = (fp: string) => {
    return getAssetPath(fp, url)
};

const downloadButton = async () => {
    if (facestyle === "real") {
        saveAs(await cacheurl(getAssetsFile('face.ini')), `${name}.ini`)
    } else {
        saveAs(await cacheurl(getAssetsFile('face.dat')), `${name}.dat`)
    }
    await recordDownload(id)
    fetch(`/api/update?type=download&id=${id}`, { method: "post" })
}

const fclass = ref("face-img")

if (facesize === "medium") {
    fclass.value = "face-img-mid"
}

if (facesize === "large") {
    fclass.value = "face-img-large"
}

const lovedb = localforage.createInstance({
    name: 'love_face',
})

const collectdb = localforage.createInstance({
    name: 'collect_face',
})

interface LoveData {
    id: string,
    time: number,
    sex: string,
    style: string
}

const isLove = ref(false)
const isCollect = ref(false)

const weibo = ref<null | string>(null)
const tmpLove = ref(0)

const onefaceWhat = ref<'front' | 'side'>('front')

const off = ref(1)
onMounted(async () => {
    isLove.value = await lovedb.getItem<LoveData>(id) != null
    isCollect.value = await collectdb.getItem<CollectData>(id) != null
    weibo.value = checkTaitaiWeibo(name)
    collectEvents.on('remove', async (mid: string) => {
        if (mid === id) {
            isCollect.value = false
            collectdb.removeItem(id)
        }
    })
    getImage("face_front.jpg", "front")
    getImage("face_side.jpg", "side")
    const cfg = await getConfig()
})

const changeLove = () => {
    if (isLove.value) {
        isLove.value = false
        lovedb.removeItem(id)
        fetch(`/api/update?type=dislike&id=${id}`, { method: "post" })
        if (tmpLove.value === 0) {
            tmpLove.value = -1
        } else {
            tmpLove.value = 0
        }

    } else {
        isLove.value = true
        lovedb.setItem<LoveData>(id, {
            id: id,
            time: time.getTime(),
            sex: sex,
            style: facestyle
        })
        fetch(`/api/update?type=like&id=${id}`, { method: "post" })
        tmpLove.value = 1
    }
}


const changeCollect = async () => {
    if (isCollect.value) {
        isCollect.value = false
        await collectdb.removeItem(id)
        panelEvents.emit('collect', id)
    } else {
        isCollect.value = true
        await collectdb.setItem<CollectData>(id, {
            id: id,
            time: time.getTime(),
            sex: sex,
            style: facestyle,
            name: name,
        })
        panelEvents.emit('collect', id)
    }
}

const gotoWeibo = () => {
    if (weibo.value != null) {
        window.open(weibo.value, '_blank')
    }
}

const _hair_default = ref(null)
const hairname = inject<Ref<string | null>>("hair", _hair_default)
watch(hairname, (newValue, oldValue) => {
    getImage("face_front.jpg", "front")
    getImage("face_side.jpg", "side")
})

const frontImage = ref("")
const sideImage = ref("")

function imageToBlob(src: string): Promise<Blob> {
    return new Promise((res, rej) => {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.setAttribute('crossorigin', 'anonymous')
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            if (ctx != null) {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob: Blob | null) => {
                    if (blob != null) {
                        res(blob)
                    } else {
                        rej()
                    }
                }, "image/webp")
            } else {
                rej()
            }
        };
        img.src = src;
    })

}


const getImage = async (imgname: string, direction: string) => {
    const bgimage = URL.createObjectURL(await cache(getAssetsFile(imgname), async () => await imageToBlob(getAssetsFile(imgname))))
    if (hairname.value === null) {
        if (direction === "front") {
            frontImage.value = bgimage
        }
        else {
            sideImage.value = bgimage
        }
        return
    }
    const img = new Image()
    img.setAttribute('crossorigin', 'anonymous')

    img.onload = async () => {
        let canvas = document.createElement("canvas");
        canvas.width = 616
        canvas.height = 612
        let ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(img, 0, 0, 616, 612)

            let img2 = new Image()
            img2.setAttribute('crossorigin', 'anonymous')
            img2.onload = () => {
                if (ctx != null) {
                    ctx.drawImage(img2, 0, 0, 616, 612);
                    if (direction === "front")
                        frontImage.value = canvas.toDataURL("image/webp")
                    else
                        sideImage.value = canvas.toDataURL("image/webp")
                }

            }

            img2.src = URL.createObjectURL(await cache(
                getAssetPath(`${hairname.value}.${direction}.${sex}.webp`, "hair"),
                async () => await imageToBlob(getAssetPath(`${hairname.value}.${direction}.${sex}.webp`, "hair")),
                1000 * 60 * 24
            ))
        }
    }
    img.src = bgimage
}


const priceColor = () => {
    return "default"
    // if (!price) return "default"
    // if (price * off <= 9000)
    //     return "success"
    // if (price * off >= 12000)
    //     return "error"
    // return "default"
}

const onefaceChange = () => {
    if (onefaceWhat.value === 'front') onefaceWhat.value = 'side'
    else onefaceWhat.value = 'front'
}

const fstyleTranslate: { [key: string]: string } = {
    "real": "写实",
    "fantacy": "写意"
}

const sexTranslate: { [key: string]: string } = {
    "boy": "正太",
    "man": "成男",
    "female": "成女",
    "girl": "萝莉"
}
const share = () => {
    navigator.clipboard.writeText(`（${fstyleTranslate[facestyle]}·${sexTranslate[sex]}）「${name}」 https://faces.jx3openplayer.com/share?id=${id}`)
    message.success("已复制到剪贴板！")
}

const copyCode = async () => {
    await window.navigator.clipboard.writeText(code ?? "")
    message.success("捏脸码复制成功：" + code)
}
</script>

<template>
    <n-card class="one-face-card" :title="name + (suffix ?? '')">
        <template #header-extra>
            <n-tooltip v-if="price" trigger="hover">
                <template #trigger>
                    <n-tag v-if="off === 1" round class="price" type="default" size="small">{{ "￥ " + price / 100
                        }}</n-tag>
                    <n-tag v-if="off != 1" round class="price" type="default" size="small">
                        ￥{{ price * off / 100 }}
                    </n-tag>
                </template>
                商城售价{{ price }}通宝，折合人民币{{ (price ?? 0) / 100 }}元。{{ (off != 1) ? "当前打折为" + off * 100 + "%！" : "" }}（若价格过低可能为数据错误！）
            </n-tooltip>

        </template>

        <n-image-group>
            <n-flex justify="center" align="end" style="height: 100%;">
                <n-image v-if="(!hideSide) || (hideSide && onefaceWhat === 'front')" object-fit="fill" :class="fclass"
                    :src="frontImage" />
                <n-image v-if="(!hideSide) || (hideSide && onefaceWhat === 'side')" object-fit="fill" :class="fclass"
                    :src="sideImage" />
            </n-flex>
        </n-image-group>
        <n-float-button v-if="hideSide" :right="20" :bottom="80" position="absolute" @click="onefaceChange">
            <n-icon>
                <img src="@/assets/changeface.svg" />
            </n-icon>
        </n-float-button>
        <template #action>
            <n-flex justify="space-between">
                <n-flex>
                    <n-button class="hover-button" text @click="downloadButton">
                        <img src="@/assets/download.svg" style="height: 32px;" />
                    </n-button>
                    <n-badge :value="(likes ?? 0) + tmpLove" :color="isLove ? 'red' : 'grey'">
                        <n-button class="hover-button" text :type="isLove ? 'warning' : 'error'" @click="changeLove">
                            <img v-if="isLove" src="@/assets/like.svg" style="height: 32px;" />
                            <img v-else src="@/assets/unlike.svg" style="height: 32px;" />
                        </n-button>
                    </n-badge>

                    <n-button class="hover-button" text :type="isCollect ? 'success' : 'info'" @click="changeCollect">
                        <img v-if="isCollect" src="@/assets/collecticon.svg" style="height: 32px;" />
                        <img v-else src="@/assets/collect.svg" style="height: 32px;" />
                    </n-button>
                    <n-button class="hover-button" text @click="share">
                        <img src="@/assets/share.svg" style="height: 32px;" />
                    </n-button>
                    <n-button v-if="weibo != null" class="hover-button" text @click="gotoWeibo">
                        <img src="@/assets/weibo.svg" style="height: 32px;" />
                    </n-button>
                    <n-tooltip trigger="hover" v-if="code">
                        <template #trigger>
                            <n-button class="hover-text-button" text @click="copyCode">
                                码
                            </n-button>
                        </template>
                        点击复制捏脸码：{{ code }}
                    </n-tooltip>
                </n-flex>

                <n-time class="time" :time="time" type="date" time-zone="Asia/Shanghai" />
            </n-flex>
        </template>
    </n-card>
</template>

<style scoped>
.one-face-card {
    min-height: 200px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.face-img {
    width: 200px;
    height: 200px;
}

.face-img-mid {
    height: 350px;
}


@media (max-width: 600px) {
    .face-img-large {
        /* width: 90vw; */
        height: 90vw;
    }
}

@media (min-width: 600px) {
    .face-img-large {
        width: 500px;
        height: 500px;
    }
}

.hover-text-button {
    display: inline-block;
    font-size: 16px;
    text-align: center;
    text-decoration: none;
    border: none;
    cursor: pointer;
    outline: none;
    color: rgb(114, 114, 114);
    transition: all 0.3s;
    font-size: 20px;
}

.hover-text-button:hover {
    transform: scale(1.2);
    color: rgb(114, 114, 114);
}

.hover-text-button:active {
    transform: scale(2);
    color: rgb(114, 114, 114);
}


.hover-button {
    display: inline-block;
    font-size: 16px;
    text-align: center;
    text-decoration: none;
    border: none;
    cursor: pointer;
    outline: none;
    color: white;
    transition: all 0.3s;
}

.hover-button:hover {
    transform: scale(1.2);
}

.hover-button:active {
    transform: scale(2);
}

.time {
    color: rgb(173, 173, 173);
    align-content: center;
}
</style>