<template>
  <div id="addPicturePage">
    <h2 style="margin-bottom: 16px">{{ route.query?.id ? 'Edit picture' : 'Create picture' }}</h2>
    <a-typography-paragraph v-if="spaceId" type="secondary">
      Save to storage space with ID：<a :href="`/space/${spaceId}`" >{{ spaceId }}</a>
    </a-typography-paragraph>

    <a-tabs v-model:active-key="uploadType">
      <a-tab-pane key="file" tab="File upload">
        <PictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess"/>
      </a-tab-pane>
      <a-tab-pane key="url" tab="Url upload" force-render>
        <UrlPictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess"/>
      </a-tab-pane>
    </a-tabs>

    <div v-if="picture" class="edit-bar">
      <a-button :icon="h(EditOutlined)" @click="doEditPicture">Adjust picture</a-button>
      <ImageCropper ref="imageCropperRef" :imageUrl="picture?.url" :picture="picture" :spaceId="spaceId"
                    :onSuccess="onCropSuccess" :space="space"/>
    </div>
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
        <a-auto-complete v-model:value="pictureForm.category" placeholder="Category here" allow-clear
                         :options="categoryOptions"/>
      </a-form-item>
      <a-form-item name="tags" label="Tags">
        <a-select v-model:value="pictureForm.tags" mode="tags" placeholder="Tags here" allow-clear
                  :options="tagsOptions"/>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">{{ route.query?.id ? 'Edit' : 'Create' }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import PictureUpload from "@/components/PictureUpload.vue";
import {computed, h, onMounted, reactive, ref, watchEffect} from "vue";
import {message} from "ant-design-vue";
import {editPicture, getPictureVoById, listPictureTagCategory} from "@/api/pictureController.ts";
import {useRoute, useRouter} from "vue-router";
import UrlPictureUpload from "@/components/UrlPictureUpload.vue";
import ImageCropper from "@/components/ImageCropper.vue";
import {EditOutlined} from "@ant-design/icons-vue";
import {getSpaceVoById} from "@/api/spaceController.ts";

const picture = ref<API.PictureVO>()
const pictureForm = reactive<API.PictureEditRequest>({})
const uploadType = ref<'file' | 'url'>('file')

/**
 * Successfully upload picture
 * @param newPicture
 */
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture;
  pictureForm.name = newPicture.name;

}

const router = useRouter();
const spaceId = computed(() => {
  return route.query?.spaceId
})
// Edit picture by submitting a picture form
const handleSubmit = async (values: any) => {
  const pictureId = picture.value?.id;
  if (!pictureId) {
    return
  }
  const res = await editPicture({
    id: pictureId,
    spaceId: spaceId.value,
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

// Edit picture
const imageCropperRef = ref()
const doEditPicture = () => {
  if (imageCropperRef.value) {
    imageCropperRef.value.openModal()
  }
}
const onCropSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

const space = ref<API.SpaceVO>()

// Get space info
const fetchSpace = async () => {
  if (spaceId.value) {
    const res = await getSpaceVoById({
      id: spaceId.value,
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    }
  }
}

watchEffect(() => {
  fetchSpace()
})
</script>
<style scoped>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
#addPicturePage .edit-bar {
  text-align: center;
  margin: 16px 0;
}

</style>
