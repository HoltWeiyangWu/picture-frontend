<template>
  <div id="mySpacePage">
      <p>Loading...</p>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from "vue-router";
import {useLoginUserStore} from "@/stores/user.ts";
import {listSpaceVoByPage} from "@/api/spaceController.ts";
import {message} from "ant-design-vue";
import {onMounted} from "vue";

const router = useRouter()
const loginUserStore = useLoginUserStore()

const checkUserSpace = async () => {
  const loginUser = loginUserStore.loginUser;
  if (!loginUser?.id) {
    router.replace("/user/login");
    return;
  }

  const res = await listSpaceVoByPage({
    creatorId: loginUser.id,
    current: 1,
    pageSize: 1
  })
  if (res.data.code === 0) {
    // Get the first space and route to there
    if (res.data.data?.records?.length > 0) {
      const space = res.data.data.records[0];
      await router.replace(`/space/${space.id}`);
    } else {
      await router.replace("/addSpace");
      message.warn("Please create a new space");
    }
  } else {
    message.error("Failed to load picture space" + res.data.message);
  }
}

onMounted(()=> {
  checkUserSpace()
})
</script>
<style scoped>
</style>
