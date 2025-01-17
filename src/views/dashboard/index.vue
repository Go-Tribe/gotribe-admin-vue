<template>
  <div class="dashboard-container">
    <el-row>
      <el-col v-for="item in infoList" :key="item.name" :span="6" style="padding: 0 10px;">
        <el-card shadow="always" class="info-card">
          <div class="info-card-top">
            <div class="info-card-name">{{ item.name }}</div>
            <el-tag type="success" size="mini">今日</el-tag>
          </div>
          <div class="info-card-value">{{ item.value }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="mt-16">
      <el-col v-for="item in operateList" :key="item.name" :span="4" style="padding: 0 10px;">
        <el-card shadow="always" class="operate-card">
          <router-link
            :to="item.url"
            class="operate-item"
          >
            <i :class="item.icon" :style="{ color: item.color }" />
            <span>{{ item.name }}</span>
          </router-link>
        </el-card>
      </el-col>
    </el-row>
    <OrderChart />
    <UserChart />
  </div>
</template>

<script>
import OrderChart from './components/orderChart.vue'
import UserChart from './components/userChart.vue'

export default {
  name: 'Dashboard',
  components: {
    OrderChart,
    UserChart
  },
  data() {
    return {
      infoList: [
        {
          name: '销售额',
          value: 2
        },
        {
          name: '订单量',
          value: 2
        },
        {
          name: '用户数',
          value: 2
        },
        {
          name: '新增用户',
          value: 2
        }
      ],
      operateList: [
        {
          icon: 'el-icon-user-solid',
          name: '用户管理',
          url: '/business/user',
          color: 'rgb(105, 192, 255)'
        },
        {
          icon: 'el-icon-s-goods',
          name: '商品管理',
          url: '/store/product',
          color: '#67c3c2'
        },
        {
          icon: 'el-icon-s-order',
          name: '订单管理',
          url: '/store/order',
          color: '#ac82e6'
        },
        {
          icon: 'el-icon-document',
          name: '文章管理',
          url: '/content/article',
          color: '#8ba1fa'
        },
        {
          icon: 'el-icon-menu',
          name: '项目管理',
          url: '/business/project',
          color: 'rgb(149, 222, 100)'
        },
        {
          icon: 'el-icon-chat-dot-square',
          name: '评论管理',
          url: '/operation/comment',
          color: 'rgb(255, 156, 110)'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px 10px;
  .info-card {
    .info-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .info-card-name {
        font-size: 14px;
        color: #606266;
      }
    }
    .info-card-value {
      margin-bottom: 10px;
      font-size: 32px;
      font-weight: 400;
      color: #333;
      line-height: 40px;
      margin-top: 20px;
    }
  }
  .operate-card {
    height: 150px;
    .operate-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 110px;
      gap: 20px;
    }
  }
}
</style>

