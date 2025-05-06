<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {editPictureByBatch, listPictureTagCategory} from "@/api/pictureController.ts";
import {message} from "ant-design-vue";

interface Props {
  pictureList: API.PictureVO[]
  spaceId: number
  onSuccess: () => void
}

const props = withDefaults(defineProps<Props>(), {
  title: () => 'Share',
  link: () => '',
})

const visible = ref(false)
const openModal = () => {
  visible.value = true
}
const closeModal = () => {
  visible.value = false
}

defineExpose({
  openModal,
})


const dateForm = reactive<API.PictureEditByBatchRequest>({
  category: '',
  tags: [],
  namingRule: ''

})

// Edit picture by submitting a picture form
const handleSubmit = async (values: any) => {
  if (!props.pictureList) {
    return;
  }
  const res = await editPictureByBatch({
    pictureIdList: props.pictureList.map((picture) => picture.id),
    spaceId: props.spaceId,
    ...values
  })
  // Record user state if editing is successful
  if (res.data.code === 0 && res.data.data) {
    message.success("Edited successfully")
    closeModal()
    props?.onSuccess()
  } else {
    message.error('Operation failed: ' + res.data.message)
  }
}

const categoryOptions = ref<string[]>([])
const tagsOptions = ref<string[]>([])

const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategory()
  if (res.data.code === 0 && res.data.data) {
    tagsOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
      return {
        label: data,
        value: data
      }
    })
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => {
      return {
        label: data,
        value: data
      }
    })
  }
}

onMounted(() => {
  getTagCategoryOptions()
})
</script>

<template>
  <div class="batch-edit-picture-modal">
    <a-modal v-model:open="visible" title="Edit pictures" :footer="false" @cancel="closeModal">
      <a-typography-paragraph type="secondary"> ** Only works for the pictures in the current page
      </a-typography-paragraph>

      <a-form layout="vertical" :model="dateForm" @finish="handleSubmit">
        <a-form-item name="category" label="Category">
          <a-auto-complete v-model:value="dateForm.category" placeholder="Category here" allow-clear
                           :options="categoryOptions"/>
        </a-form-item>
        <a-form-item name="tags" label="Tags">
          <a-select v-model:value="dateForm.tags" mode="tags" placeholder="Tags here" allow-clear
                    :options="tagsOptions"/>
        </a-form-item>
        <a-form-item name="namingRule" label="Naming Rule">
          <a-input v-model:value="dateForm.namingRule" placeholder="E.g. picture-number-{order}"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%">Submit</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>

</style>