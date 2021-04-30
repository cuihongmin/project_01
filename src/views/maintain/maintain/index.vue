<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <!--<el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['maintain:maintain:add']"
        >新增</el-button>
      </el-col>-->
      <!--<el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['maintain:maintain:edit']"
        >修改</el-button>
      </el-col>-->
    </el-row>

    <el-table border v-loading="loading" :data="maintainList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="系统栏目" align="center" prop="sysColumn" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['maintain:maintain:edit']"
          >修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="75%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-suffix=":">
        <el-row>
          <el-col :span="24">
            <el-form-item label="栏目" prop="sysColumn">
              <el-input v-model="form.sysColumn" placeholder="请输入系统栏目" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="标题" prop="sysTitle">
              <el-input v-model="form.sysTitle" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容" prop="sysContent">
              <Editor v-model="form.sysContent" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="padding-top:20px">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <maintain-detail ref="detail"></maintain-detail>
  </div>
</template>

<script>
import { listMaintain, getMaintain, delMaintain, addMaintain, updateMaintain, exportMaintain } from "@/api/maintain/maintain";
import Editor from '@/components/Editor';
import MaintainDetail from './maintainDetail.vue';

export default {
  name: "Notice",
  components: {
    Editor,
    MaintainDetail
  },
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
      // 系统信息维护表格数据
      maintainList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        sysColumn: [
          { required: true, message: "系统栏目不能为空", trigger: "blur", maxlength: 125 }
        ],
        sysTitle: [
          { required: true, message: "标题不能为空", trigger: "blur", maxlength: 125 }
        ],
        sysContent: [
          { required: true, message: "内容不能为空", trigger: "blur", maxlength: 2048 }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询系统信息维护列表 */
    getList() {
      this.loading = true;
      listMaintain(this.queryParams).then(response => {
        this.maintainList = response.rows;
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
        sysId: undefined,
        sysColumn: undefined,
        sysTitle: undefined,
        sysContent: undefined,
        status: "0",
        createBy: undefined,
        createName: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateName: undefined,
        updateTime: undefined,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.sysId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加系统信息";
    },
    /**明细操作 */
    handleDetail(row) {
      this.openDetail = true
      console.log('选择的数据为：', row)
      this.$refs.detail.showDetail(row)
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const sysId = row.sysId || this.ids
      getMaintain(sysId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改系统信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.sysId != undefined) {
            updateMaintain(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addMaintain(this.form).then(response => {
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
      const sysIds = row.sysId || this.ids;
      this.$confirm('是否确认删除系统信息维护编号为"' + sysIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delMaintain(sysIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有系统信息维护数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportMaintain(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function() {});
    }
  }
};
</script>
