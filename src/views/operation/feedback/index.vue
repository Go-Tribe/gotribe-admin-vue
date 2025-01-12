<template>
  <div>
    <el-card class="m-10" shadow="always">
      <el-form size="mini" :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="项目">
          <el-select v-model="params.projectID" clearable placeholder="项目" @clear="search">
            <el-option
              v-for="item in projectList"
              :key="item.projectID"
              :label="item.title"
              :value="item.projectID"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-search" type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%">
        <el-table-column show-overflow-tooltip prop="id" label="ID" />
        <el-table-column label="项目">
          <template slot-scope="scope">
            <div>{{ scope.row.project && scope.row.project.title }}</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="title" label="反馈内容" />
        <el-table-column show-overflow-tooltip prop="content" label="反馈详情" />
        <el-table-column show-overflow-tooltip prop="phone" label="联系方式" />
        <el-table-column show-overflow-tooltip sortable prop="createdAt" label="创建时间" />
      </el-table>

      <el-pagination
        :current-page="params.pageNum"
        :page-size="params.pageSize"
        :total="total"
        :page-sizes="[1, 5, 10, 30]"
        layout="total, prev, pager, next, sizes"
        background
        style="margin-top: 10px;float:right;margin-bottom: 10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

    </el-card>
  </div>
</template>

<script>
import { getFeedbackList } from '@/api/operation/feedback'
import { getProjectList } from '@/api/business/project'

export default {
  name: 'Feedback',
  data() {
    return {
      // 查询参数
      params: {
        projectID: '',
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      total: 0,
      loading: false,

      projectList: []
    }
  },
  created() {
    this.getTableData()
    this.getProjectData()
  },
  methods: {
    async getProjectData() {
      const params = {
        pageNum: 1,
        pageSize: 50
      }
      const { data } = await getProjectList(params)
      this.projectList = data.projects
    },
    // 查询
    search() {
      this.params.pageNum = 1
      this.getTableData()
    },

    // 获取表格数据
    async getTableData() {
      this.loading = true
      try {
        const { data } = await getFeedbackList(this.params)
        this.tableData = data.feedbacks
        this.total = data.total
      } finally {
        this.loading = false
      }
    },

    // 分页
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getTableData()
    }
  }
}
</script>
