<script setup lang="ts">
// Columns to show in a table
import {computed, onMounted, reactive, ref} from "vue";
import {deletePicture, listPictureByPage, listPictureTagCategory, reviewPicture} from "@/api/pictureController.ts";
import {message} from "ant-design-vue";
import dayjs from "dayjs";
import {PIC_REVIEW_STATUS_ENUM, PIC_REVIEW_STATUS_MAP, PIC_REVIEW_STATUS_OPTIONS} from "@/constants/picture.ts";

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'URL',
    dataIndex: 'url',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Introduction',
    dataIndex: 'introduction',
  },
  {
    title: 'Category',
    dataIndex: 'category',
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
  },
  {
    title: 'Properties',
    dataIndex: 'properties',
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
    title: 'Review Info',
    dataIndex: 'reviewMessage',
  },
  {
    title: 'Action',
    key: 'action',
  }
]

const dataList = ref<API.Picture>([])
const total = ref(0)

// Parameters for the search
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: "createTime",
  sortOrder: "descend",
})

const fetchData = async () => {
  const res = await listPictureByPage({
    ...searchParams,
    nullSpaceId: true
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error("Fails to fetch picture list: " + res.data.message)
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
    showTotal: (total) => `total picture: ${total}`,
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

// Delete a picture by its id
const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deletePicture({id});
  if (res.data.code === 0) {
    message.success("Successfully deleted picture")
    fetchData()
  } else {
    message.error("Fail to delete picture: " + res.data.message)
  }
}

// Handle review status (either pass or reject)
const handleReview = async (record: API.Picture, reviewStatus: number) => {
  const reviewMessage = reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? "Passed by admin" : "Rejected by admin"
  const res = await reviewPicture({
    id: record.id,
    reviewMessage,
    reviewStatus,
  })
  try {
    if (res.data.code === 0) {
      message.success("Successfully reviewed picture")
      await fetchData()
    } else {
      message.error("Fail to reviewed picture: " + res.data.message)
    }
  } catch (e) {
    message.error("Fail to reviewed picture: " + e.message)
  }
}

const tagsOptions = ref<string[]>([])

const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategory()
  if (res.data.code === 0 && res.data.data) {
    tagsOptions.value = (res.data.data.tagList ?? []).map((data:string) => {
      return {
        label: data,
        value: data
      }
    })
  }
}
onMounted(()=> {
  getTagCategoryOptions()
})

</script>
<template>

  <!--   Search bar to filter picture list-->
  <a-form layout="inline" :model="searchParams" @finish="doSearch">
    <a-form-item label="Keyword">
      <a-input v-model:value="searchParams.searchText" placeholder="Search keyword" allow-clear></a-input>
    </a-form-item>
    <a-form-item label="Category">
      <a-input v-model:value="searchParams.category" placeholder="Name" allow-clear></a-input>
    </a-form-item>
    <a-form-item label="Tags">
      <a-select v-model:value="searchParams.tags"
                placeholder="Tags"
                :options="tagsOptions"
                mode="tags"
                style="min-width: 180px"
                allow-clear
      />
    </a-form-item>
    <a-form-item label="Review Status">
      <a-select v-model:value="searchParams.reviewStatus"
               :options="PIC_REVIEW_STATUS_OPTIONS"
                style="min-width: 180px"
               placeholder="Review status"
               allow-clear></a-select>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">Search</a-button>
    </a-form-item>
  </a-form>

  <a-space style="display: flex; justify-content: flex-end; margin-top: 10px" >
    <a-button type="primary" href="/addPicture" >+ Add Picture</a-button>
    <a-button type="primary" href="/addPicture/batch" ghost>+ Generate Pictures</a-button>
  </a-space>
<!--  Table to display data-->
  <a-table :columns="columns" :data-source="dataList" :pagination="pagination" @change="doTableChange"
           table-layout="fixed">
    <template #headerCell="{ column }">
    </template>

    <template #bodyCell="{column, record}">
      <template v-if="column.dataIndex === 'url'">
        <a-image :src="record.url"/>
      </template>
      <template v-else-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.dataIndex === 'editTime'">
        {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.dataIndex === 'properties'">
        <div><b>Height:</b> {{ record.picHeight }}</div>
        <div><b>Width:</b> {{ record.picWidth }}</div>
        <div><b>Scale:</b> {{ (record.picScale).toFixed(2) }}</div>
        <div><b>Size:</b> {{ (record.picSize / 1024).toFixed(2) }}KB</div>
      </template>
      <template v-else-if="column.dataIndex === 'tags'">
        <a-space wrap>
          <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag">
            {{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template v-else-if="column.dataIndex === 'reviewMessage'">
        <div><b>Status: </b> {{PIC_REVIEW_STATUS_MAP[record.reviewStatus]}}</div>
        <div><b>Message: </b> {{record.reviewMessage}}</div>
        <div><b>Reviewer: </b> {{record.reviewerId}}</div>
      </template>
      <!--Operations for admins-->
      <template v-else-if="column.key === 'action'">
        <div>
          <a :href="`/addPicture/?id=${record.id}`"
             target="_blank">
            <a-button type="link" style="">
              Edit
            </a-button>
          </a>
          <a-popconfirm title="Confirm to delete this picture?"
                        @confirm="doDelete(record.id)"
                        placement="topRight">
            <a-button danger >
              Delete
            </a-button>
          </a-popconfirm>
          <a-button v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
                    type="link"
                    @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)">
            Pass
          </a-button>
          <a-popconfirm title="Confirm to reject this picture?"
                        @confirm="handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECTED)"
                        placement="topRight">

            <a-button v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECTED"
                      danger>
              Reject
            </a-button>
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>
</template>


<style scoped>

</style>