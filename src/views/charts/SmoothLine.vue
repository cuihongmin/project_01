<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "200px",
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      // this.setOptions(this.chartData);
      this.chart.setOption({
        title: {
          text: "通过测试趋势",
        },
        legend: {
          orient: 'vertical',
          icon: 'circle',
          top: "5%",
          left: "life",
          //   left: "center",
          //   bottom: "10",
            // data: ["Industries", "Technology", "Forex", "Gold", "Forecasts"],
        },
        xAxis: {
          type: "category",
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [830, 489, 215, 450, 232, 734, 320, 156, 1090, 301, 500, 652],
            type: "line",
            smooth: true,
          },
        ],
      });
    },
  },
};
</script>