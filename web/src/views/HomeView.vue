<script setup lang="ts">
import OneFace from '../components/OneFace.vue';
import { NFlex, NSelect, NPagination, NLayout, NLayoutContent, NLayoutHeader, NLayoutFooter, NInput, NSwitch, NTooltip } from 'naive-ui'
import Collect from '@/components/Collect.vue';
import { getIndexData, usePersistConfig } from '@/lib/assets'
import { computed, onMounted, provide, ref } from 'vue';
import localforage from 'localforage'
import Hair from '@/components/Hair.vue';
import { debounce } from 'lodash'

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
    label: "写意 成女",
    value: "fantacy female"
  },
  {
    label: "写意 萝莉",
    value: "fantacy girl"
  },
  {
    label: "写意 成男",
    value: "fantacy man"
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
const sex = ref("female")
const init_option = usePersistConfig("init-face-style-sex-option", "real female")
const search_value = ref("")

const page = ref(1)
const page_item_counts = ref(15)

interface FaceItem {
  name: string
  id: string
  time: number
  likes?: number
  p?: number
  download?: number
  c?: string
}
const allInfo = ref<FaceItem[]>([])

const pagecount = computed(() => Math.ceil(allInfo.value.length / page_item_counts.value))

const collectionSearch = async () => {
  allInfo.value = (await getIndexData())[sex.value][facestyle.value]

  if (filter_option_value.value === 'love') {
    const loveIds = await lovedb.keys();
    allInfo.value = allInfo.value.filter((it) => loveIds.includes(it.id))
  } else if (filter_option_value.value === '先看贵的') {
    allInfo.value = allInfo.value.sort((a, b) => (b.p ?? 99999) - (a.p ?? 99999))
  } else if (filter_option_value.value === '先看便宜') {
    allInfo.value = allInfo.value.sort((a, b) => (a.p ?? 99999) - (b.p ?? 99999))
  } else if (filter_option_value.value === '最热门') {
    allInfo.value = allInfo.value.sort((a, b) => (b.likes ?? 99999) - (a.likes ?? 99999))
  } else if (filter_option_value.value === '最冷门') {
    allInfo.value = allInfo.value.sort((a, b) => (a.likes ?? 99999) - (b.likes ?? 99999))
  } else if (filter_option_value.value === 'all') {
    allInfo.value = allInfo.value.sort((a, b) => b.time - a.time)
  } else if (filter_option_value.value == '最近下载') {
    allInfo.value = allInfo.value.filter((it) => it.download).sort((a, b) => b.download! - a.download!)
  }
  if (search_value.value != "") {
    allInfo.value = allInfo.value.filter((it) => it.name.indexOf(search_value.value) != -1)
  }
  collection.value = allInfo.value.slice((page.value - 1) * page_item_counts.value, (page.value) * page_item_counts.value)
  getAllInfo()
}

const getAllInfo = debounce(async () => {
  const id = collection.value.map((it) => it.id).join("&id=")
  const r = await fetch(`/api/dinfo?id=${id}`)
  const data = await r.json()
  const array = data.result
  for (let i = 0; i < array.length; i++) {
    const e = array[i];
    const d = collection.value.find((it) => it.id === e.id)
    if (d) {
      d.likes = e.likes
    }
  }
}, 100)

const collection = ref<FaceItem[]>([])

const option_change = (value: string) => {
  const classes = value.split(" ")
  facestyle.value = classes[0]
  sex.value = classes[1]
  page.value = 1
  init_option.value = value
  collectionSearch()
}
option_change(init_option.value)


const seachUpdate = (value: string) => {
  search_value.value = value
  page.value = 1
  collectionSearch()
}
const love_option = [
  {
    label: "最新发布",
    value: "all"
  },
  {
    label: "先看贵的",
    value: "先看贵的"
  },
  {
    label: "先看便宜",
    value: "先看便宜"
  },
  {
    label: "最热门",
    value: "最热门"
  },
  {
    label: "最冷门",
    value: "最冷门"
  },
  {
    label: "我的收藏",
    value: "love"
  },
  {
    label: "最近下载",
    value: "最近下载"
  }
]
const filter_option_value = ref("all")
const update_love_option = (newv: string) => {
  filter_option_value.value = newv
  page.value = 1
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
const page_items_option_value = usePersistConfig("init-cout-per-page", "30")
const update_page_items_option = (newv: string) => {
  page_items_option_value.value = newv
  page_item_counts.value = parseInt(newv)
  page.value = 1
  collectionSearch()
}
update_page_items_option(page_items_option_value.value)

const face_size_option = [
  {
    label: "小",
    value: "small"
  }, {
    label: "中",
    value: "medium"
  }, {
    label: "大",
    value: "large"
  }
]

const face_size_value = usePersistConfig("init-face-size", "small")
const update_face_size_option = (newv: string) => {
  face_size_value.value = newv

  collectionSearch()
}
const face_grid_class = computed(() => {
  if (face_size_value.value === "small") {
    if (!facedir.value) {
      return "one-face-grid-front"
    } else {
      return "one-face-grid"
    }
  } else if (face_size_value.value === "medium") {
    if (!facedir.value) {
      return "one-face-grid-mid-front"
    } else {
      return "one-face-grid-mid"
    }
  } else {
    if (!facedir.value) {
      return "one-face-grid-large-front"
    } else {
      return "one-face-grid-large"
    }

  }
})

const pageChange = (num: number) => {
  page.value = num
  window.scrollTo(0, 0)
  collectionSearch()
}



const hair = ref<string | null>(null)
provide("hair", hair)

const facedir = usePersistConfig("init-face-dir", false)

onMounted(async () => {
  collectionSearch()
})

</script>

<template>
  <main>
    <Hair />
    <Collect />
    <n-layout>
      <n-layout-header class="pages-header app-content">
        <n-flex justify="center">
          <n-flex justify="center" class="page-setting">
            <n-flex vertical justify="center">
              <n-switch :round="false" v-model:value="facedir">
                <template #checked>
                  详细
                </template>
                <template #unchecked>
                  正面
                </template>
              </n-switch>
            </n-flex>

            <n-select class="select-face-style" v-model:value="init_option" :options="options"
              :on-update:value="option_change" />
            <n-select class="small-select" v-model:value="filter_option_value" :options="love_option"
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
            :key="it.id + face_size_value" :facesize="face_size_value" :name="it.name" :time="new Date(it.time * 1000)"
            :likes="it.likes" :price="it.p" :hide-side="!facedir" :code="it.c"/>
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

<style scoped>
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

.one-face-grid-front {
  width: 270px
}

.one-face-grid-mid {
  width: 800px
}

.one-face-grid-mid-front {
  width: 400px
}

.one-face-grid-large {
  width: 1070px
}

.one-face-grid-large-front {
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
  margin-bottom: 20px;
}

.small-select {
  width: 100px;
}
</style>