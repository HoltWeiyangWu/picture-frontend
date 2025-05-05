<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import dayjs from "dayjs";
import {listPictureTagCategory} from "@/api/pictureController.ts";
import {message} from "ant-design-vue";

// Define search parameters and properties
interface Props {
  onSearch?: (searchParams: API.PictureQueryRequest) => void
}

const props = defineProps<Props>()
const searchParams = reactive<API.PictureQueryRequest>({})
const doSearch = () => {
  props.onSearch?.(searchParams)
}

// Define parameters for Date
const dateRange = ref<[]>([])
const onRangeChange = (dates: any[], dateStrings: string[]) => {

  if (!dates || dates.length < 1) {
    searchParams.startEditTime = undefined
    searchParams.endEditTime = undefined

  } else {
    searchParams.startEditTime = dates[0].toDate()
    searchParams.endEditTime = dates[1].toDate()
  }
}
const rangePresets = ref([
  {label: 'Last 7 days', value: [dayjs().add(-7, 'd'), dayjs()]},
  {label: 'Last 14 days', value: [dayjs().add(-14, 'd'), dayjs()]},
  {label: 'Last 30 days', value: [dayjs().add(-30, 'd'), dayjs()]},
  {label: 'Last 90 days', value: [dayjs().add(-90, 'd'), dayjs()]}
])


//Find select options for category and tags

const categoryOptions = ref<string[]>([])
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
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data:string) => {
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

const doClear = () => {
  Object.keys(searchParams).forEach((key) => {
    searchParams[key] = undefined
  })
  dateRange.value = []
  props.onSearch?.(searchParams)
}
</script>

<template>
  <div class="picture-search-form">
    <a-form layout="inline" :model="searchParams" @finish="doSearch">

      <a-form-item label="Search Text" name="searchText">
        <a-input
            v-model:value="searchParams.searchText"
            placeholder="Search through name or intro"
            allow-clear
        />
      </a-form-item>

      <a-form-item label="Category" name="category">
        <a-auto-complete
            v-model:value="searchParams.category"
            style="min-width: 180px"
            :options="categoryOptions"
            placeholder="Search by category"
            allow-clear
        />
      </a-form-item>

      <a-form-item label="Tags" name="tags">
        <a-select
            v-model:value="searchParams.tags"
            style="min-width: 180px"
            :options="tagsOptions"
            mode="tags"
            placeholder="Tags here"
            allowClear
        />
      </a-form-item>

      <a-form-item label="Name" name="name">
        <a-input v-model:value="searchParams.name" placeholder="Name here" allow-clear/>
      </a-form-item>

      <a-form-item label="Introduction" name="introduction">
        <a-input v-model:value="searchParams.introduction" placeholder="Intro here" allow-clear/>
      </a-form-item>

      <a-form-item label="Edit Time" name="">
        <a-range-picker
            style="width: 400px"
            show-time
            v-model:value="dateRange"
            :placeholder="['From', 'To']"
            format="YYYY/MM/DD HH:mm:ss"
            :presets="rangePresets"
            @change="onRangeChange"
            allow-clear
        />
      </a-form-item>

      <a-form-item label="Width" name="picWidth">
        <a-input-number v-model:value="searchParams.picWidth"/>
      </a-form-item>

      <a-form-item label="Height" name="picHeight">
        <a-input-number v-model:value="searchParams.picHeight"/>
      </a-form-item>

      <a-form-item label="Picture Format" name="picFormat">
        <a-input v-model:value="searchParams.picFormat" placeholder="Format here" allow-clear/>
      </a-form-item>

      <a-form-item>
        <a-space>
          <a-form-item>
            <a-button type="primary" html-type="submit" style="width: 96px">Search</a-button>
          </a-form-item>

          <a-form-item>
            <a-button html-type="reset" @click="doClear">Clear</a-button>
          </a-form-item>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
.picture-search-form .ant-form-item {
  margin-top: 16px;
}
</style>