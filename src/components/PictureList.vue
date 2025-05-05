<script setup lang="ts">
import {useRouter} from "vue-router";
import {EditOutlined, DeleteOutlined, ShareAltOutlined} from "@ant-design/icons-vue";
import {message} from "ant-design-vue";
import {deletePicture} from "@/api/pictureController.ts";
import ShareModal from "@/components/ShareModal.vue";
import {ref} from "vue";

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  onReload?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  dataList: ()=>[],
  loading: false,
  showOp: false
})

const router = useRouter()
const doClick = (picture : API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`
  })
}

const doEdit = (picture, e) => {
  e.stopPropagation()
  router.push({
    path: `/addPicture`,
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    }
  })
}

const doDelete = async (picture, e) => {
  e.stopPropagation()
  const id = picture.id
  if (!id) {
    return
  }
  const res = await deletePicture({id})
  if (res.data.code === 0) {
    message.success("Deleted successfully.")
    // Reload the whole page
    props?.onReload()
  } else {
    message.error("Failed to delete picture.")
  }
}


const shareModalRef = ref()
const shareLink = ref<string>()
const doShare= (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  shareLink.value = picture.id = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  if (shareModalRef.value) {
    shareModalRef.value.openModal()
  }
}
</script>

<template>
  <div id="picture-list">
    <!--    Picture list-->
    <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 5}"
            :data-source="dataList"
            :loading="loading">
      <template #renderItem="{ item :picture }">
        <a-list-item style="padding: 0">
          <a-card hoverable @click="doClick(picture)">
            <template #cover>
              <img :alt="picture.name" :src="picture.url" style="height: 180px; object-fit: cover"/>
            </template>
            <a-card-meta :title="picture.name">
              <template #description>
                <a-flex>
                  <a-tag color="green">
                    {{ picture.category ?? 'Default' }}
                  </a-tag>
                  <a-tag v-for="tag in picture.tags" :key="tag">
                    {{ tag }}
                  </a-tag>
                </a-flex>
              </template>
            </a-card-meta>
            <template v-if="showOp" #actions>
              <a-space @click="e=> doShare(picture,e)">
                <ShareAltOutlined/>
                Share
              </a-space>
              <a-space @click="e=> doEdit(picture,e)">
                <EditOutlined />
                Edit
              </a-space>
              <a-space @click="e=> doDelete(picture,e)">
                <DeleteOutlined/>
                Delete
              </a-space>

            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <ShareModal ref="shareModalRef" :link="shareLink" />

  </div>
</template>

<style scoped>
</style>