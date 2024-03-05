<script setup lang="ts">
import OneFace from '../components/OneFace.vue';
import { NFlex, NSelect, NPagination, NLayout, NLayoutContent, NLayoutHeader, NLayoutFooter, NInput } from 'naive-ui'
import Collect from '@/components/Collect.vue';
import indexjson from "@/assets/index.json"
import { computed, onMounted, ref } from 'vue';
import localforage from 'localforage'

const options = [
  {
    label: "写实 成女",
    value: "real female"
  },
  {
    label: "写实 萝莉",
    value: "real girl"
  },
  {
    label: "写实 成男",
    value: "real man"
  },
  {
    label: "写实 正太",
    value: "real boy"
  },
  {
    label: "写意 正太",
    value: "fantacy boy"
  }
]

const lovedb = localforage.createInstance({
  name: 'love_face',
})

const facestyle = ref("real")
const sex = ref("girl")
const init_option = ref("real girl")
const search_value = ref("")

const page = ref(1)
const page_item_counts = ref(15)
const allInfo = ref<{
  name: string;
  id: string;
}[]>([])

const pagecount = computed(() => Math.ceil(allInfo.value.length / page_item_counts.value))

const collectionSearch = async () => {
  allInfo.value = (indexjson as any)[sex.value][facestyle.value]

  if (love_option_value.value === 'love') {
    const loveIds = await lovedb.keys();
    console.log(loveIds)
    allInfo.value = allInfo.value.filter((it) => loveIds.includes(it.id))
  }
  if (search_value.value != "") {
    allInfo.value = allInfo.value.filter((it) => it.name.indexOf(search_value.value) != -1)
  }
  collection.value = allInfo.value.slice((page.value - 1) * page_item_counts.value, (page.value) * page_item_counts.value)
}

const collection = ref<{ name: string, id: string }[]>([])

const option_change = (value: string) => {
  const classes = value.split(" ")
  facestyle.value = classes[0]
  sex.value = classes[1]
  page.value = 1
  init_option.value = value
  collectionSearch()
}


const seachUpdate = (value: string) => {
  search_value.value = value
  collectionSearch()
}
const love_option = [
  {
    label: "全部",
    value: "all"
  },
  {
    label: "喜爱",
    value: "love"
  }
]
const love_option_value = ref("all")
const update_love_option = (newv: string) => {
  love_option_value.value = newv
  console.log(love_option_value.value)
  collectionSearch()
}

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
const page_items_option_value = ref("30")
const update_page_items_option = (newv: string) => {
  page_items_option_value.value = newv
  page_item_counts.value = parseInt(newv)
  collectionSearch()
}

const face_size_option = [
  {
    label: "小",
    value: "small"
  }, {
    label: "大",
    value: "large"
  }
]

const face_size_value = ref("small")
const update_face_size_option = (newv: string) => {
  face_size_value.value = newv
  if (newv === "small") {
    face_grid_class.value = "one-face-grid"
  } else {
    face_grid_class.value = "one-face-grid-large"
  }
  collectionSearch()
}
const face_grid_class = ref("one-face-grid")

const pageChange = (num: number) => {
  page.value = num
  window.scrollTo(0, 0)
  collectionSearch()
}

onMounted(() => {
  collectionSearch()
})

</script>

<template>
  <main>
    <Collect />
    <n-layout>
      <n-layout-header class="pages-header app-content">
        <n-flex justify="center">
          <n-flex justify="center"  class="page-setting">
            <n-select class="select-face-style" v-model:value="init_option" :options="options"
              :on-update:value="option_change" />
            <n-select class="small-select" v-model:value="love_option_value" :options="love_option"
              :on-update:value="update_love_option" />

            <n-select class="small-select" v-model:value="page_items_option_value" :options="page_items_option"
              :on-update:value="update_page_items_option" />

            <n-select class="small-select" v-model:value="face_size_value" :options="face_size_option"
              :on-update:value="update_face_size_option" />

            <n-pagination class="face-page-top" v-model:page="page" :page-count="pagecount" simple
              :on-update:page="pageChange" />
            <n-flex class="search-text">
              <n-input v-model:value="search_value" type="text" placeholder="搜索" :on-update:value="seachUpdate" />
            </n-flex>
          </n-flex>
        </n-flex>

      </n-layout-header>
      <n-layout-content class="app-content">
        <n-flex justify="center" class="main-face-cards">
          <OneFace :class="face_grid_class" v-for="it in collection" :facestyle="facestyle" :sex="sex" :id="it.id"
            :key="it.id + face_size_value" :facesize="face_size_value" />
        </n-flex>
      </n-layout-content>
      <n-layout-footer class="app-footer">
        <n-flex justify="center">
          <n-pagination v-model:page="page" :page-count="pagecount" class="face-page-footer"
            :on-update:page="pageChange" />
        </n-flex>
      </n-layout-footer>
    </n-layout>
  </main>
</template>

<style>
.pages-header {
  padding-top: 20px;
}

.app-content {
  background-color: rgb(239, 239, 239);
}

.app-footer {
  background-color: rgb(239, 239, 239);
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
  width: 1070px
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
  margin-bottom: 20px;
}

.small-select {
  width: 100px;
}
</style>