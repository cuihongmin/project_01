<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="deployTime">
        <el-date-picker
          clearable
          size="small"
          v-model="queryParams.deployTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择时间"
        >
        </el-date-picker>
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
          plain
          icon="el-icon-upload"
          size="mini"
          @click="handleImport"
          >导入</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button size="mini" @click="handlePdf">导出PDF</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">
      点我打开
      </el-button>
     <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      direction="rtl"
      class="drawer-title"
      >
      <span>我来啦!lll</span>
     </el-drawer>
    </el-row>
    <!-- bpmn20.xml导入对话框 -->
    <!-- :visible.sync 表示弹框的显示隐藏，当:visible的值为ture的时候，弹框显示，当为false的时候，弹框隐藏 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xml"
        :headers="upload.headers"
        :action="
          upload.url + '?name=' + upload.name + '&category=' + upload.category
        "
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          流程名称：<el-input v-model="upload.name" /> 流程分类：<el-input
            v-model="upload.category"
          />
        </div>
        <div class="el-upload__tip" style="color: red" slot="tip">
          提示：仅允许导入“bpmn20.xml”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { exportPDF } from "@/api/flowable/member";
export default {
  name: "Definition",
  components: {},
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      // 显示搜索条件
      showSearch: true,
      // bpmn.xml 导入
      upload: {
        // 是否显示弹出层（xml导入）
        open: false,
        // 弹出层标题（xml导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        name: null,
        category: null,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/flowable/definition/import",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        category: null,
        key: null,
        tenantId: null,
        deployTime: null,
        derivedFrom: null,
        derivedFromRoot: null,
        parentDeploymentId: null,
        engineVersion: null,
      },
      formQueryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
    };
  },
  methods: {
     handleClose(done) {
      console.log("sssss");
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        category: null,
        key: null,
        tenantId: null,
        deployTime: null,
        derivedFrom: null,
        derivedFromRoot: null,
        parentDeploymentId: null,
        engineVersion: null,
      };
      this.resetForm("form");
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      //   this.getList();
    },
    /** 导入bpmn.xml文件 */
    handleImport() {
      this.upload.title = "bpmn20.xml文件导入";
      this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$message(response.msg);
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 导出PDF
    handlePdf() {
      console.log("ooo");
      window.location.href = "/dev-api/report/exportBusinessReport4PDF";
      // this.download("asd");
      // window.location.href = "/dev-api/report/exportBusinessReport4PDF.do";
      // dow;
      // exportPDF().then((response) => {
      //   console.log("kkkk");

      //   let pdfUrl = window.URL.createObjectURL(
      //     new Blob([response], { type: "application/pdf" })
      //   );
      //   console.log(pdfUrl);
      //   const link = document.createElement("a");
      //   console.log(link);
      //   link.href = pdfUrl;

      //   // const blob = new Blob([response], { type: "application/pdf" });
      //   // console.log(blob);
      //   // const a = document.createElement("a");
      //   // a.href = URL.createObjectURL(blob);
      //   // let d = "report.pdf";
      //   // a.download = `${d}.pdf`; // 这里填保存成的文件名
      //   // a.click;
      //   // URL.revokeObjectURL(a.href);
      //   // a.remove;

      //   // console.log(response);
      //   // let uploadUrl = "report.pdf";
      //   // this.download(response);
      // });
    },
  },
};
</script >
<style  scoped>
 
</style>
