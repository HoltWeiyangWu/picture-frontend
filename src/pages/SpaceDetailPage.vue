<script setup lang="ts">
import {computed, h, onMounted, ref, watch} from "vue";
import {getSpaceVoById} from "@/api/spaceController.ts";
import {message} from "ant-design-vue";
import {listPictureVoByPage} from "@/api/pictureController.ts";
import {formatSize} from "@/utils";
import PictureList from "@/components/PictureList.vue";
import PictureSearchForm from "@/components/PictureSearchForm.vue";
import BatchEditPictureModal from "@/components/BatchEditPictureModal.vue";
import {EditOutlined, BarChartOutlined} from "@ant-design/icons-vue";
import {SPACE_PERMISSION_ENUM, SPACE_TYPE_ENUM, SPACE_TYPE_MAP} from "../constants/space.ts";
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
const searchParams = ref<API.PictureQueryRequest>({
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

const onSearch = (newSearchParams : API.PictureQueryRequest) => {
  searchParams.value = {
    ...searchParams.value,
    ...newSearchParams,
    current: 1,
  }
  fetchData()
}


const fetchData = async () => {
  loading.value = true
  // Convert search parameters
  const params = {
    spaceId: props.id,
    ...searchParams.value,
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

const batchEditPictureModalRef = ref()
const doBatchEdit = () => {
  if (batchEditPictureModalRef.value) {
    batchEditPictureModalRef.value.openModal()
  }
}

watch(()=>props.id, (newSpaceId) => {
  fetchSpaceDetail()
  fetchData()
})

// Check permission
function createPermissionChecker(permission:string) {
  return computed(()=> {
    return (space.value.permissionList ?? []).includes(permission)
  })
}

const canManageSpaceUser = createPermissionChecker(SPACE_PERMISSION_ENUM.SPACE_USER_MANAGE)
const canUploadPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_UPLOAD)
const canEditPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDeletePicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)
</script>

<template>
  <a-flex justify="space-between">
    <h2>{{space.spaceName}} -- {{SPACE_TYPE_MAP[space.spaceType]}}</h2>
    <a-space size="middle">
      <a-tooltip :title="`Used storage ${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`">
        <a-progress
            type="circle"
            :size="42"
            :percent="((space.totalSize*100)/space.maxSize).toFixed(1)"
        />
      </a-tooltip>
      <a-button v-if="canUploadPicture" type="primary" :href="`/addPicture?spaceId=${space.id}`" >
        + Add Picture
      </a-button>
      <a-button v-if="canEditPicture" :icon="h(EditOutlined)" @click="doBatchEdit">
        Multiple edit
      </a-button>
      <a-button
          v-if="canManageSpaceUser"
          type="primary"
          ghost
          :icon="h(BarChartOutlined)"
          :href="`/spaceAnalyse?spaceId=${id}`"
      >
        Analyse
      </a-button>
      <a-button
          v-if="canManageSpaceUser && space.spaceType === SPACE_TYPE_ENUM.TEAM"
          type="primary"
          ghost
          :icon="h(TeamOutlined)"
          :href="`/spaceUserManage/${id}`"
      >
        Manage user
      </a-button>
    </a-space>
  </a-flex>

  <PictureSearchForm class="search-form" :onSearch = "onSearch"/>
  <!--    Picture list-->
  <PictureList :data-list="dataList"
               :loading="loading"
               :showOp="true"
               :onReload="fetchData"
               :canDelete="canDeletePicture"
               :canEdit="canEditPicture"
  />
  <a-pagination
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      :show-total="()=> `Total: ${total} / ${space.maxCount}`"
      @change="onPageChange"
      style="text-align: right"
  />
  <BatchEditPictureModal
      ref="batchEditPictureModalRef"
      :spaceId="id"
      :pictureList="dataList"
      :onSuccess="fetchData"
  />
</template>

<style scoped>
.search-form {
  margin-bottom: 16px;
}
</style>



