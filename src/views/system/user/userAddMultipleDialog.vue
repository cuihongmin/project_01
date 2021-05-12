<template>
  <el-dialog center title="选择用户" :visible.sync="dialogVisible" width="65%">
    <div class="app-container">
      <el-row :gutter="20">
        <!--单位数据-->
        <el-col :span="6" :xs="24">
          <div class="head-container">
            <el-input
              v-model="deptName"
              placeholder="请输入单位名称"
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
            >
            <span class="custom-tree-node" slot-scope="{ node, data }" style="width:100%;">
              <el-tooltip :content="node.label" placement="top-start" effect="dark">
                <span>{{ node.label }}</span>
              </el-tooltip>
            </span>
            </el-tree>
          </div>
        </el-col>
        <!--用户数据-->
        <el-col :span="18" :xs="24">
          <el-table
            v-loading="loading"
            :data="userList"
            @selection-change="handleSelectionChange"
            @select="handleSelect"
            border
            ref="multipleTable"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              label="用户名称"
              align="center"
              prop="userName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="用户昵称"
              align="center"
              prop="nickName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="单位"
              align="center"
              prop="dept.deptName"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="手机号码" align="center" prop="phonenumber" width="120" />
          </el-table>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ok">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { selectUser } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "User",
  components: { Treeselect },
  // props: {
  //   selectUser: {
  //     type: Array,
  //     default: []
  //   }
  // },
  data() {
    return {
      dialogVisible: false,
      // 遮罩层
      loading: true,
      // 选中数组
      selectArr: [],
      selectUser: [],
      func: '',
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 单位树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 单位名称
      deptName: undefined,
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 查询参数
      queryParams: {
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      }
    };
  },
  watch: {
    // 根据名称筛选单位树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    // this.getList();
    this.getTreeselect();
  },
  methods: {
    add(data, func) {
      this.dialogVisible = true;
      this.selectUser = data
      this.selectArr = data
      this.func = func
      this.getList()
    },
    toggleSelection(rows) {
      rows.forEach(row => {
        if(row.checked == '1'){
          this.$refs.multipleTable.toggleRowSelection(row, true);
        }
      });
    },
    ok() {
      this.$emit(this.func, this.selectArr);
      this.dialogVisible = false;
      this.selectUser = []
      this.selectArr = []
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      selectUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          console.log('response', response)
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
          this.userList.map(item => {
            this.selectUser.map(ele => {
              if(item.userId == ele.userId){
                item.checked = '1'
              }
            })
          })
          this.$nextTick(() => {
            this.toggleSelection(this.userList);
          });
        }
      );
    },
    /** 查询单位下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
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
      this.queryParams.deptId = data.id;
      // this.getList();
      this.loading = true;
      selectUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
          //合并this.selectArr和this.selectUser
          var selected = this.selectArr.concat(this.selectUser)
          console.log('selected', selected)
          this.userList.map(item => {
            selected.map(ele => {
              if(item.userId == ele.userId){
                item.checked = '1'
              }
            })
          })
          this.$nextTick(() => {
            this.toggleSelection(this.userList);
          });
        }
      );
    },
    // 取消按钮
    cancel() {
      this.dialogVisible = false;
      this.selectUser = []
      this.selectArr = []
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 多选框选中数据*/
    handleSelectionChange(selection) {
      this.selectArr = selection.map(item => item);
    },
    handleSelect(selection, row){
      let selected = selection.length && selection.indexOf(row) !== -1
      if(selected){
        this.selectArr.push(row)
      }else{
        this.selectArr = this.selectArr.filter(item => {
          return item.userId != row.userId
        })
      }
    }
  }
};
</script>
