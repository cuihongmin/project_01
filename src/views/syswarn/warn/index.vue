<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="预警状态" prop="warnState">
        <el-select v-model="queryParams.warnState"  placeholder="请选择" clearable size="small">
          <el-option
            v-for="item in warnState"
            :key="item.warnState"
            :label="item.warnStateType"
            :value="item.warnState"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预警时间" prop="warnTime">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="预警信息源" prop="warnSourceId">
        <el-input
          v-model="queryParams.warnSourceId"
          placeholder="请输入预警信息源"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预警类型" prop="warnType">
        <el-select v-model="queryParams.warnType" placeholder="巡查预警,定量预警" clearable size="small">
          <el-option
            v-for="item in warnType"
            :key="item.warnType"
            :label="item.warnTypeName"
            :value="item.warnTypeName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预警级别" prop="warnLevel">
        <el-select v-model="queryParams.warnLevel"  placeholder="请选择" clearable size="small">
          <el-option
            v-for="dict in warnLevelOpetion"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="warnList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="解除预警时间" align="center" prop="id" />-->
      <el-table-column label="预警时间" align="center" prop="warnTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.warnTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预警类型" align="center" prop="warnType" />
      <el-table-column label="预警级别" align="center" prop="warnLevel" :formatter="warnLevelFormat" />
      <el-table-column label="预警状态" align="center" prop="warnState" :formatter="warnStateFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
<!--       scope.row.warnState === 0  验证warnStats是否为0，0即预警状态，1为解除预警-->
          <el-button
            v-show="scope.row.warnState === 1"
            size="mini"
            type="text"
            @click="removeWarn(scope.row)"
            v-hasPermi="['syswarn:recode:relieve']"
          >解除预警</el-button>
        </template>
      </el-table-column>
      <el-table-column label="预警信息源" align="center" prop="warnSourceId" />
      <el-table-column label="其他" align="center" prop="remark" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listWarn, relieveWarn } from "@/api/syswarn/warn";

export default {
  name: "Warn",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // warn表格数据
      warnList: [],
      // 日期范围
      dateRange: [],
      // 预警级别数据字典
      warnLevelOpetion:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 预警类型
      warnType:[
        {warnType: 1,warnTypeName:'巡查预警'},
        {warnType: 2,warnTypeName:'定量预警'},
      ],
      // 预警状态
      warnState:[
        {warnState: 0, warnStateType: '已解除预警'},
        {warnState: 1, warnStateType: '未解除预警'}],
      // 报警级别
      warnLevel: [
        {warnLevelId: 1, warnColor: '红色预警'},
        {warnLevelId: 2, warnColor: '橙色预警'},
        {warnLevelId: 3, warnColor: '黄色预警'}],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warnTime: undefined,
        warnType: undefined,
        warnLevel: undefined,
        warnState: undefined,
        warnSourceId: undefined,
        dataSourceId: undefined,
        relieveWarnTime: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_warn_level").then(response => {
      this.warnLevelOpetion = response.data;
    });
  },
  methods: {
    /** 查询warn列表 */
    getList() {
      this.loading = true;
      listWarn(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.warnList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        warnTime: undefined,
        warnType: undefined,
        warnLevel: undefined,
        warnState: undefined,
        warnSourceId: undefined,
        dataSourceId: undefined,
        relieveWarnTime: undefined,
        createTime: undefined,
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [],
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 解除预警按钮操作 */
    removeWarn(row) {
      this.$confirm('是否确认解除"' + row.id + '预警', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return relieveWarn(row.id);
      }).then(() => {
        this.getList();
        this.msgSuccess("解除成功!");
      }).catch(function() {});
    },

    warnStateFormat(row, column) {
        if (row.warnState == 1) {
          return '预警'
        } else if (row.warnState == 0) {
          return '解除预警'
        } else {
          return '参数错误'
        }
      },
    warnLevelFormat(row, column) {
      if (row.warnLevel == 1){
        return '红色预警'
      }else if (row.warnLevel == 2){
        return '橙色预警'
      }else if (row.warnLevel == 3){
        return '黄色预警'
      }
    }
    }
  };
</script>
