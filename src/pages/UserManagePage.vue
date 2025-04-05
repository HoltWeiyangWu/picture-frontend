<script setup lang="ts">
// Columns to show in a table
import {computed, onMounted, reactive, ref} from "vue";
import {deleteUser, listUserVoByPage} from "@/api/userController.ts";
import {message} from "ant-design-vue";
import dayjs from "dayjs";

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Account',
    dataIndex: 'userAccount',
  },
  {
    title: 'Name',
    dataIndex: 'userName',
  },
  {
    title: 'Avatar',
    dataIndex: 'userAvatar',
  },
  {
    title: 'Profile',
    dataIndex: 'userProfile',
  },
  {
    title: 'Role',
    dataIndex: 'userRole',
  },
  {
    title: 'Create Time',
    dataIndex: 'createTime',
  },
  {
    title: 'Action',
    key: 'action',
  }
]

const dataList = ref([])
const total = ref(0)

// Parameters for the search
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
})

const fetchData = async () => {
  const res = await listUserVoByPage({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error("Fails to fetch user list: " + res.data.message)
  }
}

// Load data for the first request
onMounted(()=>{
  fetchData()
})

const pagination = computed(()=>{
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `total user: ${total}`,
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

const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deleteUser({id});
  if (res.data.code === 0) {
    message.success("Successfully deleted user")
    fetchData()
  } else {
    message.error("Fail to delete user: " + res.data.message)
  }
}

</script>
<template>
  <a-form layout="inline" :model="searchParams" @finish="doSearch">
    <a-form-item label="Account">
      <a-input v-model:value="searchParams.userAccount" placeholder="Search account"></a-input>
    </a-form-item>
    <a-form-item label="Name">
      <a-input v-model:value="searchParams.userName" placeholder="Search name"></a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">Search</a-button>
    </a-form-item>
  </a-form>

  <a-table :columns="columns" :data-source="dataList" :pagination="pagination" @change="doTableChange" >
    <template #headerCell="{ column }">
    </template>

    <template #bodyCell="{column, record}">
      <template v-if="column.dataIndex === 'userAvatar'">
        <a-image :src="record.userAvatar" :width="120"/>
      </template>
      <template v-else-if="column.dataIndex === 'userRole'">
        <div v-if="record.userRole === 'admin'">
          <a-tag color="green">Admin</a-tag>
        </div>
        <div v-else>
          <a-tag color="blue">User</a-tag>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'createTime'">
        {{dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-popconfirm title="Confirm to delete this user?" @confirm="doDelete(record.id)">
          <a-button danger >Delete</a-button>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
</template>


<style scoped>

</style>