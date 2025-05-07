<template>
  <a-modal class="image-cropper" v-model:open="visible" title="Edit picture" :footer="false"
           @cancel="closeModal" width="550px">
    <vue-cropper
        ref="cropperRef"
        :img="imageUrl"
        :autoCrop="true"
        :fixedBox="false"
        :centerBox="true"
        :canMoveBox="true"
        :info="true"
        outputType="png"
    ></vue-cropper>
    <div style="margin-bottom: 16px"/>
    <div class="image-cropper-actions">
      <a-space>
        <a-button @click="rotateLeft">Rotate Left</a-button>
        <a-button @click="rotateRight">Rotate Right</a-button>
        <a-button @click="changeScale(1)">Zoom In</a-button>
        <a-button @click="changeScale(-1)">Zoom Out</a-button>
        <a-button type="primary" :loading="loading" @click="handleConfirm">Confirm</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {message} from "ant-design-vue";
import {uploadPicture} from "@/api/pictureController.ts";
interface Props {
  imageUrl?: string
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()

const visible = ref(false)

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

defineExpose({
  openModal,
})


// Referring cropper component
const cropperRef = ref()

const rotateLeft = () => {
  cropperRef.value?.rotateLeft()
}

const rotateRight = () => {
  cropperRef.value?.rotateRight()
}

const changeScale = (num: number) => {
  cropperRef.value?.changeScale(num)
}

const loading = ref<boolean>(false);
const handleConfirm = () => {
  cropperRef.value.getCropBlob((blob: Blob) => {
    const fileName = (props.picture?.name || 'image') + '.png'
    const file = new File([blob], fileName, {type: blob.type})
    handleUpload({file})
  })
}

const handleUpload = async ({file}: any) => {
  loading.value = true
  try {
    const params: API.PictureUploadRequest = props.picture ? {id: props.picture.id} : {}
    params.spaceId = props.spaceId
    const res = await uploadPicture(params, {}, file)
    if (res.data.code === 0 && res.data.data) {
      message.success("Uploaded successfully.")
      props.onSuccess?.(res.data.data)
      closeModal()
    } else {
      message.error("Failed to upload picture: " + res.data.message)
    }
  } catch (error) {
    message.error("Failed to upload file")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.image-cropper {
  text-align: center;
}
.image-cropper .ant{
  text-align: center;
}

.image-cropper .vue-cropper {
  height: 400px !important;
}
</style>
