<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="所属分类">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option
            v-for="dict in warnTypeOptions"
            :key="dict.dictValue"
            :value="dict.dictValue"
            :label="dict.dictLabel"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预警级别">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option
            v-for="dict in warnLevelOptions"
            :key="dict.dictValue"
            :value="dict.dictValue"
            :label="dict.dictLabel"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        > -->
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="jobList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="" width="30" align="center" prop="jobId" />
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="所属分类"
        align="center"
        prop="type"
        :show-overflow-tooltip="true"
        :formatter="warnTypeFormat"
      />
      <el-table-column
        label="预警级别"
        align="center"
        prop="warnLevel"
        :formatter="warnLevelFormat"
      />
      <el-table-column
        label="执行动作"
        align="center"
        prop="invokeTarget"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="通知安全员"
        align="center"
        prop="cronExpression"
        :show-overflow-tooltip="true"
        width="120"
      />
      <el-table-column
        label="备注"
        align="center"
        prop="cronExpression"
        :show-overflow-tooltip="true"
        width="160"
      />

      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleRun(scope.row)"
            v-hasPermi="['monitor:job:edit']"
            >编辑执行操作</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleView(scope.row)"
            v-hasPermi="['monitor:job:query']"
            >编辑安全人员</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改定时任务对话框 -->
    <el-dialog
      title="选择预警执行动作（可多选）"
      :visible.sync="open"
      width="300px"
      append-to-body
    >
      <div class="checkbox">
        <el-checkbox label="弹窗报警" name="type"></el-checkbox>
        <el-checkbox label="声音报警" name="type"></el-checkbox>
        <el-checkbox label="邮件报警" name="type"></el-checkbox>
        <el-checkbox label="短信报警" name="type"></el-checkbox>
        <el-checkbox label="电话报警" name="type"></el-checkbox>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 任务日志详细 -->
    <el-dialog
      title="选择安全人员"
      :visible.sync="openView"
      width="800px"
      append-to-body
    >
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="安全编号">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        > -->
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="jobList"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="" width="30" align="center" prop="jobId" />
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="安全编号"
          align="center"
          prop="jobName"
          :show-overflow-tooltip="true"
          :formatter="warnTypeFormat"
        />
        <el-table-column
          label="姓名"
          align="center"
          prop="warnLevel"
          :formatter="warnLevelFormat"
        />
        <el-table-column
          label="部门"
          align="center"
          prop="invokeTarget"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="登录账号"
          align="center"
          prop="cronExpression"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="职务"
          align="center"
          prop="cronExpression"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="手机"
          align="center"
          prop="cronExpression"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="邮箱"
          align="center"
          prop="cronExpression"
          :show-overflow-tooltip="true"
        />
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="openView = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listJob,
  getJob,
  delJob,
  addJob,
  updateJob,
  exportJob,
  runJob,
  changeJobStatus,
} from "@/api/monitor/job";
import { warnConfigList } from "@/api/warningSet/warningSet.js";

export default {
  name: "Job",
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
      // 定时任务表格数据
      jobList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示详细弹出层
      openView: false,
      // 任务组名字典
      warnTypeOptions: [],
      // 状态字典
      warnLevelOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jobName: undefined,
        jobGroup: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        jobName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" },
        ],
        invokeTarget: [
          {
            required: true,
            message: "调用目标字符串不能为空",
            trigger: "blur",
          },
        ],
        cronExpression: [
          {
            required: true,
            message: "cron执行表达式不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_warn_type").then((response) => {
      this.warnTypeOptions = response.data;
    });
    this.getDicts("sys_warn_level").then((response) => {
      this.warnLevelOptions = response.data;
    });
  },
  methods: {
    /** 查询定时任务列表 */
    getList() {
      this.loading = true;
      warnConfigList(this.queryParams).then((response) => {
        this.jobList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 任务组名字典翻译
    warnTypeFormat(row, column) {
      return this.selectDictLabel(this.warnTypeOptions, row.type);
    },
    // 状态字典翻译
    warnLevelFormat(row, column) {
      return this.selectDictLabel(this.warnLevelOptions, row.warnLevel);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        jobId: undefined,
        jobName: undefined,
        jobGroup: undefined,
        invokeTarget: undefined,
        cronExpression: undefined,
        misfirePolicy: 1,
        concurrent: 1,
        status: "0",
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.jobId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 任务状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.jobName + '"任务吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return changeJobStatus(row.jobId, row.status);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    /* 立即执行一次 */
    handleRun(row) {
      this.open = true;
    },
    /** 任务详细信息 */
    handleView(row) {
      getJob(row.jobId).then((response) => {
        this.form = response.data;
        this.openView = true;
      });
    },
    /** 任务日志列表查询 */
    handleJobLog() {
      this.$router.push("/job/log");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加任务";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const jobId = row.jobId || this.ids;
      getJob(jobId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改任务";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.jobId != undefined) {
            updateJob(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addJob(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const jobIds = row.jobId || this.ids;
      this.$confirm(
        '是否确认删除定时任务编号为"' + jobIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delJob(jobIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有定时任务数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportJob(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
<style scoped>
div .checkbox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-wrap: nowrap;
  margin-left: 4rem;
}
.el-checkbox {
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  user-select: none;
  margin-right: 30px;
  margin: 0.6rem 0;
}
.dialog-footer {
  padding: 20px;
  padding-top: 10px;
  text-align: center;
  box-sizing: border-box;
}
</style>