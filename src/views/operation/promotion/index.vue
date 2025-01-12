<template>
  <el-tabs v-model="curTab" type="border-card" class="m-10">
    <el-tab-pane label="推广场景" name="1">
      <Scene v-if="curTab === '1'" />
    </el-tab-pane>
    <el-tab-pane label="推广内容" name="2">
      <Advertise v-if="curTab === '2'" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Scene from './components/scene.vue'
import Advertise from './components/advertise.vue'

export default {
  name: 'Promotion',
  components: {
    Scene,
    Advertise
  },
  data() {
    return {
      curTab: '1'
    }
  }
}
</script>
