<template>
  <div :class="className" :style="{ height: height, width: width }"></div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
export default {
  // data() {
  //   return {
  //     value: "",
  //   };
  // },
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
      default: "300px",
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
      //   this.chart.setOption({
      //     title: {
      //       text: "测试用例总数",
      //     },
      //     xAxis: {
      //       type: "category",
      //       data: [
      //         "1月",
      //         "2月",
      //         "3月",
      //         "4月",
      //         "5月",
      //         "6月",
      //         "7月",
      //         "8月",
      //         "9月",
      //         "10月",
      //         "11月",
      //         "12月",
      //       ],
      //     },
      //     yAxis: {
      //       type: "value",
      //     },
      //     series: [
      //       {
      //         data: [734, 1090, 830, 450, 232, 301, 500, 320, 156, 489, 215, 652],
      //         type: "line",
      //       },
      //     ],
      //   });
    },

    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        title: {
          text: "测试用例总数",
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
          boundaryGap: false,
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: "expected",
            itemStyle: {
              normal: {
                color: "#FF005A",
                lineStyle: {
                  color: "#FF005A",
                  width: 2,
                },
              },
            },
            smooth: true,
            type: "line",
            data: expectedData,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
        ],
      });
    },
  },
};
</script>