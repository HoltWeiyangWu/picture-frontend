<script setup lang="ts">
import VChart from "vue-echarts"
import "echarts";
import {computed, ref} from 'vue';
import {message} from "ant-design-vue";
import {watchEffect} from "vue";
import {getSpaceCategoryAnalyse} from "@/api/spaceAnalyseController.ts";

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
const dataList = ref<API.SpaceCategoryAnalyseResponse>([])
const loading = ref(true);

const fetchData = async () => {
  loading.value = true
  const res = await getSpaceCategoryAnalyse({
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

const options = computed(() => {
  const categories = dataList.value.map((item) => item.category)
  const countData = dataList.value.map((item) => item.count)
  const sizeData = dataList.value.map((item) => (item.totalSize / (1024 * 1024)).toFixed(2)) // 转为 MB

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Number of pictures', 'Total size'], top: 'bottom' },
    xAxis: { type: 'category', data: categories },
    yAxis: [
      {
        type: 'value',
        name: 'Number of pictures',
        axisLine: { show: true, lineStyle: { color: '#5470C6' } },
      },
      {
        type: 'value',
        name: 'Total size (MB)',
        position: 'right',
        axisLine: { show: true, lineStyle: { color: '#91CC75' } },
        splitLine: {
          lineStyle: {
            color: '#91CC75',
            type: 'dashed',
          },
        },
      },
    ],
    series: [
      { name: 'Number of pictures', type: 'bar', data: countData, yAxisIndex: 0 },
      { name: 'Total size', type: 'bar', data: sizeData, yAxisIndex: 1 },
    ],
  }
})

</script>

<template>
  <div class="space-category-analyse">
    <a-card title="Category">
      <v-chart :option="options" style="height: 320px; max-width: 100%"  :loading="loading">
      </v-chart>
    </a-card>
  </div>
</template>

<style scoped>

</style>