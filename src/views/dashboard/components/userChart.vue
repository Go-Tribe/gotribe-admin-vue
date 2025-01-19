<template>
  <el-card shadow="always" class="chart-card">
    <div class="chart-card-header">
      <div class="chart-card-title">
        <div class="chart-card-title-icon">
          <i class="el-icon-s-marketing" />
        </div>
        <h4>用户</h4>
      </div>
    </div>
    <div class="user-chart" style="height: 300px;" />
  </el-card>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'UserChart',
  props: {
    userList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      userOption: {
        grid: { left: 0, top: 40, bottom: 20, right: 10, containLabel: true },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: { lineStyle: { color: '#ccc' }},
          axisTick: { length: 3 },
          axisLabel: { color: '#999', rotate: 45 }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: true, lineStyle: { color: '#ccc' }},
          axisLabel: { color: '#999' },
          splitLine: { show: false }
        },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontSize: 14
          }
        },
        series: [
          {
            name: '用户',
            type: 'line',
            data: [],
            smooth: true, // 平滑曲线
            showSymbol: false,
            itemStyle: { color: '#126EFC' },
            lineStyle: { width: 2, color: '#126EFC' },
            areaStyle: { color: '#cfe2f4' }
          }
        ]
      }
    }
  },
  methods: {
    initUserChart() {
      this.userChart = echarts.init(document.querySelector('.user-chart'))
      this.userOption.xAxis.data = this.userList.map(item => item.date)
      this.userOption.series[0].data = this.userList.map(item => item.totalUsers)
      this.userChart.setOption(this.userOption)
      window.addEventListener('resize', () => {
        this.userChart.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-card {
  margin: 16px 10px 0;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .chart-card-title {
      display: flex;
      align-items: center;

      &-icon {
        color: #0256ff;
        background: #e5eeff;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        line-height: 28px;
        font-size: 18px;
        text-align: center;
        margin-right: 8px;
      }

      h4 {
        margin: 0;
      }
    }
  }
}
</style>
