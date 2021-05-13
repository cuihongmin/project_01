<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span><i class="el-icon-s-grid"></i>传感器</span>
          </div>
          <el-table
            :data="tableData"
            v-loading="loading"
            border
            :show-header="hiddenTableHeader"
            style="width: 100%"
          >
            <el-table-column prop="name" label="姓名" width="160">
            </el-table-column>
            <el-table-column prop="dataCollectCycle" label="数量" width="160">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.dataCollectCycle"
                  placeholder="请输入内容"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="collectTimeUnit"
              :formatter="statusFormat"
              label="单位"
              width="160"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.collectTimeUnit"
                  placeholder="请选择文章标签"
                >
                  <el-option
                    v-for="dict in typeOptions"
                    :key="dict.dictValue"
                    :value="dict.dictValue"
                    :label="dict.dictLabel"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="state" label="状态" width="160">
              <template slot-scope="scope">{{
                scope.row.state == 0 ? "未启用" : "已启用"
              }}</template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
              <template slot-scope="scope">
                <el-button
                  @click="handleChangeState(scope.row)"
                  :type="scope.row.state == 1 ? 'danger' : 'primary'"
                  size="small"
                  >{{ scope.row.state == 1 ? "禁用" : "启用" }}</el-button
                >
                <el-button
                  @click="handleSave(scope.row)"
                  type="primary"
                  size="small"
                  >保存</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  listPeriod,
  classifyCollectTimeUnitList,
  classifyStateEdit,
  classify,
} from "@/api/period/period";
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        // orderByColumn: undefined,
        // isAsc: undefined,
      },
      hiddenTableHeader: false,
      //查询列表数据
      tableData: [],
      server: [],
      list: [],
      // 类型数据字典
      typeOptions: [],
    };
  },
  mounted() {
    this.getlistPeriod();
    // 查询数据字典
    this.getDicts("sys_collect_time_unit").then((response) => {
      this.typeOptions = response.data;
    });
  },
  methods: {
    // 调查询列表接口
    getlistPeriod() {
      this.loading = true;
      listPeriod(this.queryParams).then((response) => {
        this.tableData = response.rows;
        console.log(this.tableData);
        this.loading = false;
      });
    },

    getCollectTimeUnitList() {
      classifyCollectTimeUnitList().then((response) => {
        this.list = response.data;
        console.log(this.list);

        // this.loading.close();
      });
    },
    // 点击修改传感器状态接口
    handleChangeState(row) {
      this.getStateEdit(row);
    },
    // 修改状态接口
    getStateEdit(row) {
      if (row.state == 0) {
        let params = {
          id: row.id,
          status: 1,
        };
        classifyStateEdit(params).then((response) => {
          this.getlistPeriod();

          // this.loading.close();
        });
      } else {
        let params = {
          id: row.id,
          status: 0,
        };
        classifyStateEdit(params).then((response) => {
          this.getlistPeriod();
          // this.$forceUpdate();
        });
      }
    },
    // 点击保存按钮
    handleSave(row) {
      console.log(row);
      this.putClassify(row);
    },
    // 调查询列表接口
    putClassify(row) {
      this.loading = true;
      let ipt = {
        id: row.id,
        collectTimeUnit: row.collectTimeUnit,
        dataCollectCycle: row.dataCollectCycle,
      };
      classify(ipt).then((response) => {
        this.getlistPeriod();
        this.msgSuccess("保存成功", 2);
        this.tableData = response.rows;
        console.log(this.tableData);
        this.loading = false;
      });
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.status);
    },
  },
};
</script>

<style>
</style>