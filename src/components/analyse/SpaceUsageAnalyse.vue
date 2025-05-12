<script setup lang="ts">
import "echarts";
import {ref} from 'vue';
import {message} from "ant-design-vue";
import {getSpaceUsageAnalyse} from "@/api/spaceAnalyseController.ts";
import {watchEffect} from "vue";
import {formatSize} from "@/utils";

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
const data = ref<API.SpaceUsageAnalyseResponse>({})
const loading = ref(true);

const fetchData = async () => {
  loading.value = true
  const res = await getSpaceUsageAnalyse({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
  })
  if (res.data.code === 0 && res.data.data) {
    data.value = res.data.data
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
const options = {}
</script>

<template>
  <div class="space-usage-analyse">
    <a-flex gap="middle">

      <a-card title="Storage space" style="width: 50%">
        <div style="height: 320px; text-align: center">
          <h3> {{formatSize(data.usedSize)}} / {{data.maxSize ? formatSize(data.maxSize) : "Unlimited"}}</h3>
          <a-progress type="dashboard" :percent="data.sizeUsageRatio ?? 0"/>
        </div>
      </a-card>
      <a-card title="Picture number" style="width: 50%">
        <div style="height: 320px; text-align: center">
          <h3> {{data.usedCount}} / {{data.maxSize ? data.maxCount : "Unlimited"}}</h3>
          <a-progress type="dashboard" :percent="data.countUsageRatio ?? 0"/>
        </div>
      </a-card>
    </a-flex>
  </div>
</template>

<style scoped>

</style>