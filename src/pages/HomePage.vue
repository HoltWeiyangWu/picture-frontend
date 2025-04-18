<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {listPictureTagCategory, listPictureVoByPage} from "@/api/pictureController.ts";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";

const dataList = ref<API.PictureVO[]>([])
const total = ref(0)
const loading = ref(true)

// Parameters for the search
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: "createTime",
  sortOrder: "descend",
})

const fetchData = async () => {
  loading.value = true
  // Convert search parameters
  const params = {
    ...searchParams,
    tags: []
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  selectedTagList.value.forEach((useTag, index)=> {
    if(useTag) {
      params.tags.push(tagsList.value[index])
    }
  })
  const res = await listPictureVoByPage(params)
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error("Fails to fetch picture list: " + res.data.message)
  }
  loading.value = false
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
    onChange: (page: number, pageSize: number) => {
      searchParams.current = page;
      searchParams.pageSize = pageSize;
      fetchData();
    }
  }
})

// Update search parameters when searching
const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

// Tags and category
const categoryList = ref<string[]>([])
const tagsList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const selectedTagList = ref<boolean>([])

const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategory()
  if (res.data.code === 0 && res.data.data) {
    tagsList.value = res.data.data.tagList ?? [];
    categoryList.value = res.data.data.categoryList ?? [];
  } else {
    message.error("Fails to fetch tag and category list: " + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})


const router = useRouter()
const doClick = (picture : API.PictureVO) => {
  router.push({
    path: `picture/${picture.id}`
  })
}
</script>

<template>
  <div id="home-page">
    <!--  Search bar-->
    <div class="search-bar">
      <a-input-search
          v-model:value="searchParams.searchText"
          placeholder="Find a picture..."
          enter-button="Find"
          size="large"
          @search="doSearch"
      />
    </div>
    <!--    Tags and category filter-->
    <a-tabs v-model:active-key="selectedCategory" @change="doSearch">
      <a-tab-pane tab="All" key="all"/>
      <a-tab-pane v-for="category in categoryList" :tab="category" :key="category"/>
    </a-tabs>
    <div class="tag-bar">
      <span style="margin-right: 8px">Tags:</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
            v-for="(tag, index) in tagsList"
            :key="tag"
            v-model:checked="selectedTagList[index]"
            @change="doSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>
    <!--    Picture list-->
    <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6}"
            :data-source="dataList"
            :pagination="pagination"
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
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped>
#home-page .search-bar {
  max-width: 480px;
  margin: 0 auto 18px;
}
#home-page .tag-bar {
  margin-bottom: 16px;
}
</style>