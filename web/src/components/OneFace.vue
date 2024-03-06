<script setup lang="ts">
import { NCard, NImage, NImageGroup, NFlex, NButton, NTime, NBadge } from 'naive-ui'
import { ref, onMounted } from 'vue';
import { saveAs } from 'file-saver'
import { type CollectData, collectEvents } from '@/interface/face'
import localforage from 'localforage'
import { getAssetPath } from '@/lib/assets'
import { checkTaitaiWeibo } from '@/lib/taitai'

const {
    facestyle,
    sex,
    id,
    facesize,
    hideSide,
    name,
    time,
    likes,
} = defineProps<{
    facestyle: string,
    sex: string,
    id: string,
    facesize: string,
    hideSide?: boolean,
    name: string,
    time: Date,
    likes?: number,
}>()

const url = `${facestyle}/${sex}/${id}`

// const getAssetsFile = (fp: string) => {
//     return `/data/${url}/${fp}`
// };

const getAssetsFile = (fp: string) => {
    return getAssetPath(fp, url)
};

const downloadButton = () => {
    if (facestyle === "real") {
        saveAs(getAssetsFile('face.ini'), `${name}.ini`)
    } else {
        saveAs(getAssetsFile('face.dat'), `${name}.dat`)
    }

}

const fclass = ref("face-img")

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


const changeCollect = () => {
    if (isCollect.value) {
        isCollect.value = false
        collectdb.removeItem(id)
    } else {
        isCollect.value = true
        collectdb.setItem<CollectData>(id, {
            id: id,
            time: time.getTime(),
            sex: sex,
            style: facestyle,
            name: name,
        })
    }
}

const gotoWeibo = () => {
    if (weibo.value != null) {
        window.open(weibo.value, '_blank')
    }
}
</script>

<template>
    <n-card class="one-face-card" :title="name">
        <n-image-group>
            <n-flex justify="center">
                <n-image lazy object-fit="fill" :class="fclass" :src="getAssetsFile('face_front.jpg')" />
                <n-image v-if="!hideSide" lazy object-fit="fill" :class="fclass"
                    :src="getAssetsFile('face_side.jpg')" />
            </n-flex>
        </n-image-group>
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
                    <n-button v-if="weibo != null" class="hover-button" text @click="gotoWeibo">
                        <img src="@/assets/weibo.svg" style="height: 32px;" />
                    </n-button>
                </n-flex>
                <n-time class="time" :time="time" type="date" time-zone="Asia/Shanghai" />
            </n-flex>
        </template>
    </n-card>
</template>

<style>
.one-face-card {
    min-height: 200px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.face-img {
    width: 200px;
    height: 200px;
}

.face-img-large {
    width: 500px;
    height: 500px;
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