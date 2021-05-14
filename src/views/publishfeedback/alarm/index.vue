<template>
  <div class="app-container">
    <el-row :gutter="20">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
      <el-form-item label="安全员编号：" prop="safetyCode" >
        <el-input
          v-model="queryParams.safetyCode"
          placeholder="输入安全员编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名：" prop="safetyName">
        <el-input
          v-model="queryParams.safetyName"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门：" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入部门"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号：" prop="mobilePhone">
        <el-input
          v-model="queryParams.mobilePhone"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发送时间">
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
      <el-form-item label="报警级别" prop="warnLevelId">
        <el-select v-model="queryParams.warnLevelId"  placeholder="请选择"  style="width:100%">
          <el-option
            v-for="item in warnLevel"
            :key="item.warnLevelId"
            :label="item.warnColor"
            :value="item.warnLevelId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送类型" prop="sendType">
        <el-select v-model="queryParams.sendType"  placeholder="请选择"  style="width:100%">
          <el-option
            v-for="item in sendType"
            :key="item.typeId"
            :label="item.type"
            :value="item.typeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit-outline"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['publishfeedback:alarm:add']"
        >手动发送电子邮件</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['publishfeedback:alarm:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="alarmList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="安全员编号" align="center" prop="safetyCode" />
      <el-table-column label="姓名" align="center" prop="safetyName" />
      <el-table-column label="部门" align="center" prop="deptName" />
      <el-table-column label="职务" align="center" prop="positionName" />
      <el-table-column label="手机号码" align="center" prop="mobilePhone" />
      <el-table-column label="报警级别" align="center" prop="warnLevel" />
      <el-table-column label="报警内容" align="center" prop="content" />
      <el-table-column label="发送状态" align="center" prop="sendState" :formatter="sendFormat"/>
      <el-table-column label="发送时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送类型" align="center" prop="sendType" :formatter="stateFormat"/>
      <el-table-column label="记录加载人" align="center" prop="recordLoadUser" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    </el-row>

    <!-- 添加或修改邮件报警对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="预警级别：" prop="warnLevelId">
          <el-select v-model="form.warnLevelId"  placeholder="请选择"  style="width:100%">
            <el-option
              v-for="item in warnLevel"
              :key="item.warnLevelId"
              :label="item.warnColor"
              :value="item.warnLevelId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话报警内容：" prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="form.content"
            placeholder="请输入报警内容" />
        </el-form-item>
        <el-form-item label="接收人员：" prop="selectSafetyPeople">
         <el-table :data="selectSafetyPeople"
                    :show-header="hiddenTableHeader"
                    :row-style="{height: '30px'}">
          <el-table-column   align="center" prop="name" />
          </el-table>
          <el-button type="primary" @click="getForm" style="margin-left: 82%" >选 择</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--  选择发送人员对话框 -->
    <el-dialog :title="safetyTitle" :visible.sync="safetyOpen" width="1000px" append-to-body>
      <el-form :model="safetyParams" ref="safetyQueryForm" :inline="true" label-width="68px">
        <el-form-item label="安全编号" prop="code">
          <el-input
            v-model="safetyParams.code"
            placeholder="请输入安全人员编号"
            clearable
            size="small"
            @keyup.enter.native="handleQuerySafety"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="safetyParams.name"
            placeholder="请输入姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuerySafety"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuerySafety">查询</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuerySafety">重置</el-button>
        </el-form-item>
      </el-form>
      <el-form ref="safetyForm" :model="safetyForm" :rules="rules" label-width="80px">
        <el-table v-loading="loading" :data="safetyPeoples"  @selection-change="handleSelectionChangeSafety">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="姓名" align="center" prop="name" />
          <el-table-column label="安全编号" align="center" prop="code" />
          <el-table-column label="部门" align="center" prop="deptName" />
          <el-table-column label="职务" align="center" prop="positionName" />
          <el-table-column label="手机" align="center" prop="mobilePhone" />
          <el-table-column label="邮箱" align="center" prop="email" />
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectPeopleSubmit">确 定</el-button>
        <el-button @click="cancelSafety">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAlarm, getAlarm, delAlarm, addAlarm, updateAlarm, exportAlarm } from "@/api/publishfeedback/alarm";
import { listList } from "../../../api/safetypeople/list";

export default {
  name: "Alarm",
  data() {
    // 自定义表单校验方法 项目名称重复验证
    let valName = (rule, value, callback) => {
        if (this.selectSafetyPeople === '') {
          callback(new Error('安全人员不能为空！'))
        } else if(this.selectSafetyPeople.length === 0) {
          callback(new Error("安全人员不能为空!"));
        } else {
          callback();
        }
    };
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
      // 报警： 包括电话报警、短信邮件等表格数据
      alarmList: [],
      //安全人员列表
      safetyPeoples: [],
      // 弹出层标题
      title: "",
      // 选择安全人弹出层标题
      safetyTitle: "",
      // 是否显示弹出层
      open: false,
      // 是否显示安全人员列表弹出层
      safetyOpen: false,
      // 日期范围
      dateRange: [],
      hiddenTableHeader: false,
      // 报警级别
      warnLevel: [
        {warnLevelId: 1, warnColor: '红色预警'},
        {warnLevelId: 2, warnColor: '橙色预警'},
        {warnLevelId: 3, warnColor: '黄色预警'},
        {warnLevelId: 4, warnColor: '正常预警'}],
      // 发送类型
      sendType: [
        {typeId: 1, type: '手动发送'},
        {typeId: 2, type: '自动发送'}],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        alarmWayId: undefined,
        safetyCode: undefined,
        deptId: undefined,
        positionId: undefined,
        warnLevelId: undefined,
        sendState: undefined,
        safetyName: undefined,
        mobilePhone: undefined,
        pushTime: undefined,
        sendType: undefined,
        deptName: undefined,
        begin : undefined,
        endTime: undefined,
      },
      //安全人员查询请求参数
      safetyParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        relevanceUserId: undefined,
        code: undefined,
        deptId: undefined,
        deptName: undefined,
        positionId: undefined,
        mobilePhone: undefined,
        email: undefined,
        modifyTime: undefined,
        modifyBy: undefined,
      },
      // 安全人员列表选中数据
      selectSafetyPeople: [],
      // 表单参数
      form: {
        alarmWayId: 2
      },
      //安全人员表单参数
      safetyForm: {},
      // 表单校验
      rules: {
        warnLevelId: [
          { required: true, message: "预警级别不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "安全员姓名不能为空", trigger: "blur" }
        ],
        selectSafetyPeople: [
          { validator: valName, required: true, trigger: 'blur'},
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getListSafety();
  },
  methods: {
    /** 查询报警： 包括电话报警、短信邮件等列表 */
    getList() {
      this.loading = true;
      listAlarm(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.alarmList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询安全人员列表 */
    getListSafety() {
      this.loading = true;
      listList(this.safetyParams).then(response => {
        this.safetyPeoples = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 选择按钮操作 */
    getForm(){
      this.safetyTitle = "选择发送人员";
      this.safetyReset();
      listList(this.safetyParams).then(response => {
        this.safetyPeoples = response.rows;
      });;
      this.safetyOpen = true;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 安全人员列表页面取消按钮
    cancelSafety(){
      this.safetyOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        safetyCode: undefined,
        deptId: undefined,
        positionId: undefined,
        warnLevelId: undefined,
        content: undefined,
        sendState: undefined,
        createTime: undefined,
        createBy: undefined,
        safetyName: undefined,
        mobilePhone: undefined,
      };
      this.resetForm("form");
    },
    // 安全人员表单重置
    safetyReset() {
      this.safetyForm = {
        id: undefined,
        name: undefined,
        relevanceUserId: undefined,
        code: undefined,
        deptId: undefined,
        positionId: undefined,
        mobilePhone: undefined,
        email: undefined,
        remark: undefined,
        createTime: undefined,
        modifyTime: undefined,
        createBy: undefined,
        modifyBy: undefined,
      };
      this.resetForm("safetyForm");
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
    /** 安全人员页面搜索按钮操作 */
    handleQuerySafety() {
      this.safetyParams.pageNum = 1;
      this.getListSafety();
    },
    /** 选择安全人员页面重置按钮操作 */
    resetQuerySafety() {
      this.resetForm("safetyQueryForm");
      this.handleQuerySafety();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    // 安全人员页面多选框选中数据
    handleSelectionChangeSafety(selection) {
      this.selectSafetyPeople = selection;
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.selectSafetyPeople = [];
      this.reset();
      this.open = true;
      this.title = " 手动邮件报警（*为必填项）";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAlarm(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改报警： 包括电话报警、短信邮件等";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.form.safetyPeopleIds = this.selectSafetyPeople.map(item => item.id);
      this.form.alarmWayId = 2;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateAlarm(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addAlarm(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除报警： 包括电话报警、短信邮件等编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAlarm(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },

    //选择安全人员确定方法
    selectPeopleSubmit() {
      this.safetyOpen = false;
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有报警： 包括电话报警、短信邮件等数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAlarm(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },

    /** 手动自动发送类型显示 */
    stateFormat(row, column) {
      if (row.sendType == 1) {
        return '手动发送'
      } else  {
        return '自动发送'
      }
    },

    /** 发送状态显示 */
    sendFormat(row, column) {
      if (row.sendState == 1) {
        return '发送'
      } else if (row.sendState == 0) {
        return '发送失败'
      } else if (row.sendState == 2){
        return '未发送'
      }
    },


  },
};
</script>
