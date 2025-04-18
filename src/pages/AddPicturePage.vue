<template>
  <div id="addPicturePage">
    <h2 style="margin-bottom: 16px">{{route.query?.id ? 'Edit picture' : 'Create picture'}}</h2>

    <PictureUpload :picture="picture" :onSuccess="onSuccess"/>
    <a-form v-if="picture" layout="vertical" :model="pictureForm" @finish="handleSubmit">
      <a-form-item name="name" label="Name">
        <a-input v-model:value="pictureForm.name" placeholder="Name here"></a-input>
      </a-form-item>
      <a-form-item name="introduction" label="Introduction">
        <a-textarea v-model:value="pictureForm.introduction"
                    placeholder="Introduction here"
                    :auto-size="{minRows: 2, maxRows:5}"></a-textarea>
      </a-form-item>

      <a-form-item name="category" label="Category">
        <a-auto-complete v-model:value="pictureForm.category" placeholder="Category here" allow-clear :options="categoryOptions"/>
      </a-form-item>
      <a-form-item name="tags" label="Tags">
        <a-select v-model:value="pictureForm.tags" mode="tags" placeholder="Tags here" allow-clear :options="tagsOptions"/>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">{{route.query?.id ? 'Edit' : 'Create'}}</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import PictureUpload from "@/components/PictureUpload.vue";
import {onMounted, reactive, ref} from "vue";
import {message} from "ant-design-vue";
import {editPicture, getPictureVoById, listPictureTagCategory} from "@/api/pictureController.ts";
import {useRoute} from "vue-router";

const picture = ref<API.PictureVO>()
const pictureForm = reactive<API.PictureEditRequest>({})
/**
 * Successfully upload picture
 * @param newPicture
 */
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture;
  pictureForm.name = newPicture.name;

}

// Edit picture by submitting a picture form
const handleSubmit = async (values: any) => {
  const pictureId = picture.value?.id;
  if (!pictureId) {
    return
  }
  const res = await editPicture({
    id : pictureId,
    ...values
  })
  // Record user state if editing is successful
  if (res.data.code === 0 && res.data.data) {
    if (route.query?.id) {
      message.success("Edited successfully")
    } else {
      message.success("Created successfully")
    }
    await router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    message.error('Failed to create picture: ' + res.data.message)
  }
}

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

onMounted(() => {
  getTagCategoryOptions()
})

// Obtain previous data
const route = useRoute()
const getOldPicture = async () => {
  const id = route.query?.id
  if (!id) {
    return
  }
  const res = await getPictureVoById({id})
  if (res.data.code === 0 && res.data.data) {
    const data = res.data.data
    picture.value = data
    pictureForm.name = data.name
    pictureForm.introduction = data.introduction
    pictureForm.tags = data.tags
    pictureForm.category = data.category
    message.success("Loaded picture successfully")
  }
}

onMounted(() => {
  getOldPicture()
})
</script>
<style scoped>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
