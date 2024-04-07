<script setup lang="ts">
import ServerTable from './components/ServerTable.vue';
import ServerUpdate from './components/ServerUpdate.vue';
import AuSettings from './components/AuSettings.vue';
import AuTool from "./components/AuTools.vue"
import AuLinkTable from "./components/AuLinkTable.vue"


</script>

<template>
  <div class="container">
    <!-- 工具栏 -->
    <au-tool></au-tool>
    <!-- 表格 -->
    <ServerTable></ServerTable>
    <!-- 修改和新增弹窗 -->
    <ServerUpdate></ServerUpdate>
    <!-- 设置弹窗 -->
    <AuSettings></AuSettings>
    <!-- 订阅弹窗 -->
    <AuLinkTable></AuLinkTable>
  </div>
</template>

<style>
body .q-notification--standard {
  padding: 0px 12px;
  min-height: 38px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.8);
}
</style>
