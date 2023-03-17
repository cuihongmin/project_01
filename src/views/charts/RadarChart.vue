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
      default: "395px",
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        console.log("5555");
        console.log(val);
        this.setOptions(val);
      },
    },
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

      this.setOptions(this.chartData);
      // this.chart.setOption({
      //   title: {
      //     text: "测试项目满足性分析",
      //   },
      //   legend: {
      //     data: ["Allocated Budget", "Actual Spending"],
      //   },
      //   radar: {
      //     // shape: 'circle',
      //     indicator: [
      //       { name: "Sales", max: 6500 },
      //       { name: "Administration", max: 16000 },
      //       { name: "Information Technology", max: 30000 },
      //       { name: "Customer Support", max: 38000 },
      //       { name: "Development", max: 52000 },
      //       { name: "Marketing", max: 25000 },
      //     ],
      //   },
      //   series: [
      //     {
      //       name: "Budget vs spending",
      //       type: "radar",
      //       data: [
      //         {
      //           value: [4200, 3000, 20000, 35000, 50000, 18000],
      //           name: "Allocated Budget",
      //         },
      //       ],
      //     },
      //   ],
      // });
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        title: {
          text: "测试项目满足性分析",
        },
        legend: {
          data: ["Allocated Budget", "Actual Spending"],
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: "安全性", max: 6500 },
            { name: "易用性", max: 16000 },
            { name: "稳定性", max: 30000 },
            { name: "保密", max: 38000 },
            { name: "功能", max: 52000 },
            { name: "兼容", max: 25000 },
          ],
        },
        series: [
          {
            name: "Budget vs spending",
            type: "radar",
            data: [
              {
                value: actualData,
                name: "Allocated Budget",
              },
            ],
          },
        ],
      });
    },
  },
};
</script>