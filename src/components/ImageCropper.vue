<template>
  <a-modal class="image-cropper" v-model:open="visible" title="Edit picture" :footer="false"
           @cancel="closeModal" width="550px">
    <vue-cropper
        ref="cropperRef"
        :img="imageUrl+'?t='+new Date().getDate()"
        :autoCrop="true"
        :fixedBox="false"
        :centerBox="true"
        :canMoveBox="true"
        :info="true"
        outputType="png"
    ></vue-cropper>
    <div style="margin-bottom: 16px" />
    <div class="image-edit-actions" v-if="isTeamSpace">
      <a-space>
        <a-button v-if="editingUser" disabled>{{ editingUser.userName }} is editing</a-button>
        <a-button v-if="canEnterEdit" type="primary" ghost @click="enterEdit">Start editing</a-button>
        <a-button v-if="canLeaveEdit" danger ghost @click="exitEdit">Leave</a-button>
      </a-space>
    </div>
    <div style="margin-bottom: 16px"/>
    <div class="image-cropper-actions">
      <a-space>
        <a-button @click="rotateLeft" :disabled="!canEdit">Rotate Left</a-button>
        <a-button @click="rotateRight" :disabled="!canEdit">Rotate Right</a-button>
        <a-button @click="changeScale(1)" :disabled="!canEdit">Zoom In</a-button>
        <a-button @click="changeScale(-1)" :disabled="!canEdit">Zoom Out</a-button>
        <a-button type="primary" :loading="loading" @click="handleConfirm" :disabled="!canEdit">Confirm</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {computed, onUnmounted, ref, watchEffect} from 'vue'
import {message} from "ant-design-vue";
import {uploadPicture} from "@/api/pictureController.ts";
import {useLoginUserStore} from "@/stores/user.ts";
import PictureEditWebSocket from "@/utils/PictureEditWebSocket.ts";
import {PICTURE_EDIT_ACTION_ENUM, PICTURE_EDIT_MESSAGE_TYPE_ENUM} from "@/constants/picture.ts";
import {SPACE_TYPE_ENUM} from "@/constants/space.ts";
interface Props {
  imageUrl?: string
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
  space?: API.SpaceVO
}

const props = defineProps<Props>()

const visible = ref(false)

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
  if (websocket) {
    websocket.disconnect()
  }
  editingUser.value = undefined
}

defineExpose({
  openModal,
})


// Referring cropper component
const cropperRef = ref()

const rotateLeft = () => {
  cropperRef.value?.rotateLeft()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT)
}

const rotateRight = () => {
  cropperRef.value?.rotateRight()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT)
}

const changeScale = (num: number) => {
  cropperRef.value?.changeScale(num)
  if (num > 0) {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_IN)
  } else {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT)
  }
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


//----- Real-time editing ------
const loginUserStore = useLoginUserStore()
let loginUser = loginUserStore.loginUser
const editingUser = ref<API.UserVO>()

const isTeamSpace = computed(() => {
  return props.space?.spaceType === SPACE_TYPE_ENUM.TEAM;
})

const canEnterEdit = computed(() => {
  return !editingUser.value
})
const canLeaveEdit = computed(() => {
  return editingUser.value?.id === loginUser.id
})

const canEdit = computed(() => {
  if (!isTeamSpace.value) {
    return true;
  }
  return editingUser.value?.id === loginUser.id
})

let websocket: PictureEditWebSocket | null

const initWebsocket = () => {
  const pictureId = props.picture?.id
  if (!pictureId || !visible.value) {
    return
  }
  if (websocket) {
    websocket.disconnect()
  }

  websocket = new PictureEditWebSocket(pictureId)
  websocket.connect()

  // Listen to messages
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.INFO, (msg)=> {
    message.info(msg.message)
  })

  // Listen to error
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ERROR, (msg)=> {
    message.error(msg.message)
  })

  // Listen to entering events
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT, (msg)=> {
    message.info(msg.message)
    editingUser.value = msg.user
  })

  // Listen to editing events
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION, (msg)=> {
    message.info(msg.message)
    switch (msg.editAction) {
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT:
        cropperRef.value.rotateLeft()
        break;
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT:
        cropperRef.value.rotateRight()
        break;
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_IN:
        cropperRef.value.changeScale(1)
        break;
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT:
        cropperRef.value.changeScale(-1)
        break;
    }
  })

  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT, (msg)=> {
    message.info(msg.message)
    editingUser.value = undefined
  })
}


watchEffect(()=>{
  if (isTeamSpace.value) {
    initWebsocket()
  }
})

onUnmounted(()=>{
  if (websocket) {
    websocket.disconnect()
  }
  editingUser.value = undefined
})

const enterEdit = ()=> {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT,
    })
  }
}

const exitEdit = ()=> {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT,
    })
  }
}

const editAction = (action: string) => {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION,
      editAction: action,
    })
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
