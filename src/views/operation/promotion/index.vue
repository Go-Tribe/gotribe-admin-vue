<template>
  <el-tabs type="border-card" class="m-10">
    <el-tab-pane label="推广场景">
      <Scene :project-list="projectList" />
    </el-tab-pane>
    <el-tab-pane label="推广内容">推广内容</el-tab-pane>
  </el-tabs>
</template>

<script>
import Scene from './components/scene.vue'
import { getProjectList } from '@/api/business/project'

export default {
  name: 'Promotion',
  components: {
    Scene
  },
  data() {
    return {
      projectList: []
    }
  },
  created() {
    this.getProjectData()
  },
  methods: {
    async getProjectData() {
      const params = {
        title: '',
        description: '',
        pageNum: 1,
        pageSize: 50
      }
      const { data } = await getProjectList(params)
      this.projectList = data.projects
    }
  }
}
</script>
