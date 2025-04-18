<script setup lang="ts">
import {computed, h, onMounted, ref} from "vue";
import {deletePicture, getPictureVoById} from "@/api/pictureController.ts";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";
import {downloadImage, formatSize, roundToTwo} from "@/utils";
import {DeleteOutlined, EditOutlined, DownloadOutlined} from "@ant-design/icons-vue";
import {useLoginUserStore} from "@/stores/user.ts";

interface Props {
  id: string | number
}

const props = defineProps<Props>()
const picture = ref<API.PictureVO>({})

const loginUserStore = useLoginUserStore()
const canEdit = computed(() => {
  const loginUser = loginUserStore.loginUser;
  if (!loginUser.id) {
    return false
  }
  const user = picture.value.user || {}
  return loginUser.id === user.id || loginUser.userRole === 'admin'
})

// Obtain previous data
const fetchPictureDetail = async () => {
  try {
    const res = await getPictureVoById({id: props.id})
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error("Failed to load picture: " + res.data.message)
    }
  } catch (e) {
    message.error("Failed to load picture: " + e.message)
  }
}

// Delete picture for admin/user
const doDelete = async () => {
  try {
    const res = await deletePicture({id: props.id});
    if (res.data.code === 0) {
      message.success("Successfully deleted picture")
      router.go(-1)
    } else {
      message.error("Fail to delete picture: " + res.data.message)
    }
  } catch (e) {
    message.error("Fail to delete picture: " + e.message)
  }
}

const router = useRouter()
const doEdit = () => {
  router.push(`/addPicture/?id=${props.id}`)
}

const doDownload = () => {
  downloadImage(picture.value.url)
}
// Load data for the first request
onMounted(() => {
  fetchPictureDetail()
})
</script>

<template>
  <div id="picture-detail-page">
    <a-row :gutter="[16, 16]">
      <a-col :sm="24" :md="16" :xl="18">
        <a-card title="Picture preview">
          <a-image :src="picture.url" style="max-height: 600px; object-fit: contain" />
        </a-card>
      </a-col>
      <a-col :sm="24" :md="8" :xl="6">
        <a-descriptions :column="1">
          <a-descriptions-item label="Creator">
            <a-space>
              <a-avatar :size="24" :src="picture.creator?.userAvatar" :alt="picture.creator?.userName" />
              <div>{{ picture.creator?.userName }}</div>
            </a-space>
          </a-descriptions-item>
          <a-descriptions-item label="Name">
            {{ picture.name ?? 'New picture' }}
          </a-descriptions-item>
          <a-descriptions-item label="Introduction">
            {{ picture.introduction ?? '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="Category">
            {{ picture.category ?? 'Default' }}
          </a-descriptions-item>
          <a-descriptions-item label="Tag">
            <a-tag v-for="tag in picture.tags" :key="tag">
              {{ tag }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Format">
            {{ picture.picFormat ?? '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="Width">
            {{ picture.picWidth ?? '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="Height">
            {{ picture.picHeight ?? '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="Scale">
            {{ roundToTwo(picture.picScale) ?? '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="Size">
            {{ formatSize(picture.picSize) }}
          </a-descriptions-item>
        </a-descriptions>
        <a-space wrap>
          <a-button type="primary" :icon="h(DownloadOutlined)" @click="doDownload">
            Download
          </a-button>

          <a-button v-if="canEdit"
                    type="default"
                    :icon="h(EditOutlined)"
                    @click="doEdit">
            Edit
          </a-button>
          <a-popconfirm v-if="canEdit"
                        title="Confirm to delete this picture?"
                        @confirm="doDelete"
                        placement="topRight">
            <a-button
                      danger
                      :icon="h(DeleteOutlined)">
              Delete
            </a-button>
          </a-popconfirm>
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
</style>



