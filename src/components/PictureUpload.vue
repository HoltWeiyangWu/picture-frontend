<template>
  <div class="picture-upload">
    <a-upload
        name="picture-upload"
        list-type="picture-card"
        :show-upload-list="false"
        :custom-request="handleUpload"
        :before-upload="beforeUpload"
    >
      <img v-if="picture?.url" :src="picture?.url" alt="picture"/>
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">Click or drag to upload</div>
      </div>
    </a-upload>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {PlusOutlined, LoadingOutlined} from '@ant-design/icons-vue';
import {message} from 'ant-design-vue';
import type {UploadProps} from 'ant-design-vue';
import {uploadPicture} from "@/api/pictureController.ts";

interface Props {
  picture?: API.PictureVO
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()


const loading = ref<boolean>(false);

const handleUpload = async ({file} : any) => {
  loading.value = true;
  const params = props.picture ? {id: props.picture.id} : {};
  const res = await uploadPicture(params, {}, file)
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

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  // Validate picture format
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!');
  }
  // Validate picture size
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};
</script>
<style scoped>
.picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-width: 150px;
  min-height: 150px;
}

.picture-upload img {
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
