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
      this.chart.setOption({
        // backgroundColor: '#161627',
        title: {
          text: "测试用例分布",
          left: 'center',
          subtext: "啊数据库连接",
          textStyle: {
          color: '#fff',
        },
        subtextStyle: {
          color: '#871F78',
        },
        },
        tooltip: {
          trigger: "item",
          //   formatter: "{a} <br/>{b} : {c} ({d}%)",
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
        series: [
          {
            name: "测试用例分布",
            type: "pie",
            // roseType: "radius",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
               itemStyle: {
               shadowBlur: 10,
               shadowOffsetX: 0,
               shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
            },
            labelLine: {
              show: false,
            },
            // center: ["50%", "38%"],
            data: [
              { value: 320, name: "安全性测试" },
              { value: 240, name: "兼容性测试" },
              { value: 149, name: "功能性测试" },
              { value: 100, name: "保密性测试" },
              { value: 59, name: "稳定性测试" },
              { value: 59, name: "易用性测试" },
            ],
            
            // animationEasing: "cubicInOut",
            // animationDuration: 2600,
          },
        ],
      });
    },
  },
};
</script>