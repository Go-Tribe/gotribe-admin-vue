<template>
  <el-card shadow="always" class="chart-card">
    <div class="chart-card-header">
      <div class="chart-card-title">
        <div class="chart-card-title-icon">
          <i class="el-icon-s-marketing" />
        </div>
        <h4>订单</h4>
      </div>
      <el-radio-group v-model="timeRange" @input="timeChange">
        <el-radio-button label="week">周</el-radio-button>
        <el-radio-button label="month">月</el-radio-button>
        <el-radio-button label="year">年</el-radio-button>
      </el-radio-group>
    </div>
    <div class="order-chart" style="height: 300px;" />
  </el-card>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'OrderChart',
  props: {
    orderList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      timeRange: 'week',
      orderOption: {
        backgroundColor: '#fff',
        grid: { left: 0, top: 40, bottom: 20, right: 10, containLabel: true },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontSize: 14
          }
        },
        legend: {
          data: ['订单金额', '订单数'],
          left: 'center',
          itemWidth: 20, // 设置宽度
          itemHeight: 15, // 设置高度
          top: 10,
          textStyle: {
            color: '#333',
            fontSize: 14,
            padding: [2, 0, 0, 0]
          }
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: { lineStyle: { color: '#ccc' }},
          axisTick: { length: 3 },
          axisLabel: { color: '#999', rotate: 45 }
        },
        yAxis: [
          {
            type: 'value',
            name: '订单金额', // 添加y轴名称
            position: 'left', // 设置y轴位置
            axisLine: { show: true, lineStyle: { color: '#ccc' }},
            axisLabel: { color: '#999' },
            splitLine: { show: false },
            nameTextStyle: { color: '#606266' } // 设置y轴名称字体颜色
          },
          {
            type: 'value',
            name: '订单数', // 添加y轴名称
            position: 'right', // 设置y轴位置
            axisLine: { show: true, lineStyle: { color: '#ccc' }},
            axisLabel: { color: '#999' },
            splitLine: { show: false },
            nameTextStyle: { color: '#606266' } // 设置y轴名称字体颜色
          }
        ],
        series: [
          {
            name: '订单金额',
            color: new echarts.graphic.LinearGradient( // 渐变色
              1, 1, 0, 0, [{
                offset: 0,
                color: '#5cd1f8'
              }, {
                offset: 1,
                color: '#53b5f9'
              }]
            ),
            type: 'bar',
            barWidth: '15%', // 柱型宽度
            data: [],
            yAxisIndex: 0 // 绑定到第一个y轴
          },
          {
            name: '订单数',
            color: '#6dc88b',
            type: 'line',
            smooth: true,
            barWidth: '15%',
            data: [],
            yAxisIndex: 1 // 绑定到第二个y轴
          }
        ]
      }
    }
  },
  methods: {
    timeChange(value) {
      this.$emit('timeChange', value)
    },
    initOrderChart() {
      this.orderChart = echarts.init(document.querySelector('.order-chart'))
      this.orderOption.xAxis.data = this.orderList.map(item => item.date)
      this.orderOption.series[0].data = this.orderList.map(item => item.totalSales)
      this.orderOption.series[1].data = this.orderList.map(item => item.totalOrders)
      this.orderChart.setOption(this.orderOption)
      window.addEventListener('resize', () => {
        this.orderChart.resize()
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
