<script setup lang="ts">
import VChart from 'vue-echarts'
import 'echarts'
import 'echarts-wordcloud'
import {computed, ref, watchEffect} from "vue";
import {
  getSpaceUserAnalyse
} from "@/api/spaceAnalyseController.ts";
import {message} from "ant-design-vue";



interface Props {
  queryAll?: boolean,
  queryPublic?: boolean,
  spaceId?: number,
  isAdmin?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
  isAdmin: false,
})


const userId = ref<string>()
const timeDimension = ref<string>('day')
const timeDimensionOptions = [
  {
    label: 'Day',
    value: 'day',
  },
  {
    label: 'Week',
    value: 'week',
  },
  {
    label: 'Month',
    value: 'month',
  },
]
const doSearch = (value: string) => {
  userId.value = value
}


// Obtain data
const dataList = ref<API.SpaceUserAnalyseResponse>([])
const loading = ref(true);

const fetchData = async () => {
  loading.value = true
  const res = await getSpaceUserAnalyse({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
    isAdmin: props.isAdmin,
    timeDimension: timeDimension.value,
    userId: userId.value,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data ?? []
  } else {
    message.error("Fails to fetch data: " + res.data.message)
  }
  loading.value = false
}
// Listen to the change of the parameters
watchEffect(()=>{
  fetchData()
})

// Options to display data
const options = computed(() => {
  const periods = dataList.value.map((item) => item.period) // Period of time
  const counts = dataList.value.map((item) => item.count) // Number of uploads

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: periods, name: 'Time' },
    yAxis: { type: 'value', name: 'Number of uploads' },
    series: [
      {
        name: 'Number of uploads',
        type: 'line',
        data: counts,
        smooth: true,
        emphasis: {
          focus: 'series',
        },
      },
    ],
  }
})


</script>

<template>
  <div class="space-user-analyse">
    <a-card title="Upload ">
      <v-chart :option="options" style="height: 320px" />
      <template #extra>
        <a-space>
          <a-segmented v-model:value="timeDimension" :options="timeDimensionOptions" />
          <a-input-search v-if="isAdmin" placeholder="Please entery user ID" enter-button="Search user" @search="doSearch" />
        </a-space>
      </template>
    </a-card>

  </div>
</template>

<style scoped>

</style>