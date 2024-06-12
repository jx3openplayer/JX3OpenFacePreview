<script setup lang="ts">
import OneFace from '../components/OneFace.vue';
import { NFlex, NPagination, NLayout, NLayoutContent, NAlert } from 'naive-ui'
import Collect from '@/components/Collect.vue';
import { cachejson, generateIdMap, getIndexData } from '@/lib/assets'
import { computed, onMounted, provide, ref } from 'vue';
import Hair from '@/components/Hair.vue';

const facestyle = ref("real")
const sex = ref("female")

const page = ref(1)
const page_item_counts = ref(15)

interface FaceItem {
    name: string
    id: string
    time: number
    likes?: number
    p?: number
    style: string
    sex: string
    c?: string
}

const pagecount = computed(() => Math.ceil(collection.value.length / page_item_counts.value))


const collection = ref<FaceItem[]>([])

const curCollection = ref<FaceItem[]>([])
const showWait = ref(false)
const page_items_option = [
    {
        label: "每页 15",
        value: "15"
    },
    {
        label: "每页 30",
        value: "30"
    },
    {
        label: "每页 60",
        value: "60"
    }
]
const page_items_option_value = ref("15")
// const update_page_items_option = (newv: string) => {
//     page_items_option_value.value = newv
//     page_item_counts.value = parseInt(newv)
//     page.value = 1
//     // 
// }

const face_size_value = ref("large")
const face_grid_class = ref("one-face-grid-large")

const pageChange = (num: number) => {
    page.value = num
    window.scrollTo(0, 0)
    curCollection.value = collection.value.slice((page.value - 1) * page_item_counts.value, (page.value) * page_item_counts.value)
}

onMounted(async () => {

    let t = setTimeout(() => {
        showWait.value = true
    }, 500);
    const rankRes: any[] = (await cachejson('/api/rank')).result
    clearTimeout(t)
    showWait.value = false
    const obj = await generateIdMap();
    for (let item of rankRes) {
        const faceInfo = { ...obj[item.id], likes: item.likes };
        collection.value.push(faceInfo);
    }
    pageChange(1);
})

const hair = ref<string | null>(null)
provide("hair", hair)

</script>

<template>
    <main>
        <Hair />
        <Collect />
        <n-layout>
            <n-alert v-if="showWait" title="正在下载数据" type="warning">
                正在下载数据列表，请耐心等待~
            </n-alert>
            <n-layout-content class="app-content">
                <n-flex justify="center" class="main-face-cards">
                    <OneFace :class="face_grid_class" v-for="it in curCollection" :facestyle="it.style" :sex="it.sex"
                        :id="it.id" :key="it.id + face_size_value" :facesize="face_size_value" :name="it.name"
                        :time="new Date(it.time * 1000)" :likes="it.likes" :price="it.p" hide-side :code="it.c"/>
                </n-flex>
            </n-layout-content>
        </n-layout>
        <div class="pagination-area">
            <n-flex justify="center">
                <n-pagination v-model:page="page" :page-count="pagecount" class="face-page-footer"
                    :on-update:page="pageChange" />
            </n-flex>
        </div>
    </main>
</template>

<style scoped>
.pages-header {
    padding-top: 20px;
}

.app-content {
    background-color: rgb(239, 239, 239);
}

.pagination-area {
    position: fixed;
    bottom: 10px;
    width: 100vw;
}

.pagination {
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
    border-radius: 5px;
}

.page-setting {
    background: white;
    width: fit-content;
    padding: 8px;
    border-radius: 8px;
}

.one-face-grid {
    width: 470px
}

.one-face-grid-large {
    width: 570px
}

.select-face-style {
    width: 200px;
}

.search-text {
    width: 300px;
}

.face-page-top {
    margin-left: 10px;
    margin-right: 10px;
}

.main-face-cards {
    padding-top: 20px;
    padding-bottom: 20px;
    flex-grow: 1;
}

.face-page-footer {
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
    border-radius: 5px;
}

.small-select {
    width: 100px;
}
</style>