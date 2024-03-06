<script setup lang="ts">
import { ref } from 'vue'
import { NVirtualList, type VirtualListInst } from 'naive-ui'
import OneFace from '../components/OneFace.vue';

import indexjson from "@/assets/index.json"

const indexs: any = indexjson

const alldata = ref<any[]>([])
for (let k in indexs) {
    const sexlib = indexs[k]
    for (let style in sexlib) {
        const datas = sexlib[style]
        for (const it of datas) {
            it.style = style
            it.sex = k
            alldata.value.push(it)
        }
    }
}
alldata.value = alldata.value.sort((a: any, b: any) => b.time - a.time)

const virtualListInst = ref<VirtualListInst>()

const scrollEvent = (event: Event) => {

}
console.log(alldata)
</script>

<template>
    <n-virtual-list ref="virtualListInst" style="max-height: 90vh" :item-size="700" :items="alldata"
        :on-scroll="scrollEvent">
        <template #default="{ item }">
            <div :key="item.id" class="item" style="height: 700px">
                <div class="inside-item">
                    <OneFace :facestyle="item.style" :key="item.id" :sex="item.sex" :id="item.id" facesize="large"
                        hide-side :name="item.name" :time="new Date(item.time * 1000)" />
                </div>
            </div>
        </template>
    </n-virtual-list>
</template>

<style scoped>
.item {
    display: flex;
    justify-content: center;
    width: 100%;
}

.inside-item {
    display: flex;
    width: 550px;
    padding-top: 20px;
    padding-bottom: 20px;
}
</style>