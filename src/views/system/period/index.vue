<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span><i class="el-icon-s-grid"></i>传感器</span>
          </div>
          <el-table
            :data="tableData"
            border
            :show-header="hiddenTableHeader"
            style="width: 100%"
          >
            <el-table-column prop="name" label="姓名" width="90">
            </el-table-column>
            <el-table-column prop="num" label="数量" width="90">
              <template slot-scope="scope">
                <el-input
                  :value="scope.row.num"
                  placeholder="请输入内容"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="val" label="单位" width="90">
              <template slot-scope="scope">
                <el-select :value="scope.row.val" placeholder="请选择文章标签">
                  <el-option value="时">时 </el-option>
                  <el-option value="分">分 </el-option>
                  <el-option value="秒">秒 </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="state" label="状态" width="90">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row)"
                  :type="scope.row.state == '已启用' ? 'danger' : 'primary'"
                  size="small"
                  >{{
                    scope.row.state == "已启用" ? "禁用" : "启用"
                  }}</el-button
                >
                <el-button
                  @click="handleClick(scope.row)"
                  type="primary"
                  size="small"
                  >保存</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span><i class="el-icon-s-data">其他设备</i></span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <thead>
                <tr>
                  <th class="is-leaf"><div class="cell">属性</div></th>
                  <th class="is-leaf"><div class="cell">内存</div></th>
                  <th class="is-leaf"><div class="cell">JVM</div></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div class="cell">总内存</div></td>
                  <td>
                    <div class="cell"></div>
                  </td>
                  <td>
                    <div class="cell"></div>
                  </td>
                </tr>
                <tr>
                  <td><div class="cell">已用内存</div></td>
                  <td>
                    <div class="cell"></div>
                  </td>
                  <td>
                    <div class="cell"></div>
                  </td>
                </tr>
                <tr>
                  <td><div class="cell">剩余内存</div></td>
                  <td>
                    <div class="cell"></div>
                  </td>
                  <td>
                    <div class="cell"></div>
                  </td>
                </tr>
                <tr>
                  <td><div class="cell">使用率</div></td>
                  <td>
                    <div
                      class="cell"
                      v-if="server.mem"
                      :class="{ 'text-danger': server.mem.usage > 80 }"
                    >
                      {{ server.mem.usage }}%
                    </div>
                  </td>
                  <td>
                    <div
                      class="cell"
                      v-if="server.jvm"
                      :class="{ 'text-danger': server.jvm.usage > 80 }"
                    >
                      {{ server.jvm.usage }}%
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getServer } from "@/api/monitor/server";
export default {
  data() {
    return {
      hiddenTableHeader: false,
      tableData: [
        {
          name: "GNSS位移",
          num: "20",
          val: "时",
          state: "已启用",
        },
        {
          name: "GNSS位移",
          num: "20",
          val: "时",
          state: "已启用",
        },
        {
          name: "GNSS位移",
          num: "20",
          val: "时",
          state: "已启用",
        },
        {
          name: "GNSS位移",
          num: "20",
          val: "时",
          state: "已启用",
        },
        {
          name: "GNSS位移",
          num: "20",
          val: "时",
          state: "已启用",
        },
        {
          name: "王小虎",
          num: "20",
          val: "时",
          state: "已启用",
        },
        {
          name: "王小虎",
          num: "20",
          val: "时",
          state: "未启用",
        },
      ],
      server: [],
    };
  },
  methods: {
    getList() {
      getServer().then((response) => {
        this.server = response.data;
        this.loading.close();
      });
    },
    handleClick(row) {
      console.log(row);
    },
  },
};
</script>

<style>
</style>