<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { UploadFileInfo } from "naive-ui";
import { generateIdMap } from "@/lib/assets";
import sha256 from 'crypto-js/sha256';
import CryptoJS from 'crypto-js';
import OneFace from "../components/OneFace.vue";
import {
  NUpload, NUploadDragger,
  NText, NH2, NThing,
  useMessage
} from "naive-ui";
const message = useMessage()
const faceData = ref<any>({});
const showList = ref<any>([]);
const noList = ref<string[]>([]);
const handleUploadChange = async (data: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
}) => {
  let wordArray = CryptoJS.lib.WordArray.create(await data.file.file!.arrayBuffer());
  let sha = sha256(wordArray).toString()

  if (!faceData.value[sha]) {
    noList.value.push(data.file.name);
    message.error(`${data.file.name} 找不到对应的脸型`);
  } else {
    showList.value.push({
      ...faceData.value[sha],
      filename: data.file.name
    });
  }
};
const handleBeforeUpload = async (data: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
}) => {
  if (!data.file.file?.name.endsWith("ini") && !data.file.file?.name.endsWith("dat")) {
    return false;
  }

  return true;
};

onMounted(async () => {
  faceData.value = await generateIdMap();
});

// 这里的搜索不靠谱，搜到的居然是整个数据库的内容
// 但网页内搜索为什么不ctrl+F呢
// 还没想好怎么改
// const searchVal = ref("");
// const handleSearch = () => {
//   showList.value = [];
//   for (let id in faceData.value) {
//     if (!searchVal.value) {
//       showList.value.push(faceData.value[id]);
//     }
//     if (id.includes(searchVal.value)) {
//       showList.value.push(faceData.value[id]);
//     }
//   }
// };
</script>

<template>

  <!-- <div style="width: 100vw">
    <n-flex justify="center">
      <n-input v-model:value="searchVal" style="width: 300px" />
      <n-button @click="handleSearch">搜索</n-button>
    </n-flex>
  </div> -->

  <n-upload multiple directory-dnd :show-file-list="false" @change="handleUploadChange"
    @before-upload="handleBeforeUpload">
    <n-upload-dragger>
      <n-h2 style="margin: auto;">文件预览查看</n-h2>
      <n-text style="font-size: 16px;"> 点击或者拖动文件到该区域来上传 </n-text><br />
      <n-text style="font-size: 16px;">
        或者拖动你的文件夹，压缩包大概也许是不行的~~
      </n-text><br /><br />
      <n-thing>
        如果你有一堆脸型，不知道它们都是什么的话，可以试试这个功能。<br />
        不过这里的上传，不会上传到服务器，只是在浏览器里计算。<br />
        并且也不可能显示不在数据库中的脸型，毕竟，没有人在浏览器里截图。<br />
        另外，选的太多的话，会卡。
      </n-thing>
    </n-upload-dragger>
  </n-upload>

  <div v-for="item in showList" :key="item.id" class="item">
    <div class="inside-item">
      <OneFace :facestyle="item.style" :key="item.id" :sex="item.sex" :id="item.id" facesize="large" :name="item.name"
        :time="new Date(item.time * 1000)" :suffix="`「${item.filename}」`" :c="item.c"/>
    </div>
  </div>
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

.noitem {
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  width: 600px;
}
</style>
