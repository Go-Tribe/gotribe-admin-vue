<template>
  <el-card class="m-10" shadow="always">
    <div class="create-header">
      <div class="title">{{ title }}</div>
      <div class="operate-btn">
        <el-button type="primary" @click="$emit('submit')">返回</el-button>
        <el-button
          v-show="curStep > 0"
          type="primary"
          @click="curStep--"
        >上一步</el-button>
        <el-button
          v-show="curStep === 0"
          type="primary"
          @click="handleNextClick"
        >下一步</el-button>
        <el-button
          v-show="curStep === 1"
          type="primary"
          @click="submit"
        >提交</el-button>
      </div>
    </div>
    <el-steps :active="curStep" class="step" finish-status="success">
      <el-step title="基本信息" />
      <el-step title="商品规格" />
    </el-steps>
    <el-card v-show="curStep === 0">
      <el-form ref="basicForm" :rules="basicFormRules" :model="basicForm" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="basicForm.title" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="basicForm.description" type="textarea" />
        </el-form-item>
        <el-form-item label="封面图" prop="image">
          <ResourceSelect v-model="basicForm.image" placeholder="请填写封面图" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryID">
          <treeselect
            v-model="basicForm.categoryID"
            :options="optionsMap.treeselectData"
            :normalizer="normalizer"
            style="width: 100%;"
            @input="treeselectInput"
          />
        </el-form-item>
        <el-form-item label="项目" prop="projectID">
          <el-select v-model="basicForm.projectID" class="w-100" placeholder="请选择项目">
            <el-option
              v-for="item in optionsMap.projectList"
              :key="item.projectID"
              :label="item.title"
              :value="item.projectID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="购买限制" prop="buyLimit">
          <el-input-number
            v-model="basicForm.buyLimit"
            controls-position="right"
            :min="1"
          />
        </el-form-item>
        <el-form-item label="发布状态" prop="enable">
          <el-radio-group v-model="basicForm.enable">
            <el-radio
              v-for="item in productStatusOptions"
              :key="item.value"
              :label="item.value"
            >{{ item.text }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <MdEditor v-if="!id || basicForm.content" ref="mdEditor" class="article-editor" :md-content="basicForm.content" />
    </el-card>
    <el-card v-show="curStep === 1">这里是商品规格</el-card>
  </el-card>
</template>

<script>
import MdEditor from '@/components/MdEditor'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { createProduct, updateProduct, getProductDetail } from '@/api/store/product'
import ResourceSelect from '@/components/ResourceSelect'
import { getCategoryTree } from '@/api/store/product-category'
import { getProjectList } from '@/api/business/project'
import { productStatusOptions, productStatusEnum } from '@/constant/store'
export default {
  name: 'CreateArticle',
  components: {
    MdEditor,
    Treeselect,
    ResourceSelect
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      productStatusOptions,
      curStep: 0,
      title: '新建商品',
      basicForm: {
        title: '',
        content: '',
        htmlContent: '',
        description: '',
        image: '',
        categoryID: null,
        projectID: '',
        buyLimit: 1,
        productSpec: '1212',
        enable: productStatusEnum.enable
      },
      basicFormRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        categoryID: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        projectID: [
          { required: true, message: '请选择项目', trigger: 'blur' }
        ],
        buyLimit: [
          { required: true, message: '请填写购买限制', trigger: 'blur' }
        ],
        image: [
          { required: true, message: '请填写封面图', trigger: 'blur' }
        ]
      },
      optionsMap: {
        treeselectData: [],
        projectList: []
      }
    }
  },
  created() {
    this.getProductDetail()
    this.getCategoryData()
    this.getProjectData()
  },
  methods: {
    async getCategoryData() {
      this.loading = true
      const { data } = await getCategoryTree()
      this.optionsMap.treeselectData = data.productCategoryTree
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
    getProductDetail() {
      if (this.id) {
        this.title = '编辑商品'
        getProductDetail(this.id).then(res => {
          if (res.code === 200) {
            // this.basicForm = {
            //   ...res.data.post,
            //   tag: res.data.post.tag ? res.data.post.tag.split(',') : []
            // }
          }
        })
      }
    },
    submit() {
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          this.basicForm.content = this.$refs.mdEditor.getMarkdown()
          this.basicForm.htmlContent = this.$refs.mdEditor.getHtml()
          const productMethod = this.id ? updateProduct : createProduct
          productMethod(this.basicForm).then(res => {
            this.$message({
              message: `${this.id ? '编辑' : '新建'}成功`,
              type: 'success'
            })
            setTimeout(() => {
              this.$emit('submit')
            }, 1000)
          })
        }
      })
    },
    // treeselect
    normalizer(node) {
      return {
        id: node.productCategoryID,
        label: node.title,
        children: node.children
      }
    },
    treeselectInput(value) {
      this.treeselectValue = value
    },
    handleNextClick() {
      this.$refs['basicForm'].validate(valid => {
        if (valid) {
          this.basicForm.content = this.$refs.mdEditor.getMarkdown()
          this.basicForm.htmlContent = this.$refs.mdEditor.getHtml()
          if (!this.basicForm.content) {
            this.$message({
              message: '请填写商品详情',
              type: 'warning'
            })
            return
          }
          this.curStep++
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
.step {
  width: 60%;
  margin: 0 auto 16px;
}
</style>
<style lang="scss">
.article-editor {
  height: calc(100vh - 250px) !important;
}
</style>
