<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { UploadFileInfo } from "naive-ui";
import dataSource from "@/assets/index.json";

import OneFace from "../components/OneFace.vue";
import {
  NUpload,
  NVirtualList,
  NUploadDragger,
  NText,
  NInput,
  NButton,
} from "naive-ui";

const faceData = ref<any>({});
const showList = ref<any>([]);
const noList = ref<string[]>([]);
const handleUploadChange = (data: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
}) => {
  let name = data.file.name.split(".ini")[0];
  console.log(data.file.name.split(".ini")[0]);
  if (!faceData.value[name]) {
    noList.value.push(name);
  } else {
    showList.value.push(faceData.value[name]);
  }
};
const handleBeforeUpload = (data: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
}) => {
  if (!data.file.file?.name.includes("ini")) {
    return false;
  }
  return true;
};
onMounted(() => {
  let obj = {};
  const response = Object.entries(dataSource);
  response.forEach((v) => {
    const arr = [...v[1].real, ...v[1].fantacy];
    let arrRes = Object.entries(v[1]);
    arrRes.forEach((type) => {
      type[1].forEach((face) => {
        obj = {
          ...obj,
          [face.name]: {
            ...face,
            sex: v[0],
            style: type[0],
          },
        };
      });
    });
  });
  faceData.value = obj;
});
const searchVal = ref("");
const handleSearch = () => {
  showList.value = [];
  for (let name in faceData.value) {
    if (!searchVal.value) {
      showList.value.push(faceData.value[name]);
    }
    if (name.includes(searchVal.value)) {
      showList.value.push(faceData.value[name]);
    }
  }
};
</script>

<template>
  <n-input v-model:value="searchVal" />
  <n-button @click="handleSearch">搜索</n-button>
  <n-upload
    multiple
    directory-dnd
    :show-file-list="false"
    @change="handleUploadChange"
    @before-upload="handleBeforeUpload"
  >
    <n-upload-dragger>
      <div style="margin-bottom: 12px"></div>
      <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
      <n-text style="font-size: 16px">
        或者拖动你的文件夹，压缩包大概也许是不行的~~
      </n-text>
    </n-upload-dragger>
  </n-upload>
  <div v-if="noList.length > 0">
    <span v-for="val in noList" style="color: red; margin-right: 12px">{{
      val
    }}</span>
    暂无预览图
  </div>
  <n-virtual-list ref="virtualListInst" :item-size="700" :items="showList">
    <template #default="{ item }">
      <div :key="item.id" class="item">
        <div class="inside-item">
          <OneFace
            :facestyle="item.style"
            :key="item.id"
            :sex="item.sex"
            :id="item.id"
            facesize="large"
          />
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
