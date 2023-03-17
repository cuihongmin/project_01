<template>
  <div class="box">
    <div class="leftbox">
      <!-- <el-row>
      <el-col :span="24"><Bar /></el-col>
    </el-row>
    <el-row>
      <el-col><LineChart /></el-col>
    </el-row>
    <el-row>
      <el-col><SmoothLine /></el-col>
    </el-row> -->
      <span style="background-color: #c3c2f5"><Bar /></span>
      <!-- <el-row>
        <el-col :span="24"><LineChart /></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"
          ><el-select v-model="value" placeholder="请选择"></el-select
        ></el-col>
      </el-row> -->
      <!-- <span style="height: 5%"
        ><el-select v-model="value" placeholder="请选择"></el-select
      ></span> -->
      <span style="background-color: #dcecf4"><LineChart /> </span>

      <span style="background-color: #f2f2f2"><SmoothLine /></span>
    </div>
    <div class="rightbox">
      <span id="main" style="background-color: #f2f2f2">
        <PieChart />
      </span>
      <span style="background-color: #d4f5f5"><RadarChart /></span>
    </div>
  </div>
</template>

 <script type="text/javascript" >
import PieChart from "@/views/charts/PieChart";
import LineChart from "@/views/charts/LineChart";
import RadarChart from "@/views/charts/RadarChart";
import SmoothLine from "@/views/charts/SmoothLine";
import Bar from "@/views/charts/Bar";

export default {
  components: {
    PieChart,
    LineChart,
    RadarChart,
    SmoothLine,
    Bar,
  },
};
</script>

<style scoped>
.box {
  display: flex;
  height: 100%;
  width: 100%;
}
.box div {
  flex-direction: column;
  flex: 1;
}
.leftbox {
  display: flex;
}
.leftbox span {
  flex-direction: column;
  flex: 1;
  margin: 0 10px 10px 0;
}
.rightbox {
  display: flex;
}
.rightbox span {
  flex-direction: column;
  flex: 1;
}
.rightbox #main2 {
  border-style: 1px solid #000;
}
</style>