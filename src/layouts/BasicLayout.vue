<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh;">
      <a-layout-header class="header">
        <GlobalHeader/>
      </a-layout-header>
      <a-layout>
        <GlobalSidebar class="sidebar"/>
        <a-layout-content class="content">
          <router-view/>
        </a-layout-content>
      </a-layout>
      <a-layout-footer class="footer">
        <a href="https://github.com/HoltWeiyangWu" target="_blank">
          Picture Cloud Centre by Holt
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue';
import GlobalSidebar from "@/components/GlobalSidebar.vue";


</script>

<style scoped>
#basicLayout .footer {
  background: #fefefe;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

#basicLayout .sidebar {
  background: #fff;
  border-right: 0.5px solid #eee;
  padding-top: 20px;
}

#basicLayout .content {
  background: linear-gradient(to right, white, #fff);
  margin-bottom: 28px;
  padding: 28px;
}

#basicLayout .header {
  padding-inline: 20px;
  margin-bottom: 2px;
  color: unset;
  background: white;
}
</style>