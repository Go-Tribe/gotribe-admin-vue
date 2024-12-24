<template>
  <div>
    <Transition name="fade">
      <Create v-if="isCreate" :id="curId" @submit="submit" />
    </Transition>
    <el-card v-show="!isCreate" class="m-10" shadow="always">
      <el-form size="mini" :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="商品标题">
          <el-input v-model.trim="params.title" clearable placeholder="商品标题" @clear="search" />
        </el-form-item>
        <el-form-item label="ID">
          <el-input v-model.trim="params.postID" clearable placeholder="ID" @clear="search" />
        </el-form-item>
        <el-form-item label="项目">
          <el-select v-model="params.projectID" clearable placeholder="项目" @clear="search">
            <el-option
              v-for="item in optionsMap.projectList"
              :key="item.projectID"
              :label="item.title"
              :value="item.projectID"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-search" type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-plus" type="warning" @click="create">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="multipleSelection.length === 0" :loading="loading" icon="el-icon-delete" type="danger" @click="batchDelete">批量删除</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column sortable prop="postID" align="center" width="80" label="ID" />
        <el-table-column show-overflow-tooltip sortable prop="title" label="标题" />
        <el-table-column show-overflow-tooltip sortable prop="description" label="描述" />
        <el-table-column label="项目">
          <template slot-scope="scope">
            <div>{{ scope.row.project.title }}</div>
          </template>
        </el-table-column>
        <el-table-column label="分类">
          <template slot-scope="scope">
            <div>{{ scope.row.category.title }}</div>
          </template>
        </el-table-column>
        <el-table-column label="标签">
          <template slot-scope="scope">
            <div style="display: flex;gap: 8px;">
              <el-tag v-for="tag in scope.row.tags" :key="tag.tagID">{{ tag.title }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="80">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.status === 1 ? 'danger':'success'">{{ scope.row.status === 1 ? '草稿':'已发布' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.status !== 2" content="发布" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-open" circle type="primary" @click="publish(scope.row)" />
            </el-tooltip>
            <el-tooltip content="编辑" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-edit" circle type="primary" @click="update(scope.row)" />
            </el-tooltip>
            <el-tooltip class="ml-10" content="删除" effect="dark" placement="top">
              <el-popconfirm title="确定删除吗？" @onConfirm="singleDelete(scope.row.postID)">
                <el-button slot="reference" size="mini" icon="el-icon-delete" circle type="danger" />
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
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
import { getProductList, batchDeleteProduct } from '@/api/store/product'
import { getProjectList } from '@/api/business/project'

import Create from './create.vue'

export default {
  name: 'Product',
  components: {
    Create
  },
  data() {
    return {
      // 查询参数
      params: {
        title: '',
        projectID: '',
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      total: 0,
      loading: false,

      // 删除按钮弹出框
      popoverVisible: false,
      // 表格多选
      multipleSelection: [],

      isCreate: false,
      curId: '',
      optionsMap: {
        projectList: []
      }
    }
  },
  created() {
    this.getTableData()
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
      this.optionsMap.projectList = data.projects
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
        const { data } = await getProductList(this.params)
        this.tableData = data.posts
        this.total = data.total
      } finally {
        this.loading = false
      }
    },

    submit() {
      this.isCreate = false
      // this.getTableData()
    },

    publish(row) {
      // pushProduct(row).then(res => {
      //   this.getTableData()
      //   this.$message({
      //     showClose: true,
      //     message: '发布成功',
      //     type: 'success'
      //   })
      // })
    },

    // 新增
    create() {
      this.curId = ''
      this.isCreate = true
    },

    // 修改
    update(row) {
      this.curId = row.postID
      this.isCreate = true
    },

    // 批量删除
    batchDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async res => {
        this.loading = true
        const postIds = []
        this.multipleSelection.forEach(x => {
          postIds.push(x.postID)
        })
        let msg = ''
        try {
          const { message } = await batchDeleteProduct({ postIds: postIds.join(',') })
          msg = message
        } finally {
          this.loading = false
        }

        this.getTableData()
        this.$message({
          showClose: true,
          message: msg,
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 单个删除
    async singleDelete(postId) {
      this.loading = true
      let msg = ''
      try {
        const { message } = await batchDeleteProduct({ postIds: postId })
        msg = message
      } finally {
        this.loading = false
      }

      this.getTableData()
      this.$message({
        showClose: true,
        message: msg,
        type: 'success'
      })
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
