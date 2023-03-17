<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--安全员数据-->
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="安全编号" prop="code">
            <el-input
              v-model="queryParams.code"
              placeholder="请输入安全人员编号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入姓名"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >查询</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['safetypeople:list:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['safetypeople:list:remove']"
              >删除</el-button
            >
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="listList"
          :row-class-name="rowClassName"
          @selection-change="handleSelectionChange"
        >
          <!--      <el-table-column label="id" align="center" prop="id" />-->

          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="姓名" align="center" prop="name" />
          <!--          <el-table-column label="关联账号id" align="center" prop="relevanceUserId" />-->
          <el-table-column label="安全编号" align="center" prop="code" />
          <el-table-column label="部门" align="center" prop="deptName" />
          <el-table-column label="职务" align="center" prop="positionName" />
          <el-table-column label="手机" align="center" prop="mobilePhone" />
          <el-table-column label="邮箱" align="center" prop="email" />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['safetypeople:list:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['safetypeople:list:remove']"
                >删除</el-button
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
      </el-col>
    </el-row>

    <!-- 添加或修改安全人员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-form-item label="关联系统登录账号：" prop="relevanceUserId">
            <el-select
              v-model="form.relevanceUserId"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in users"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
                :disabled="item.status == 1"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item label="安全人员编号：" prop="safetyId">
          <el-input v-model="form.code" placeholder="请输入安全人员编号" />
        </el-form-item>
        <el-form-item label="安全员姓名：" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="工作部门：" prop="deptId">
          <treeselect
            v-model="form.deptId"
            :options="deptOptions"
            :disable-branch-nodes="true"
            :show-count="true"
            placeholder="请选择归属部门"
          />
        </el-form-item>
        <el-form-item label="现任职务：" prop="positionId">
          <!--          <el-select v-model="form.positionId" multiple placeholder="请选择">-->
          <el-select
            v-model="form.positionId"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in postOptions"
              :key="item.postId"
              :label="item.postName"
              :value="item.postId"
              :disabled="item.status == 1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码：" prop="mobilePhone">
          <el-input v-model="form.mobilePhone" placeholder="请输入手机" />
        </el-form-item>
        <el-form-item label="电子邮箱：" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUser,
  listUser,
  addUser,
  updateUser,
  exportUser,
  resetUserPwd,
  changeUserStatus,
  importTemplate,
} from "@/api/system/user";
import {
  listList,
  getList,
  delList,
  addList,
  updateList,
  exportList,
} from "@/api/safetypeople/list";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "List",
  components: { Treeselect },
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
      // 安全人员表格数据
      listList: [],
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 岗位选项
      postOptions: [],
      //用户id
      users: [],
      //用户名
      userName: undefined,
      // 查询参数
      queryParams: {
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
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 表单校验
      rules: {
        code: [
          { required: true, message: "安全员编号不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "安全员姓名不能为空", trigger: "blur" },
        ],
        mobilePhone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      console.log("llll");
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getTreeselect();

    getUser().then((response) => {
      this.postOptions = response.posts;
    });
    listUser().then((response) => {
      this.users = response.rows;
    });
  },
  methods: {
    /** 查询安全人员列表 */
    getList() {
      this.loading = true;
      listList(this.queryParams).then((response) => {
        this.listList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      console.log("sssss");
      console.log(data.id);
      this.queryParams.deptId = data.id;
      this.getList();
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      /* getUser().then(response => {
        this.postOptions = response.posts;
      });
      listUser().then (response => {
        this.users = response.rows;
      });*/
      this.reset();
      this.getTreeselect();
      this.open = true;
      this.title = "添加安全人员信息（*为必填项）";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();

      const id = row.id || this.ids;
      getList(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改安全人员";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateList(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addList(this.form).then((response) => {
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
    rowClassName({ row, rowIndex }) {
      //把每一行的索引放进row.id
      row.order = rowIndex + 1;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.order || this.ids;
      this.$confirm('是否确认删除序号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delList(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>
