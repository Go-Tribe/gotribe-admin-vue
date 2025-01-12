<template>
  <el-card class="m-10 article-create" shadow="always">
    <div class="create-header">
      <div class="title">{{ title }}</div>
      <div class="operate-btn">
        <el-button type="primary" @click="$emit('submit')">返回</el-button>
      </div>
    </div>
    <el-card>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" disabled name="1" />
        <el-tab-pane label="文章详情" disabled name="2" />
      </el-tabs>
      <el-form v-if="activeTab === '1'" ref="basicForm" :rules="basicFormRules" :model="basicForm" label-width="70px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="basicForm.title" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="basicForm.description" type="textarea" />
        </el-form-item>
        <el-form-item label="封面图" prop="icon">
          <ResourceSelectV2 v-model="basicForm.images" multi />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-select v-model="basicForm.author" placeholder="请选择作者" @change="userChangeHandler">
            <el-option
              v-for="item in optionsMap.userList"
              :key="item.userID"
              :label="item.nickname"
              :value="item.nickname"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="basicForm.type" placeholder="请选择类型">
            <el-option
              v-for="item in optionsMap.typeList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" prop="categoryID">
          <treeselect
            v-model="basicForm.categoryID"
            :options="optionsMap.treeselectData"
            :normalizer="normalizer"
            style="width: 197px;"
            @input="treeselectInput"
          />
        </el-form-item>
        <el-form-item label="专栏" prop="columnID">
          <el-select v-model="basicForm.columnID" clearable placeholder="请选择专栏">
            <el-option
              v-for="item in optionsMap.columnList"
              :key="item.columnID"
              :label="item.title"
              :value="item.columnID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目" prop="projectID">
          <el-select v-model="basicForm.projectID" placeholder="请选择项目">
            <el-option
              v-for="item in optionsMap.projectList"
              :key="item.projectID"
              :label="item.title"
              :value="item.projectID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-select
            v-model="basicForm.tag"
            multiple
            allow-create
            filterable
            default-first-option
            placeholder="请选择标签"
            @change="tagChangeHandler"
          >
            <el-option
              v-for="item in optionsMap.tagList"
              :key="item.tagID"
              :label="item.title"
              :value="item.tagID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="置顶" prop="isTop">
          <el-switch v-model="basicForm.isTop" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item label="加密" prop="isPasswd">
          <el-switch v-model="basicForm.isPasswd" :active-value="1" :inactive-value="2" />
        </el-form-item>
        <el-form-item v-if="basicForm.isPasswd === 1" label="密码" prop="password">
          <el-input v-model="basicForm.password" />
        </el-form-item>
        <el-form-item v-if="id" label="状态" prop="status">
          <el-select v-model="basicForm.status" placeholder="请选择状态">
            <el-option label="草稿" :value="1" />
            <el-option label="发布" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <MdEditor v-if="(!id || basicForm.content) && activeTab === '2'" ref="mdEditor" class="article-editor" :md-content="basicForm.content" />
      <div class="operate-btn">
        <el-button
          v-show="activeTab !== '1'"
          type="primary"
          @click="handlePrevClick"
        >上一步</el-button>
        <el-button
          v-show="activeTab !== '2'"
          type="primary"
          @click="handleNextClick"
        >下一步</el-button>
        <el-button
          v-show="activeTab === '2'"
          type="primary"
          @click="submit"
        >提交</el-button>
      </div>
    </el-card>
  </el-card>
</template>

<script>
import MdEditor from '@/components/MdEditor'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { createArticle, updateArticle, getArticleDetail } from '@/api/content/article'
import ResourceSelectV2 from '@/components/ResourceSelectV2'
import { getCategoryTree } from '@/api/content/category'
import { getTagList, createTag } from '@/api/content/tag'
import { getProjectList } from '@/api/business/project'
import { getColumnList } from '@/api/content/column'
import { getUserList } from '@/api/business/user'
export default {
  name: 'CreateArticle',
  components: {
    MdEditor,
    Treeselect,
    ResourceSelectV2
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      title: '新建文章',
      basicForm: {
        title: '',
        content: '',
        htmlContent: '',
        description: '',
        images: '',
        author: '',
        type: 1,
        status: 1,
        categoryID: null,
        projectID: '',
        userID: '',
        isTop: 0,
        isPasswd: 0,
        password: '',
        tag: [],
        columnID: ''
      },
      basicFormRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 2, message: '标题最少为2个字符', trigger: 'blur' },
          { max: 30, message: '标题最多为30个字符', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请选择作者', trigger: 'blur' }
        ],
        categoryID: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        projectID: [
          { required: true, message: '请选择项目', trigger: 'blur' }
        ],
        // columnID: [
        //   { required: true, message: '请选择项目', trigger: 'blur' }
        // ],
        type: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' }
        ],
        // tag: [
        //   { validator: (rule, value, callback) => {
        //     if (!value.length) {
        //       callback(new Error('请选择标签'))
        //     } else {
        //       callback()
        //     }
        //   }, trigger: 'blur', required: true }
        // ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' },
          { min: 2, message: '标题最少为两个字符', trigger: 'blur' }
        ]
      },
      drawerVisible: false,
      optionsMap: {
        treeselectData: [],
        tagList: [],
        projectList: [],
        userList: [],
        columnList: [],
        typeList: [
          {
            title: '文章',
            id: 1
          },
          {
            title: 'page',
            id: 2
          },
          {
            title: '微文',
            id: 3
          }
        ]
      },
      activeTab: '1'
    }
  },
  created() {
    this.getArticleDetail()
    this.getCategoryData()
    this.getProjectData()
    this.getTagData()
    this.getUserData()
    this.getColumnData()
  },
  methods: {
    userChangeHandler(value) {
      this.basicForm.userID = this.optionsMap.userList.find(item => item.nickname === value).userID
    },
    async getCategoryData() {
      this.loading = true
      const { data } = await getCategoryTree()
      this.tableData = data.categoryTree
      this.optionsMap.treeselectData = data.categoryTree
      !this.id && (this.basicForm.categoryID = data.categoryTree[0]?.categoryID)
    },
    async getTagData() {
      const params = {
        title: '',
        description: '',
        pageNum: 1,
        pageSize: 50
      }
      const { data } = await getTagList(params)
      this.optionsMap.tagList = data.tags
    },
    async getProjectData() {
      const params = {
        title: '',
        description: '',
        pageNum: 1,
        pageSize: 50
      }
      const { data } = await getProjectList(params)
      this.optionsMap.projectList = data.projects
      !this.id && (this.basicForm.projectID = data.projects[0]?.projectID)
    },
    async getUserData() {
      const params = {
        title: '',
        description: '',
        pageNum: 1,
        pageSize: 50
      }
      const { data } = await getUserList(params)
      this.optionsMap.userList = data.users
      if (!this.id) {
        this.basicForm.author = data.users[0]?.nickname
        this.basicForm.userID = data.users[0]?.userID
      }
    },
    async getColumnData() {
      const params = {
        title: '',
        description: '',
        pageNum: 1,
        pageSize: 50
      }
      const { data } = await getColumnList(params)
      this.optionsMap.columnList = data.columns
    },
    getArticleDetail() {
      if (this.id) {
        this.title = '编辑文章'
        getArticleDetail(this.id).then(res => {
          if (res.code === 200) {
            this.basicForm = {
              ...res.data.post,
              tag: res.data.post.tag ? res.data.post.tag.split(',') : []
            }
          }
        })
      }
    },
    submit() {
      this.basicForm.content = this.$refs.mdEditor.getMarkdown()
      this.basicForm.htmlContent = this.$refs.mdEditor.getHtml()
      if (!this.basicForm.content) {
        this.$message({
          message: '请填写文章内容',
          type: 'warning'
        })
        return
      }
      const articleMethod = this.id ? updateArticle : createArticle
      articleMethod({
        ...this.basicForm,
        tag: this.basicForm.tag.join(',')
      }).then(res => {
        this.$message({
          message: `${this.id ? '编辑' : '新建'}成功`,
          type: 'success'
        })
        setTimeout(() => {
          this.$emit('submit')
        }, 1000)
      })
    },
    // treeselect
    normalizer(node) {
      return {
        id: node.categoryID,
        label: node.title,
        children: node.children
      }
    },
    treeselectInput(value) {
      this.treeselectValue = value
    },
    tagChangeHandler(value) {
      if (value.length && !this.optionsMap.tagList.find(item => item.tagID === value[value.length - 1])) {
        const tag = value[value.length - 1]
        createTag({ title: tag }).then(res => {
          this.optionsMap.tagList = [res.data.tag, ...this.optionsMap.tagList]
          this.basicForm.tag[this.basicForm.tag.length - 1] = res.data.tag.tagID
        }).catch(() => {
          this.basicForm.tag.pop()
          return
        })
      }
    },
    handleNextClick() {
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          this.activeTab = String(Number(this.activeTab) + 1)
        }
      })
    },
    handlePrevClick() {
      this.activeTab = String(Number(this.activeTab) - 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.container-card {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 104px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 16px 20px 20px 20px;
}
.create-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  .title {
    font-weight: 500;
    font-size: 18px;
  }
}
.drawer {
  padding: 20px;
  overflow: auto;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    &-title {
      font-weight: 500;
    }
  }
}
</style>
<style lang="scss">
.article-editor {
  height: calc(100vh - 400px) !important;
  margin-bottom: 50px;
}
.article-create .el-tabs__item.is-disabled {
  color: #303133;
}
</style>
