<script setup lang="ts">
import VChart from 'vue-echarts'
import 'echarts'
import 'echarts-wordcloud'
import {computed, ref, watchEffect} from "vue";
import {getSpaceSizeAnalyse} from "@/api/spaceAnalyseController.ts";
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
const dataList = ref<API.SpaceSizeAnalyseResponse>([])
const loading = ref(true);

const fetchData = async () => {
  loading.value = true
  const res = await getSpaceSizeAnalyse({
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
  const pieData = dataList.value.map((item) => ({
    name: item.sizeRange,
    value: item.count,
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      top: 'bottom',
    },
    series: [
      {
        name: 'Picture Size',
        type: 'pie',
        radius: '50%',
        data: pieData,
      },
    ],
  }
})

</script>

<template>
  <div class="space-size-analyse">
    <a-card title="Picture Size">
      <v-chart :option="options" style="height: 320px; max-width: 100%" :loading="loading"/>
    </a-card>
  </div>
</template>

<style scoped>

</style>