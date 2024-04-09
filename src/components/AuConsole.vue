<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import { window as _window } from "@tauri-apps/api"
import { emit, listen } from '@tauri-apps/api/event'

const logs = ref("")
const logTarget = ref()
onMounted(() => {
    const win = _window.appWindow;
    listen("console", function (e) {
        logs.value = e.payload as string;
        nextTick(() => {
            // console.log(logTarget.value.scrollHeight)
            logTarget.value.scrollTop = logTarget.value.scrollHeight;
        })
    })
    emit("init_console")
})

</script>

<template>
    <textarea ref="logTarget" class="logs" v-model="logs" readonly></textarea>
</template>
<style scoped lang="scss">
.logs {
    height: 100vh;
    width: 100%;
    border: none;
    outline: none;
    background-color: rgb(76, 76, 76);
    color: #fff;
    font-size: 12px;
}

textarea {
    resize: none
}
</style>
<style lang="scss">
.html,
body {
    overflow: hidden;
}
</style>