<script setup lang="ts">
// Columns to show in a table
import {computed, onMounted, reactive, ref} from "vue";
import {deleteUser, listUserVoByPage, updateUser} from "@/api/userController.ts";
import {DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined} from "@ant-design/icons-vue"
import {message} from "ant-design-vue";
import {cloneDeep} from 'lodash-es';
import type {UnwrapRef} from 'vue';
import dayjs from "dayjs";
import {useLoginUserStore} from "@/stores/user.ts";

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
    title: 'Actions',
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
onMounted(() => {
  fetchData()
})

const pagination = computed(() => {
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

const loginUserStore = useLoginUserStore()
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const doEdit = (key: string) => {
  editableData[key] = cloneDeep(dataList.value.filter(item => key === item.id)[0]);
};

const doSave = async (id: string) => {
  if (!id) {
    return
  }
  Object.assign(dataList.value.filter(item => id === item.id)[0], editableData[id]);
  const res = await updateUser(editableData[id]);
  if (res.data.code === 0) {
    message.success("Successfully updated user")
    await fetchData()
    await loginUserStore.fetchLoginUser()
  } else {
    message.error("Fail to update user: " + res.data.message)
  }

  delete editableData[id];
};
const doCancel = (key: string) => {
  delete editableData[key];
};

</script>
<template>
  <!--   Search bar to filter user list-->
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

  <a-table :columns="columns" :data-source="dataList" :pagination="pagination" @change="doTableChange"
           table-layout="fixed">
    <template #headerCell="{ column }">
    </template>

    <template #bodyCell="{column, record}">
      <!--Display or update fields-->
      <template v-if="['userName', 'userAvatar', 'userProfile', 'userRole'].includes(column.dataIndex)">
        <a-input v-if="editableData[record.id] && column.dataIndex != 'userRole'"
                 v-model:value="editableData[record.id][column.dataIndex]"
                 style="margin: -5px 0"/>
        <a-radio-group
            v-else-if="editableData[record.id] && column.dataIndex == 'userRole'"
            v-model:value="editableData[record.id][column.dataIndex]"
            button-style="solid">
          <a-radio-button value="admin">Admin</a-radio-button>
          <a-radio-button value="user">User</a-radio-button>
        </a-radio-group>
        <template v-else>
          <template v-if="column.dataIndex === 'userAvatar'">
            <a-image :src="record.userAvatar"/>
          </template>
          <template v-if="column.dataIndex === 'userName'">
            {{ record.userName }}
          </template>
          <template v-if="column.dataIndex === 'userProfile'">
            {{ record.userProfile }}
          </template>
          <template v-else-if="column.dataIndex === 'userRole'">
            <div v-if="record.userRole === 'admin'">
              <a-tag color="green">Admin</a-tag>
            </div>
            <div v-else>
              <a-tag color="blue">User</a-tag>
            </div>
          </template>
        </template>
      </template>

      <!--Fixed fields-->
      <template v-else-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>

      <!--Operations for admins-->
      <template v-else-if="column.key === 'action'">
        <div>
          <span v-if="editableData[record.id]">
            <CheckOutlined @click="doSave(record.id)" style="margin-right: 20px; color: dodgerblue"/>
            <CloseOutlined @click="doCancel(record.id)" style="color: red"/>
          </span>
          <span v-else>
            <EditOutlined @click="doEdit(record.id)" style="margin-right: 20px; color: dodgerblue"/>
          <a-popconfirm title="Confirm to delete this user?"
                        @confirm="doDelete(record.id)"
                        placement="topRight">
            <DeleteOutlined v-if="record.id != loginUserStore.loginUser?.id"
                            style="color: red;"/>
          </a-popconfirm>
          </span>
        </div>
      </template>
    </template>
  </a-table>
</template>


<style scoped>

</style>