<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="输入关键字进行过滤"
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
      <el-col :span="20">
        <el-container>
          <el-main style="margin-left: 10px">
            <avue-crud
              :option="option"
              :data="istList"
              :table-loading="loading"
              ref="crud"
              @search-change="searchChange"
              @search-reset="searchReset"
            >
              <template slot="menuLeft">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-plus"
                  @click="handleDesign({})"
                >
                  新 增
                </el-button>
                <el-button type="success" size="mini" icon="el-icon-connection">
                  更改分类
                </el-button>
              </template>
            </avue-crud>
          </el-main>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { treeselect } from "@/api/system/dept";
import { ListList } from "@/api/plugin/workflow/model";
import WfCategory from "../process/components/category.vue";
import { tree } from "@/api/plugin/workflow/category";
import { mapGetters } from "vuex";
export default {
  name: "design",
  components: { WfCategory },
  data() {
    return {
      loading: true,
      // 部门名称
      deptName: undefined,
      // 部门树选项
      deptOptions: undefined,
      // 流程定义模型数据
      istList: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        modelKey: undefined,
        name: undefined
      },
      option: {
        size: "mini",
        height: "auto",
        calcHeight: 30,
        tip: false,
        border: true,
        index: true,
        viewBtn: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        selection: true,
        dialogType: "drawer",
        align: "center",
        searchMenuSpan: 6,
        menuWidth: 280,
        column: [
          {
            label: "图标",
            prop: "icon",
            type: "upload",
            width: 80
          },
          {
            label: "模型key",
            prop: "modelKey",
            overHidden: true,
            search: true
          },
          {
            label: "模型名称",
            prop: "name",
            overHidden: true,
            search: true
          },

          {
            label: "描述",
            prop: "description",
            overHidden: true
          },
          {
            label: "版本",
            prop: "version",
            width: 80
          }
        ]
      },

      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.wf_design_model_add, false),
        viewBtn: this.vaildData(this.permission.wf_design_model_view, false),
        delBtn: this.vaildData(this.permission.wf_design_model_delete, false),
        editBtn: this.vaildData(this.permission.wf_design_model_edit, false)
      };
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      // 过滤器 （返回里面有包含val的）
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    // this.getTreeselect();
    this.getCategoryList();
  },
  methods: {
    /** 查询流程模型列表 */

    getList() {
      this.loading = true;
      ListList(this.queryParams).then(response => {
        console.log(response.rows);
        this.istList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 绑定搜索按钮
    searchChange(params, done) {
      // console.log("222==");
      // console.log(params.modelKey);
      // console.log(params.name);
      this.query = params;
      this.queryParams.modelKey = params.modelKey;
      this.queryParams.name = params.name;
      this.getList();
      // this.onLoad(this.page, params);
      if (done && typeof done == "function") done();
    },
    // 绑定清空按钮
    searchReset() {
      // console.log(this.query);
      this.queryParams.id = undefined;
      this.queryParams.modelKey = undefined;
      this.queryParams.name = undefined;
      this.getList();
    },
    nodeClick({ id }) {
      this.categoryId = id;
      this.searchChange(this.query);
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    /** 查询部门下拉树结构 */
    getCategoryList() {
      tree().then(res => {
        const data = res.data;
        // this.$emit("list-change", this.deepClone(data));
        this.data = data;
        console.log(data);
        data.unshift({ id: "", label: "全部" });
        this.deptOptions = data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      console.log("ggggg");
      console.log(data);
      this.queryParams.id = data.id;
      this.getList();
    },
    // 新增
    handleDesign(row) {
      console.log(row);
      this.$router.push("/workflow/design/process/" + (row.id || 0));
    }
  }
};
</script>
