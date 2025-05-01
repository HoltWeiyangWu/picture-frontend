<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {getSpaceVoById} from "@/api/spaceController.ts";
import {message} from "ant-design-vue";
import {listPictureVoByPage} from "@/api/pictureController.ts";
import {formatSize} from "@/utils";
import PictureList from "@/components/PictureList.vue";
// Obtain information about current picture space
interface Props {
  id: string | number
}
const props = defineProps<Props>()
const space = ref<API.SpaceVO>({})
const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoById({id: props.id})
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error("Failed to load space: " + res.data.message)
    }
  } catch (e) {
    message.error("Failed to load space: " + e.message)
  }
}

// Display pictures within this space
const dataList = ref<API.PictureVO[]>([])
const total = ref(0)
const loading = ref(true)

// Parameters for the search
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 15,
  sortField: "createTime",
  sortOrder: "descend",
})

// Change page query parameters
const onPageChange = (page: number, pageSize: number) => {
  searchParams.current = page;
  searchParams.pageSize = pageSize;
  fetchData();
}

const fetchData = async () => {
  loading.value = true
  // Convert search parameters
  const params = {
    spaceId: props.id,
    ...searchParams,
  }
  const res = await listPictureVoByPage(params)
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error("Fails to fetch picture list: " + res.data.message)
  }
  loading.value = false
}

onMounted(() => {
  fetchSpaceDetail()
  fetchData()
})
</script>

<template>
  <a-flex justify="space-between">
    <h2>{{space.spaceName}} (Private storage space)</h2>
    <a-space size="middle">
      <a-button type="primary" :href="`/addPicture?spaceId=${space.id}`" target="_blank">
        + Add Picture
      </a-button>
      <a-tooltip :title="`Used storage ${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`">
        <a-progress
            type="circle"
            :size="42"
            :percent="((space.totalSize*100)/space.maxSize).toFixed(1)"
        />
      </a-tooltip>
    </a-space>
  </a-flex>
  <!--    Picture list-->
  <PictureList :data-list="dataList" :loading="loading" :showOp="true" :onReload="fetchData"/>
  <a-pagination
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      :show-total="()=> `Total: ${total} / ${space.maxCount}`"
      @change="onPageChange"
      style="text-align: right"
  />
</template>

<style scoped>
</style>



