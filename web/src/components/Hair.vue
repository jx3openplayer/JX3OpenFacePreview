<script setup lang="ts">
import { NButton, NFloatButton, NDivider, NFlex, useMessage, NList, NListItem, NThing, NH3, NA } from 'naive-ui'
import { type CollectData, collectEvents } from '@/interface/face'
import { saveAs } from 'file-saver'
import localforage from 'localforage'
import { inject, ref, type Ref } from 'vue';
import jszip from 'jszip'
import { getAssetPath } from '@/lib/assets'
import { panelEvents } from '@/interface/panels'

panelEvents.on('downloading', (data: boolean) => {
    downloading.value = data
})

panelEvents.on('open', (id: string) => {
    if (id !== "hair") {
        closeMask()
    }
})

const isShow = ref<boolean>(false);
const message = useMessage()
const downloading = ref(false);
const showHideTime = 300
const hairs = ref<string[]>([]);


const closeMask = () => {
    if (downloading.value) return
    isShow.value = false
    setTimeout(() => {
        panelShow.value = isShow.value
    }, showHideTime);
}

const panelShow = ref(false)
const panelClass = () => {
    if (isShow.value)
        return ' panel-show'
    else
        return ' panel-hide'
}

const hairname = inject<Ref<string | null>>("hair", ref(null))

const showHairs = () => {
    if (downloading.value) return
    if (isShow.value) {
        isShow.value = false
        setTimeout(() => {
            panelShow.value = true
        }, showHideTime);

    } else {
        panelShow.value = true
        setTimeout(() => {
            isShow.value = true
        }, 0);
        panelEvents.emit('open', 'hair')
        // 显示
        hairs.value = [
            "龙隐", "龙隐金", "兔金", "红六七（黑）"
        ]
    }
}

const handleSelectHair = (hair: string) => {
    if (hair === hairname.value) {
        hairname.value = null
    } else {
        hairname.value = hair
    }
}
</script>

<template>
    <n-float-button class="fixed hover-button" :right="20" :bottom="150" :width="60" :height="60" text
        @click="showHairs">
        <img src="@/assets/face.svg" style="height: 40px; margin-top: 8px;" />
    </n-float-button>
    <div class="mask" v-show="isShow" @click="closeMask">
    </div>
    <div :class="'fixed-menu collect' + panelClass()" v-show="panelShow">
        <n-h3 prefix="bar">
            假发
        </n-h3>
        <n-thing>
            你可以选择发型进行尝试，有什么别的发型特别喜欢可以<n-a href="https://f.wps.cn/g/1MzVJFMU/">联系我们</n-a>哦。（不过遗失的美好里查看不了的我也没办法）
        </n-thing>
        <div style="height:100%; overflow: auto;">
            <n-list hoverable clickable>
                <n-list-item v-for="hair in hairs" :key="hair" @click="handleSelectHair(hair)"
                    :class="hair == hairname ? 'selected-hair' : ''">
                    <n-thing :title="hair" content-style="margin-top: 10px;"></n-thing>
                </n-list-item>
            </n-list>
        </div>
    </div>
</template>

<style>
.fixed {
    z-index: 20;
}

.fixed-menu {
    z-index: 20;
    right: 100px;
    bottom: 20px;
    position: fixed;
}

.mask {
    height: 100vh;
    width: 100vw;
    top: 0;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 10;
}

.collect {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    height: 500px;
    width: 300px;
    /* overflow-y: auto; */
}

.collect-i {
    /* display: flex;
    align-items: center;
    justify-content: space-between; */
    padding: 5px 10px 5px 5px;
}

.panel-show {
    visibility: visible;
    opacity: 1;
    transition: all 0.3s;
    transform: translateY(0px);
}

.panel-hide {
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s;
    transform: translateY(100px);
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

.selected-hair {
    background-color: rgb(218, 251, 240);
}
</style>