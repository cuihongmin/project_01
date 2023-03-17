<template>
  <div class="dashboard-editor-container">
    <div class="image">
      <img src="../image/welcome.png" />
    </div>

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper"><Bar /></div>
        <div class="chart-wrapper1">
          <span>
            <el-select
              v-model="value"
              placeholder="请选择年份"
              style="float: right"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </span>
          <line-chart :chart-data="lineChartData" />
        </div>
        <div class="chart-wrapper2">
          <div class="chart-yuan"></div>
          <div class="chart-yuan"></div>
          <div class="chart-yuan"></div>
          <div class="chart-yuan"></div>
          <SmoothLine />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12"
        ><div class="chart-wrapper3"><PieChart /></div>
        <div class="chart-wrapper4">
          <span
            ><el-select
              v-model="value1"
              placeholder="请选择项目"
              style="float: right"
              ><el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option></el-select></span
          ><radar-chart :chart-data="radarChartData" />
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

//
<script type="text/javascript">
// import PieChart from "@/views/charts/PieChart";
// import LineChart from "@/views/charts/LineChart";
// import RadarChart from "@/views/charts/RadarChart";
// import SmoothLine from "@/views/charts/SmoothLine";
// import Bar from "@/views/charts/Bar";

// const lineChartData = {
//   newVisitis: {
//     expectedData: [734, 1090, 830, 450, 232, 301, 500, 320, 156, 489, 215, 652],
//     actualData: [4200, 3000, 20000, 35000, 50000, 18000],
//   },
//   messages: {
//     expectedData: [300, 592, 420, 744, 260, 630, 240, 830, 450, 232, 301, 500],
//     actualData: [2200, 1000, 20000, 35000, 20000, 8000],
//   },
//   purchases: {
//     expectedData: [830, 450, 232, 301, 500, 180, 100, 121, 104, 105, 90, 100],
//     actualData: [2200, 5000, 20000, 35000, 50000, 14000],
//   },
//   shoppings: {
//     expectedData: [130, 240, 141, 242, 145, 150, 160, 120, 690, 100, 138, 142],
//     actualData: [6200, 4000, 20000, 35000, 40000, 23000],
//   },
//   wode: {
//     expectedData: [120, 82, 891, 154, 162, 140, 130, 180, 360, 151, 106, 345],
//     actualData: [3200, 5000, 30000, 25000, 20000, 16000],
//   },
// };

// export default {
//   components: {
//     PieChart,
//     LineChart,
//     RadarChart,
//     SmoothLine,
//     Bar,
//   },
//   data() {
//     return {
//       lineChartData: lineChartData.newVisitis,
//       radarChartData: lineChartData.newVisitis,
//       options: [
//         {
//           value: "112233",
//           label: "2000年",
//         },
//         {
//           value: "221133",
//           label: "2001年",
//         },
//         {
//           value: "331122",
//           label: "2021年",
//         },
//         {
//           value: "441122",
//           label: "2022年",
//         },
//         {
//           value: "551122",
//           label: "2023年",
//         },
//       ],
//       value: "",
//       options1: [
//         {
//           value: "112233",
//           label: "标准用例测试",
//         },
//         {
//           value: "221133",
//           label: "CAD大云端测试",
//         },
//         {
//           value: "331122",
//           label: "测王哈哈试",
//         },
//         {
//           value: "441122",
//           label: "测试条目测试",
//         },
//         {
//           value: "551122",
//           label: "测试成功案例",
//         },
//       ],
//       value1: "",
//     };
//   },
//   watch: {
//     value(val) {
//       console.log("kkkkk", val);
//       if (val == 112233) {
//         this.handleSetLineChartData("newVisitis");
//       }
//       if (val == 221133) {
//         this.handleSetLineChartData("messages");
//       }
//       if (val == 331122) {
//         this.handleSetLineChartData("purchases");
//       }
//       if (val == 441122) {
//         this.handleSetLineChartData("shoppings");
//       }
//       if (val == 551122) {
//         this.handleSetLineChartData("wode");
//       }
//     },
//     value1(val) {
//       if (val == 112233) {
//         this.handleSetRadarChart("newVisitis");
//       }
//       if (val == 221133) {
//         this.handleSetRadarChart("messages");
//       }
//       if (val == 331122) {
//         this.handleSetRadarChart("purchases");
//       }
//       if (val == 441122) {
//         this.handleSetRadarChart("shoppings");
//       }
//       if (val == 551122) {
//         this.handleSetRadarChart("wode");
//       }
//     },
//   },
//   methods: {
//     handleSetLineChartData(type) {
//       console.log(type);
//       this.lineChartData = lineChartData[type];
//       console.log(this.lineChartData);
//     },
//     handleSetRadarChart(type) {
//       console.log("2222");
//       this.radarChartData = lineChartData[type];
//       // console.log(this.radarChartData = radarChartData[type]);
//     },
//   },
// };
//
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  height: 845px;
  background-color: rgb(240, 242, 245);
  position: relative;
}
.image img {
  width: 100%;
  height: 785px;
  background-color: #ffffff;
}

.chart-wrapper {
  background: #c3c2f5;
  padding: 16px 16px 0;
  margin-bottom: 32px;
  border: 2px solid red;
  border-radius: 15px;
}
.chart-wrapper1 {
  background: #dcecf4;
  padding: 16px 16px 0;
  margin-bottom: 32px;
  border: 2px solid red;
  border-radius: 15px;
}
.chart-wrapper2 {
  background: #f2f2f2;
  padding: 16px 16px 0;
  margin-bottom: 32px;
  border: 2px solid red;
  border-radius: 15px;
}
.chart-yuan {
  width: 20px;
  height: 20px;
  float: left;
  border: 2px solid red;
  border-radius: 50px;
  background: red;
}
.chart-wrapper3 {
  background: #f2f2f2;
  padding: 16px 16px 0;
  margin-bottom: 32px;
  border: 2px solid red;
  border-radius: 15px;
}
.chart-wrapper4 {
  background: #d4f5f5;
  padding: 16px 16px 0;
  margin-bottom: 32px;
  border-radius: 15px;
  border: 2px solid red;
}
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
