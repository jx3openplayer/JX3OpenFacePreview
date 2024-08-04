<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { UploadFileInfo } from "naive-ui";
import { generateIdMap } from "@/lib/assets";
import ImageCompressor from "js-image-compressor"
import {
  NUpload, NUploadDragger,
  NText, NH2, NSpin,
  useMessage, NImage
} from "naive-ui";
import saveAs from "file-saver";
const message = useMessage()
const faceData = ref<any>({});
const showList = ref<any>([]);
const noList = ref<string[]>([]);
const showSpin = ref<boolean>(false);

function blobToDataURL(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result); // 读取成功，返回 Data URL
    };

    reader.onerror = () => {
      reject(new Error('Failed to convert Blob to Data URL'));
    };

    reader.readAsDataURL(blob); // 读取 Blob
  });
}
const handleUploadChange = async (data: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
}) => {
  showSpin.value = true
  try {
    let img = await imageCompress(data.file.file)
    saveAs(img, data.file.name + ".s.jpg");
    showList.value.push({
      url: await blobToDataURL(img),
      name: data.file.name
    })
  } catch (error) {
    console.error(error)
  } finally {
    showSpin.value = false
  }

};
const handleBeforeUpload = async (data: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
}) => {
  return true;
};

onMounted(async () => {
  faceData.value = await generateIdMap();
});


function imageCompress(file: any): Promise<Blob> {
  // (3840 * 4, 2160 * 4)
  const size = file.size / 1024
  return new Promise((resolve, reject) => {
    const options = {
      file: file,
      quality: 0.8, // 图片质量
      mimeType: 'image/jpeg',
      maxWidth: file.height,
      maxHeight: file.width,
      minWidth: 10, // 指定压缩图片最小宽度
      width: 3840 * 4, // 指定压缩图片宽度
      height: 2160 * 4,
      convertSize: Infinity,
      loose: true,
      redressOrientation: true,
      success: (result: Blob) => {
        resolve(result)
      },
      error: (msg: any) => {
        reject(msg)
      },
    }
    new ImageCompressor(options)
  })
}

</script>

<template>

  <n-upload multiple directory-dnd :show-file-list="false" @change="handleUploadChange"
    @before-upload="handleBeforeUpload">
    <n-upload-dragger>
      <n-h2 style="margin: auto;">压缩图片</n-h2>
      <n-text style="font-size: 16px;"> 点击或者拖动文件到该区域来上传 </n-text><br />
    </n-upload-dragger>
  </n-upload>
  <div v-for="item in showList" :key="item.id" class="item">
    <div>
      <n-image :src="item.url" :alt="item.name" :height="600" object-fit="contain" />
    </div>
  </div>
  <div class="mask" v-if="showSpin">
    <n-spin class="m-center" size="large"></n-spin>
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

.m-center {
  margin: auto;
  position: relative;
  top: 50%;
  left: 50%;
}
</style>
