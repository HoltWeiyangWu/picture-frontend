<template>
  <div id="addPictureBatchPage">
    <h2 style="margin-bottom: 16px">Generate pictures</h2>
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item name="searchText" label="Keyword">
        <a-input v-model:value="formData.searchText" placeholder="Put keyword to generate pictures here"></a-input>
      </a-form-item>
      <a-form-item name="count" label="Number of pictures">
        <a-input-number
        v-model:value="formData.count"
        placeholder="Number of pictures"
        style="min-width: 180px"
        :min="1"
        :max="30"
        allow-clear
        />
      </a-form-item>

      <a-form-item name="Name prefix" label="Name prefix">
        <a-input v-model:value="formData.namePrefix" placeholder="Name prefix for pictures"/>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">Generate</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {message} from "ant-design-vue";
import {uploadPictureByBatch} from "@/api/pictureController.ts";
import { useRouter} from "vue-router";

const formData = reactive<API.UploadPictureByBatchRequest>({
  count: 10,
})
const loading = ref(false);

const router = useRouter();
const handleSubmit = async () => {
  loading.value = true;
  const res = await uploadPictureByBatch({
    ...formData,
  })
  // Record user state if editing is successful
  if (res.data.code === 0 && res.data.data) {
    message.success(`Successfully generated ${res.data.data} picture`);
    await router.push({
      path: '/',
    });
  } else {
    message.error('Failed to generate pictures: ' + res.data.message)
  }
  loading.value = false;
}

</script>
<style scoped>
#addPictureBatchPage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
