<script setup lang="ts">
import SpaceUsageAnalyse from "@/components/analyse/SpaceUsageAnalyse.vue";
import SpaceCategoryAnalyse from "@/components/analyse/SpaceCategoryAnalyse.vue";
import {computed} from "vue";
import {useRoute} from "vue-router";
import SpaceTagAnalyse from "@/components/analyse/SpaceTagAnalyse.vue";
import SpaceSizeAnalyse from "@/components/analyse/SpaceSizeAnalyse.vue";
import SpaceUserAnalyse from "@/components/analyse/SpaceUserAnalyse.vue";
import SpaceRankAnalyse from "@/components/analyse/SpaceRankAnalyse.vue";
import {useLoginUserStore} from "@/stores/user.ts";

const route = useRoute()

const spaceId = computed(() => {
  return route.query?.spaceId as string
})

const queryAll = computed(() => {
  return !!route.query?.queryAll
})

const queryPublic = computed(() => {
  return !!route.query?.queryPublic
})

// Check authorisation for certain types of components
const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser

const isAdmin = computed(() => {
  return loginUser.userRole === 'admin'
})

</script>

<template>
  <div id="spaceAnalyzePage">
    <h2>
      Storage space analyse -
      <span v-if="queryAll"> All storage space </span>
      <span v-else-if="queryPublic"> Public space </span>
      <span v-else>
      <a :href="`/space/${spaceId}`" target="_blank">ID：{{ spaceId }}</a>
    </span>
    </h2>
    <a-row :gutter="[16, 16]">

      <a-col :xs="24" :md="12">
        <SpaceUsageAnalyse :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>

      <a-col :xs="24" :md="12">
        <SpaceCategoryAnalyse :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>

      <a-col :xs="24" :md="12">
        <SpaceTagAnalyse :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>

      <a-col :xs="24" :md="12">
        <SpaceSizeAnalyse :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>

      <a-col :xs="24" :md="12">
        <SpaceUserAnalyse :isAdmin="isAdmin" :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>

      <a-col :xs="24" :md="12">
        <SpaceRankAnalyse  v-if="isAdmin" :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>
    </a-row>
  </div>

</template>

<style scoped>
#spaceAnalyzePage {
  margin-bottom: 16px;
}
</style>



