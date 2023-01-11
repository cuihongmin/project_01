<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="88px"
      v-show="showSearch"
    >
      <el-form-item label="流程KEY" prop="key">
        <el-input
          v-model="queryParams.key"
          placeholder="请输入流程KEY"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
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
          >搜索</el-button
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
          @click="OnlineDrawingProcess"
          v-hasPermi="['activiti:modeler']"
          >在线绘制流程
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleImport"
          v-hasPermi="['activiti:modeler']"
          >部署流程
        </el-button>
      </el-col>
    </el-row>
    <!--bpmnjs在线流程设计器-->
    <!-- <el-dialog
      :visible.sync="modelVisible"
      title="流程图"
      width="1680px"
      @close="modelCancel"
      append-to-body
    ></el-dialog> -->
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      modelerUrl: "",
      modelVisible: false,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        rev: null,
        name: null,
        type: null,
      },
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url:
          process.env.VUE_APP_BASE_API +
          "/processDefinition/uploadStreamAndDeployment",
      },
    };
  },
  created() {},
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      console.log("yyyyy");
      //   this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleImport() {
      console.log("进行流程部署");
      this.upload.title = "上传模型图";
      this.upload.open = true;
    },
    OnlineDrawingProcess() {
      console.log("ssss");
      this.modelVisible = true;
      // 什么是localStorage？
      // localStorage这个特性主要是用来作为本地存储来使用的，解决了cookie存储空间不足的问题
      // localStorage优势
      // 1、localStorage拓展了cookie的4K限制
      // 2、localStorage会可以将第一次请求的数据直接存储到本地，这个相当于一个5M大小的针对于前端页面的数据库，相比于cookie可以节约带宽，但是这个却是只有在高版本的浏览器中才支持的
      // 3、localStorage与sessionStorage的唯一一点区别就是localStorage属于永久性存储，而sessionStorage属于当会话结束的时候，sessionStorage中的键值对会被清空
      // localStorage的使用
      // localStorage.getItem(key):获取指定key本地存储的值
      // localStorage.setItem(key,value)：将value存储到key字段
      console.log(process.env.VUE_APP_BASE_API);
      localStorage.setItem("VUE_APP_BASE_API", process.env.VUE_APP_BASE_API);
      this.modelerUrl = "/bpmnjs/index.html?type=addBpmn";
      console.log("kkkk");
    },
    // 关闭对话框事件
    modelCancel() {
      console.log("关闭对话框");
      //   this.getList();
    },
  },
};
</script>
