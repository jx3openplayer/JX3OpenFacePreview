<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { NLayout, NLayoutHeader, NLayoutContent, NMenu, NMessageProvider, NAlert } from 'naive-ui'
import { h, onMounted, ref, watch } from 'vue';
import { prepareIndexData, updateConfig, indexUpdateEvents } from './lib/assets';

const headerMenuOptions = [
  {
    label: () => h(
      RouterLink,
      {
        to: "/rank"
      },
      { default: () => '热门' }
    ),
    key: "rank",
  },
  {
    label: () => h(
      RouterLink,
      {
        to: "/lib"
      },
      { default: () => '脸型' }
    ),
    key: "lib",
  }, {
    label: () => h(
      RouterLink,
      {
        to: "/upload"
      },
      { default: () => '文件预览' }
    ),
    key: "upload",
  }, {
    label: () => h(
      RouterLink,
      {
        to: "/about"
      },
      { default: () => '声明' }
    ),
    key: "about",
  }
]
const route = useRoute()
const activeKey = ref("")

const showUpdate = ref(false)
indexUpdateEvents.on("update", (e: string) => {
  showUpdate.value = true
})

const showWait = ref(false)
prepareIndexData(() => {
  showWait.value = true
}).then(() => {
  showWait.value = false
})
updateConfig()

watch(() => route.name, (newVal, oldVal) => {
  let found = false
  for (let i = 0; i < headerMenuOptions.length; i++) {
    const e = headerMenuOptions[i];
    if (e.key === newVal) {
      activeKey.value = e.key;
      found = true
      break;
    }
  }
  if (!found) activeKey.value = ""
})

onMounted(() => {

})

</script>

<template>
  <n-layout class="app">
    <n-message-provider>
      <n-layout-header class="app-header" bordered>
        <n-menu v-model:value="activeKey" mode="horizontal" :options="headerMenuOptions" />
      </n-layout-header>
      <n-layout-content>
        <n-alert v-if="showWait" title="正在下载数据" type="warning">
          正在下载数据列表，请耐心等待~
        </n-alert>
        <n-alert v-if="showUpdate" type="success">
          脸型数据已更新！请刷新网页查看~（如果你每次刷新都能看见此信息，可能是无法写入缓存导致的）
        </n-alert>
        <RouterView />
      </n-layout-content>
    </n-message-provider>
  </n-layout>
</template>

<style scoped>
.app-header {
  line-height: 1.5;
  background-color: rgb(255, 255, 255);
  height: 60px;
  padding-left: 30px;
  padding-top: 10px;
}

.app {
  min-height: 100vh;
}
</style>
