<script setup lang="ts">
import VChart from 'vue-echarts'
import 'echarts'
import 'echarts-wordcloud'
import {computed, ref, watchEffect} from "vue";
import {getSpaceRankAnalyze} from "@/api/spaceAnalyseController.ts";
import {message} from "ant-design-vue";



interface Props {
  queryAll?: boolean,
  queryPublic?: boolean,
  spaceId?: number
}

const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
})
// Obtain data
const dataList = ref<API.SpaceTagAnalyseResponse>([])
const loading = ref(true);

const fetchData = async () => {
  loading.value = true
  const res = await getSpaceRankAnalyze({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
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
  const spaceNames = dataList.value.map((item) => item.spaceName)
  const usageData = dataList.value.map((item) => (item.totalSize / (1024 * 1024)).toFixed(2)) //

  return {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: spaceNames,
    },
    yAxis: {
      type: 'value',
      name: 'Storage usage (MB)',
    },
    series: [
      {
        name: 'Storage usage (MB)',
        type: 'bar',
        data: usageData,
        itemStyle: {
          color: '#5470C6',
        },
      },
    ],
  }
})

</script>

<template>
  <div class="space-rank-analyse">
    <a-card title="Rank (Top 10)">
      <v-chart :option="options" style="height: 320px; max-width: 100%" :loading="loading"/>
    </a-card>
  </div>
</template>

<style scoped>

</style>