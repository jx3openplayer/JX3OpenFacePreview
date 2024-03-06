<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { NLayout, NLayoutHeader, NLayoutContent, NMenu, NMessageProvider } from 'naive-ui'
import { h, onMounted, ref } from 'vue';

const headerMenuOptions = [
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
const activeKey = ref("lib")

onMounted(() => {
  for (let i = 0; i < headerMenuOptions.length; i++) {
    const e = headerMenuOptions[i];
    if (e.key === route.name) {
      activeKey.value = e.key;
      break;
    }
  }

})


</script>

<template>
  <n-layout class="app">
    <n-message-provider>
      <n-layout-header class="app-header" bordered>
        <n-menu v-model:value="activeKey" mode="horizontal" :options="headerMenuOptions" />
      </n-layout-header>
      <n-layout-content>
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
