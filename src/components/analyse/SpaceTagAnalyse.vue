<script setup lang="ts">
import VChart from 'vue-echarts'
import 'echarts'
import 'echarts-wordcloud'
import {computed, ref, watchEffect} from "vue";
import {getSpaceTagAnalyse} from "@/api/spaceAnalyseController.ts";
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
  const res = await getSpaceTagAnalyse({
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
  const tagData = dataList.value.map((item) => ({
    name: item.tag,
    value: item.count,
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `${params.name}: ${params.value} 次`,
    },
    series: [
      {
        type: 'wordCloud',
        gridSize: 10,
        sizeRange: [12, 50],
        rotationRange: [-90, 90],
        shape: 'circle',
        textStyle: {
          color: () =>
              `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
                  Math.random() * 255,
              )}, ${Math.round(Math.random() * 255)})`, // Random colour
        },
        data: tagData,
      },
    ],
  }
})
</script>

<template>
  <div class="space-tag-analyse">
    <a-card title="Tags">
      <v-chart :option="options" style="height: 320px; max-width: 100%" :loading="loading"/>
    </a-card>
  </div>
</template>

<style scoped>

</style>