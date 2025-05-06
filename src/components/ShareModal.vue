<script setup lang="ts">
import {ref} from "vue";

interface Props {
  title: string
  link: string
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
</script>

<template>
  <a-modal v-model:open="visible" title="Share picture" :footer="false" @cancel="closeModal">
    <h4>Copy link</h4>
    <a-typography-link copyable>
      {{link}}
    </a-typography-link>
    <div style="margin-bottom: 16px"></div>
    <h4>Scan QR code to view</h4>
    <a-qrcode :value="link"/>
  </a-modal>
</template>

<style scoped>

</style>