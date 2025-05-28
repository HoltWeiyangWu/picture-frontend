<template>
  <div id="addSpacePage">
    <h2 style="margin-bottom: 16px">{{route.query?.id ? 'Edit space' : 'Create space'}} -- {{SPACE_TYPE_MAP[spaceType]}}</h2>
    <a-form layout="vertical" :model="spaceForm" @finish="handleSubmit">
      <a-form-item name="name" label="Name">
        <a-input v-model:value="spaceForm.spaceName" placeholder="Name here"></a-input>
      </a-form-item>
      <a-form-item label="Level">
        <a-select v-model:value="spaceForm.spaceLevel"
                  placeholder="Space Level here"
                  :options="SPACE_LEVEL_OPTIONS"
                  style="min-width: 180px"
                  allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">
          {{route.query?.id ? 'Edit' : 'Create'}}
        </a-button>
      </a-form-item>
    </a-form>
    <a-card title="Levels of space">
      <a-typography-paragraph>
        * If you would like to upgrade your space, please contact Admin:
        <a>holtwyw@hotmail.com</a>
      </a-typography-paragraph>
      <a-typography-paragraph v-for="spaceLevel in spaceLevelList">

        <b>{{spaceLevel.text}}: </b>
        Size {{formatSize(spaceLevel.maxSize)}},
        Number of files: {{spaceLevel.maxCount}}
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from "vue";
import {message} from "ant-design-vue";
import {addSpace, getSpaceVoById, listSpaceLevels, updateSpace} from "@/api/spaceController.ts";

import {SPACE_LEVEL_OPTIONS, SPACE_TYPE_ENUM, SPACE_TYPE_MAP} from "@/constants/space.ts";
import {useRoute, useRouter} from "vue-router";
import {formatSize} from "@/utils";

const space = ref<API.SpaceVO>()
const spaceForm = reactive<API.SpaceAddRequest | API.SpaceEditRequest>({})
const loading = ref(false);
const spaceLevelList = ref<API.SpaceLevel[]>([])

const fetchSpaceLevelList = async () => {
  const res = await listSpaceLevels()
  if (res.data.code === 0 && res.data.data) {
    spaceLevelList.value = res.data.data;
  } else {
    message.error("Failed to fetch space levels" + res.data.message);
  }
}

const router = useRouter();
// Edit space by submitting a space form
const handleSubmit = async () => {
  loading.value = true;
  const spaceId = space.value?.id
  let res;
  // Update with id
  if (spaceId) {
    res = await updateSpace({
      id : spaceId,
      ...spaceForm,
    })
  } else { // Create a space
    res = await addSpace({
      ...spaceForm,
      spaceType: spaceType.value,
    })
  }
  // Record user state if editing is successful
  if (res.data.code === 0 && res.data.data) {
    message.success("Operation successfully")
    await router.push({
      path: `/space/${spaceId ?? res.data.data}`,
    })
  } else {
    message.error('Failed to create space: ' + res.data.message)
  }
  loading.value = false;
}

// Obtain previous data
const route = useRoute()
const getOldSpace = async () => {
  const id = route.query?.id
  if (!id) {
    return
  }
  const res = await getSpaceVoById({id})
  if (res.data.code === 0 && res.data.data) {
    const data = res.data.data
    space.value = data
    spaceForm.spaceName = data.spaceName
    spaceForm.spaceLevel = data.spaceLevel
    message.success("Loaded space successfully")
  }
}

onMounted(() => {
  fetchSpaceLevelList()
  getOldSpace()
})

const spaceType = computed(()=> {
  if (route.query?.type) {
    return Number(route.query.type)
  }
  return SPACE_TYPE_ENUM.PRIVATE
})
</script>
<style scoped>
#addSpacePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
