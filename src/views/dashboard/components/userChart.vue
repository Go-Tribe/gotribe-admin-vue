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
  data() {
    return {
      userOption: {
        grid: { left: 0, top: 40, bottom: 20, right: 10, containLabel: true },
        xAxis: {
          type: 'category',
          data: [
            '12-26',
            '12-27',
            '12-28',
            '12-29',
            '12-30',
            '12-31',
            '01-01',
            '01-02',
            '01-03',
            '01-04',
            '01-05',
            '01-06',
            '01-07',
            '01-08',
            '01-09'
          ],
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
            data: [0, 10, 2, 4, 4, 7, 0, 0, 0, 3, 0, 9, 6, 0, 0],
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
  mounted() {
    this.initOrderChart()
  },
  methods: {
    initOrderChart() {
      this.userChart = echarts.init(document.querySelector('.user-chart'))
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
