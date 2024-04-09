<script setup lang="ts">
import ServerTable from './components/ServerTable.vue';
import ServerUpdate from './components/ServerUpdate.vue';
import AuSettings from './components/AuSettings.vue';
import AuTool from "./components/AuTools.vue"
import AuLinkTable from "./components/AuLinkTable.vue"
import { useUrlSearchParams } from '@vueuse/core';
import AuConsole from './components/AuConsole.vue';

const params = useUrlSearchParams()

</script>

<template>
  <div class="container">
    <template v-if="params.log">
      <AuConsole></AuConsole>
    </template>
    <template v-else>
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
    </template>
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
