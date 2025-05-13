<script setup lang="ts">
// Columns to show in a table
import {computed, onMounted, reactive, ref} from "vue";
import {deleteSpace, listSpaceByPage} from "@/api/spaceController.ts";
import { formatSize} from "@/utils";

import {message} from "ant-design-vue";
import dayjs from "dayjs";
import {SPACE_LEVEL_MAP, SPACE_LEVEL_OPTIONS} from "@/constants/space.ts";

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'spaceName',
  },
  {
    title: 'Level',
    dataIndex: 'spaceLevel',
  },
  {
    title: 'Information',
    dataIndex: 'spaceUseInfo',
  },
  {
    title: 'Creator ID',
    dataIndex: 'creatorId',
  },
  {
    title: 'Create Time',
    dataIndex: 'createTime',
  },
  {
    title: 'Edit Time',
    dataIndex: 'editTime',
  },
  {
    title: 'Action',
    key: 'action',
  }
]

const dataList = ref<API.Space>([])
const total = ref(0)

// Parameters for the search
const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: "createTime",
  sortOrder: "descend",
})

const fetchData = async () => {
  const res = await listSpaceByPage({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error("Fails to fetch space list: " + res.data.message)
  }
}

// Load data for the first request
onMounted(() => {
  fetchData()
})

const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `total space: ${total}`,
  }
})

// Update table when pagination changes
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// Search according to parameters
const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

// Delete a space by its id
const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deleteSpace({id});
  if (res.data.code === 0) {
    message.success("Successfully deleted space")
    fetchData()
  } else {
    message.error("Fail to delete space: " + res.data.message)
  }
}

</script>
<template>
  <h2>Manage storage space</h2>
  <!--   Search bar to filter space list-->
  <a-form layout="inline" :model="searchParams" @finish="doSearch">
    <a-form-item label="Space Name">
      <a-input v-model:value="searchParams.spaceName" placeholder="Space name here" allow-clear></a-input>
    </a-form-item>
    <a-form-item label="Level">
      <a-select v-model:value="searchParams.spaceLevel"
                placeholder="Space Level here"
                :options="SPACE_LEVEL_OPTIONS"
                style="min-width: 180px"
                allow-clear
      />
    </a-form-item>
    <a-form-item label="Creator ID">
      <a-input v-model:value="searchParams.creatorId" placeholder="Creator ID here" allow-clear></a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">Search</a-button>
    </a-form-item>
  </a-form>

  <a-space style="display: flex; justify-content: flex-end; margin-top: 12px" >
    <a-button type="primary" href="/addSpace">+ Add Space</a-button>
    <a-button type="primary" ghost href="/spaceAnalyse?queryPublic=1">
      Analyse Public Space
    </a-button>
    <a-button type="primary" ghost href="/spaceAnalyse?queryAll=1">
      Analyse All Space
    </a-button>
  </a-space>
<!--  Table to display data-->
  <a-table :columns="columns" :data-source="dataList" :pagination="pagination" @change="doTableChange"
           table-layout="fixed">
    <template #headerCell="{ column }">
    </template>

    <template #bodyCell="{column, record}">
      <template v-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.dataIndex === 'editTime'">
        {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.dataIndex === 'spaceUseInfo'">
        <div><b>Size:</b> {{ formatSize(record.totalSize) }} / {{formatSize(record.maxSize)}}</div>
        <div><b>Number:</b> {{ record.totalCount }} / {{record.maxCount}}</div>
      </template>
      <template v-else-if="column.dataIndex === 'spaceLevel'">
        <div>{{SPACE_LEVEL_MAP[record.spaceLevel]}}</div>
      </template>
      <!--Operations for admins-->
      <template v-else-if="column.key === 'action'">
        <div>
          <a :href="`/addSpace/?id=${record.id}`"
             target="_blank">
            <a-button type="link" style="">
              Edit
            </a-button>
          </a>
          <div>
            <a-popconfirm title="Confirm to delete this space?"
                          @confirm="doDelete(record.id)"
                          placement="topRight">
              <a-button danger >
                Delete
              </a-button>
            </a-popconfirm>

          </div>
          <a-button type="link" :href="`/spaceAnalyse?spaceId=${record.id}`" target="_blank">
            Analyse
          </a-button>

        </div>
      </template>
    </template>
  </a-table>
</template>


<style scoped>

</style>