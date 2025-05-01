<template>
  <div class="url-picture-upload">
    <a-input-group compact style="margin-bottom: 10px">
      <a-input v-model:value="fileUrl" style="width: calc(100% - 120px)" placeholder="Please put image URL here"></a-input>
      <a-button type="primary" :loading="loading" @click="handleUpload" style="width: 120px;">Submit</a-button>
    </a-input-group>
    <img v-if="picture?.url" :src="picture?.url" alt="avatar"/>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';

import {message} from 'ant-design-vue';
import {uploadPictureByUrl} from "@/api/pictureController.ts";

interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()


const loading = ref<boolean>(false);
const fileUrl = ref<string>();

const handleUpload = async () => {
  loading.value = true;
  const params : API.PictureUploadRequest = {fileUrl: fileUrl.value};
  params.spaceId = props.spaceId;
  if (props.picture) {
    params.id = props.picture.id;
  }
  const res = await uploadPictureByUrl(params)
  try {
    if (res.data.code === 0 && res.data.data) {
      message.success("File uploaded successfully");
      props.onSuccess?.(res.data.data);
    } else {
      message.error("Failed to upload image: " + res.data.message);
    }
  } catch (error) {
    message.error("Failed to upload image: " + error.message);
  } finally {
    loading.value = false;
  }
}

</script>
<style scoped>
.url-picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-width: 150px;
  min-height: 150px;
}

.url-picture-upload img {
  max-width: 100%;
  max-height: 480px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
