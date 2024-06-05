<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import OneFace from '@/components/OneFace.vue';
import { generateIdMap, type IndexMapItem } from '@/lib/assets'
import { NFlex } from 'naive-ui'

const route = useRoute();

const faceid = ref<string | null>(null)
const face = ref<IndexMapItem | null>(null)
const likev = ref<number>(0)
onMounted(async () => {
    const alldata = await generateIdMap()
    const id = route.query.id?.toString()
    if (id) {
        const target = alldata[id]
        if (target) {
            faceid.value = id
            face.value = target
            await getAllInfo(id)
        }
    }
})


const getAllInfo = async (id: string) => {
    const r = await fetch(`/api/dinfo?id=${id}`)
    const data = await r.json()
    const array = data.result
    if (array.length > 0 && array[0].id === id) {
        likev.value = array[0].likes
    }
}


</script>

<template>
    <n-flex justify="center">
        <OneFace v-if="face != null" class="one-face-grid-large" :facestyle="face.style" :sex="face.sex" :id="face.id"
            :key="face.id" facesize="large" :name="face.name" :time="new Date(face.time * 1000)" :price="face.p"
            :likes="likev" hide-side />
    </n-flex>
</template>
<style scoped>
.one-face-grid-large {
    width: 570px;
    margin-top: 20px;
}
</style>