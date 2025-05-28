<script setup lang="ts">
// Columns to show in a table
import {onMounted, reactive, ref} from "vue";
import {DeleteOutlined} from "@ant-design/icons-vue"
import {message} from "ant-design-vue";
import dayjs from "dayjs";
import {addSpaceUser, deleteSpaceUser, editSpaceUser, listSpaceUser} from "@/api/spaceUserController.ts";
import {SPACE_ROLE_OPTIONS} from "@/constants/space.ts";

const columns = [
  {
    title: 'User',
    dataIndex: 'userVO',
  },
  {
    title: 'Role',
    dataIndex: 'role',
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

interface Props {
  id: string,
}

const props  = defineProps<Props>()

const dataList = ref([])
const fetchData = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }
  const res = await listSpaceUser({
    spaceId,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data?? []
  } else {
    message.error("Fails to fetch user list: " + res.data.message)
  }
}


const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deleteSpaceUser({id});
  if (res.data.code === 0) {
    message.success("Successfully deleted user")
    await fetchData()
  } else {
    message.error("Fail to delete user: " + res.data.message)
  }
}

const editSpaceRole = async (value, record) => {
  const res = await editSpaceUser({
    id: record.id,
    role: value,
  });
  if (res.data.code === 0) {
    message.success('Edited successfully')
  } else {
    message.error('Failed to edit，' + res.data.message)
  }
}
const formData = reactive<API.SpaceUserAddRequest>({})
const handleSubmit = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }
  const res = await addSpaceUser({
    spaceId,
    ...formData,
  })
  if (res.data.code === 0) {
    await fetchData()
    message.success("Successfully added user to the team")
  } else {
    message.error("Failed to add user: " + res.data.message)
  }
}

// Load data for the first request
onMounted(() => {
  fetchData()
})
</script>
<template>
  <a-form layout="inline" :model="formData" @finish="handleSubmit">
    <a-form-item label="User ID" name="userId">
      <a-input v-model:value="formData.userId" placeholder="Add user with their ID  " allow-clear />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">Add user</a-button>
    </a-form-item>
  </a-form>

  <a-table :columns="columns" :data-source="dataList" :pagination="pagination" @change="doTableChange"
           table-layout="fixed">
    <template #headerCell="{ column }">
    </template>

    <template #bodyCell="{column, record}">
      <!--Fixed fields-->
      <template v-if="column.dataIndex === 'createTime'">
        {{ dayjs(record?.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.dataIndex === 'role'">
          <a-select
              v-model:value="record.role"
              :options="SPACE_ROLE_OPTIONS"
              :disabled="record.role === 'admin'"
              @change="(value) => editSpaceRole(value, record)"
          />
      </template>
      <template v-else-if="column.dataIndex === 'userVO'">
        <a-space>
          <a-avatar :src="record.userVO?.userAvatar" />
          {{ record.userVO?.userName }}
        </a-space>

      </template>
      <!--Operations for admins-->
      <template v-else-if="column.key === 'action' && record.role !== 'admin'">
        <div>
          <a-popconfirm title="Confirm to delete this user?"
                        @confirm="doDelete(record.id)"
                        placement="topRight">
            <DeleteOutlined style="color: red;"/>
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>
</template>


<style scoped>

</style>