<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="巡检时间" prop="patrolTime">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="巡查人员" prop="patrolPerson">
        <el-input
          v-model="queryParams.patrolPerson"
          placeholder="请输入巡查人员"
          style="width: 140px"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="巡检类别" prop="patrolTypeId">
        <el-select v-model="queryParams.patrolTypeId" placeholder="请选择巡检类别" clearable size="small">
          <el-option
            v-for="dict in patrolTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
            style="width: 140px"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="安全评估" prop="safetyAssessment">
        <el-select v-model="queryParams.safetyAssessment" placeholder="请选择安全评估" clearable size="small">
          <el-option
            v-for="dict in safetyAssessmentOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
            style="width: 140px"
          />
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
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['datacollect:artificialPatrol:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['datacollect:artificialPatrol:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['datacollect:artificialPatrol:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-unlock"
          size="mini"
          :disabled="multiple"
          @click="handleJcPatrol"
        >预警解除状态</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="artificialPatrolList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="巡检时间" align="center" prop="patrolTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.patrolTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡检类别" align="center" prop="patrolTypeId" :formatter="patrolTypeFormat" show-overflow-tooltip/>
      <el-table-column label="安全评估" align="center" prop="safetyAssessment" :formatter="safetyAssessmentFormat" show-overflow-tooltip/>
      <el-table-column label="信息状态发布" align="center" prop="stateRelease" :formatter="stateReleaseFormat" show-overflow-tooltip/>
      <el-table-column label="记录人" align="center" prop="createBy" />
      <el-table-column label="记录时间" align="center" prop="createTime" />
      <el-table-column label="预警解除状态" align="center" prop="warnState">
        <template slot-scope="scope">
          <span>{{ scope.row.warnState == '0' ? '未解除' : '已解除' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预警解除时间" align="center" prop="warnRelieveTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.warnRelieveTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="解除人" align="center" prop="relieveByName" />
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['datacollect:artificialPatrol:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['datacollect:artificialPatrol:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="$refs.detial.open(scope.row)"
          >详情</el-button>
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

    <!-- 添加或修改人工巡检登记对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检时间" prop="patrolTime">
              <el-date-picker clearable size="small" style="width: 200px"
                              v-model="form.patrolTime"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择巡检时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巡检类别" prop="patrolTypeId">
              <el-select v-model="form.patrolTypeId" placeholder="请选择巡检类别" clearable size="small">
                <el-option
                  v-for="dict in patrolTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巡查人员" prop="patrolPerson">
              <el-input v-model="form.patrolPerson" placeholder="请输入巡查人员" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安全评估" prop="safetyAssessment">
              <el-select v-model="form.safetyAssessment" placeholder="请选择安全评估" clearable size="small">
                <el-option
                  v-for="dict in safetyAssessmentOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 60px">
            <el-form-item label="巡检情况" prop="patrolDetails">
              <Editor v-model="form.patrolDetails" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="资料附件" prop="files" class="bigItem">
              <el-upload
                :action="requestApi + '/file/uploadToFtp'"
                :headers="headers"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :limit="3"
                :before-remove="beforeRemove"
                :file-list="fileList"
                :on-success="handleAvatarSuccess"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">最多上传三个附件！</div>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col style="display:none;">
            <el-dialog :visible.sync="dialogImageVisible" append-to-body>
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
            <el-dialog :visible.sync="dialogVedioVisible" append-to-body>
              <video width="600" height="500" controls>
                <source :src="videoUrl" type="video/mp4" />
                <source :src="videoUrl" type="video/webm" />
                <source :src="videoUrl" type="video/ogg" />您的浏览器不支持 HTML5 video 标签。
              </video>
            </el-dialog>
            <el-dialog :visible.sync="dialogAedioVisible" append-to-body>
              <audio :src="aideoUrl">您的浏览器不支持 audio 标签。</audio>
            </el-dialog>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发布内容" prop="releaseContent">
              <el-input v-model="form.releaseContent" type="textarea" placeholder="请输入发布内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态发布" prop="stateRelease">
              <el-select v-model="form.stateRelease" placeholder="请选择状态发布" clearable size="small">
                <el-option
                  v-for="dict in stateReleaseOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接受人员" prop="acceptBy">
              <el-input disabled v-model="form.acceptByName" placeholder="请选择接受人员" >
                <el-button slot="append" icon="el-icon-user" @click="$refs.user.add(selectUser, 'getAddUser')"></el-button>
              </el-input>
              <el-input style="display: none" v-model="form.acceptBy" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 预警状态解除对话框 -->
    <el-dialog title="解除预警" :visible.sync="open_jc" width="600px" append-to-body>
      <el-form ref="form_jc" :model="form_jc" :rules="rules_jc" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="预警解除时间" prop="patrolTime">
              <el-date-picker clearable size="small" style="width: 200px"
                              v-model="form_jc.warnRelieveTime"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择预警解除时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="解除预警人员" prop="relieveBy">
              <el-input disabled v-model="form_jc.relieveByName" style="width: 200px" placeholder="请选择解除预警人员" >
                <el-button slot="append" icon="el-icon-user" @click="$refs.user2.add(selectUser2, 'getAddUser2')"></el-button>
              </el-input>
              <el-input style="display: none" v-model="form_jc.relieveBy" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="安全评估" prop="safetyAssessment">
              <el-select v-model="form_jc.safetyAssessment" placeholder="请选择安全评估" clearable size="small">
                <el-option
                  v-for="dict in safetyAssessmentOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="解除操作情况" prop="releaseContent">
              <el-input v-model="form_jc.relieveDetails" type="textarea" placeholder="请输入解除操作情况" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm_jc">保 存</el-button>
        <el-button @click="cancel_jc">取 消</el-button>
      </div>
    </el-dialog>
    <!--详情-->
    <DetialDialog ref="detial" />
    <!--用户选择弹框（多选）-->
    <userAddMultipleDialog ref="user" @getAddUser="getAddUser" />
    <!--用户选择弹框（单选）-->
    <userAddSingleDialog ref="user2" @getAddUser2="getAddUser2" />
  </div>
</template>

<script>
import { listArtificialPatrol,
  getArtificialPatrol,
  delArtificialPatrol,
  addArtificialPatrol,
  updateArtificialPatrol,
  relieveWarning,
  exportArtificialPatrol } from "@/api/datacollect/artificialPatrol";
import Editor from '@/components/Editor';
import { getToken } from "@/utils/auth";
import userAddMultipleDialog from "@/views/system/user/userAddMultipleDialog";
import userAddSingleDialog from "@/views/system/user/userAddSingleDialog";
import DetialDialog from "./DetialDialog";
export default {
  name: "ArtificialPatrol",
  components: {
    Editor,
    DetialDialog,
    userAddMultipleDialog,
    userAddSingleDialog
  },
  data() {
    return {
      headers: {
        Authorization: "Bearer " + getToken()
      },
      requestApi: process.env.VUE_APP_BASE_API,
      fileList: [],
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
      // 人工巡检登记表格数据
      artificialPatrolList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 解除预警是否显示弹出层
      open_jc: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        patrolTime: undefined,
        patrolTypeId: undefined,
        safetyAssessment: undefined,
        patrolPerson: undefined,
        patrolDetails: undefined,
        attachPath: undefined,
        releaseContent: undefined,
        stateRelease: undefined,
        acceptBy: undefined,
        warnState: undefined,
        warnRelieveTime: undefined,
        relieveDetails: undefined,
        relieveBy: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      //  解除预警,表单参数
      form_jc: {},
      //  解除预警,表单校验
      rules_jc: {
      },
      selectUser: [],
      selectUser2: [],
      safetyAssessmentOptions: [],
      patrolTypeOptions: [],
      stateReleaseOptions: [],
      // 日期范围
      dateRange: [],
      // 文件
      dialogImageUrl: undefined,
      dialogImageVisible: false,
      fileNameDown: undefined
    };
  },
  created() {
    //加载数据字典
    this.getDicts("patrol_safety_assessment").then(response => {
      this.safetyAssessmentOptions = response.data;//安全评估
    });
    this.getDicts("patrol_type").then(response => {
      this.patrolTypeOptions = response.data;//巡检类别
    });
    this.getDicts("patrol_state_release").then(response => {
      this.stateReleaseOptions = response.data;//状态发布
    });
    this.getList();
  },
  methods: {
    /** 查询人工巡检登记列表 */
    getList() {
      this.loading = true;
      listArtificialPatrol(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.artificialPatrolList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 安全评估字典翻译
    safetyAssessmentFormat(row, column) {
      return this.selectDictLabel(this.safetyAssessmentOptions, row.safetyAssessment);
    },
    // 巡检类别字典翻译
    patrolTypeFormat(row, column) {
      return this.selectDictLabel(this.patrolTypeOptions, row.patrolTypeId);
    },
    // 状态发布字典翻译
    stateReleaseFormat(row, column) {
      return this.selectDictLabel(this.stateReleaseOptions, row.stateRelease);
    },
    // 附件上传
    handleAvatarSuccess(res) {
      // console.log("handleAvatarSuccess res ", res);
      if (res.code === 200) {
        this.fileList.push(res.data);
      } else {
        this.$message({
          message: res.msg,
          type: "error",
          duration: 1000
        });
      }
    },
    beforeRemove(file, files) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove(file, files) {
      console.log(file, files);
      this.fileList = this.fileList.filter(item => {
        return item.uid !== file.uid;
      });
    },
    handlePreview(file) {
      var fileType = file.fileSuffix
      if(fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'gif'){
        this.dialogImageUrl = file.url;
        this.dialogImageVisible = true;
      }else if(fileType == 'mp4' || fileType == 'avi' || fileType == 'asf' || fileType == 'rm' || fileType == 'navi'){
        this.videoUrl = file.url;
        this.dialogVedioVisible = true;
      }else if(fileType == 'mp3' || fileType == 'wav'){
        this.aideoUrl = file.url;
        this.dialogAedioVisible = true;
      }else{
        window.location.href = file.url;
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 解除预警取消按钮
    cancel_jc() {
      this.open_jc = false;
      this.reset_jc();
    },
    /** 解除预警表单重置 */
    reset_jc() {
      this.form_jc = {
        warnRelieveTime: undefined,
        relieveByName: undefined,
        relieveBy: undefined,
        safetyAssessment: undefined,
        relieveDetails: undefined
      };
      this.resetForm("form_jc");
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        patrolTime: undefined,
        patrolTypeId: undefined,
        safetyAssessment: undefined,
        patrolPerson: undefined,
        patrolDetails: undefined,
        attachPath: undefined,
        releaseContent: undefined,
        stateRelease: undefined,
        acceptBy: undefined,
        warnState: undefined,
        remark: undefined,
        warnRelieveTime: undefined,
        relieveDetails: undefined,
        relieveBy: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        files: [],
        acceptBy: undefined,
        acceptByName: undefined
      };
      this.fileList = []
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.selectUser = [];
      this.selectUser2 = [];
      this.open = true;
      this.title = "添加人工巡检登记";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getArtificialPatrol(id).then(response => {
        this.open = true;
        // 将附件值进行转换
        var filesArr = [];
        if (response.data.files) {
          filesArr = JSON.parse(response.data.files);
        }
        // 返回值将附件删除再给表单赋值
        delete response.data.files;
        this.form = response.data;
        // 附件赋值
        this.form.files = filesArr;
        this.fileList = filesArr
        //接收人员回显
        this.selectUser = [];
        var acceptBys = '';
        if(response.data.acceptBy != null){
          acceptBys = response.data.acceptBy.split(',');
        }
        var acceptByNames = '';
        if(response.data.acceptByName != null){
          acceptByNames = response.data.acceptByName.split(',');
        }
        for(var i =0; i < acceptBys.length; i++){
          var user = new Object()
          user.userId = acceptBys[i]
          user.nickName = acceptByNames[i]
          this.selectUser.push(user)
        }
      });
    },
    /** 解除预警按钮 */
    handleJcPatrol(row) {
      this.reset_jc();
      const id = row.id || this.ids
      getArtificialPatrol(id).then(response => {
        this.open_jc = true;
        this.form_jc = response.data;
        //解除预警人员回显
        this.selectUser2 = [];
        var user = new Object();
        user.userId = response.data.relieveBy;
        user.nickName = response.data.relieveByName;
        this.selectUser2.push(user);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //附件赋值
          if (this.fileList) {
            this.form.files = JSON.stringify(this.fileList);
            console.log("this.form.files ", this.form.files);
          }
          if (this.form.id != undefined) {
            updateArtificialPatrol(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addArtificialPatrol(this.form).then(response => {
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
    /** 解除预警弹框 提交按钮 */
    submitForm_jc: function() {
      this.$refs["form_jc"].validate(valid => {
        if (valid) {
          relieveWarning(this.form_jc).then(response => {
              if (response.code === 200) {
                this.msgSuccess("保存成功！");
                this.open_jc = false;
                this.getList();
              }
            });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除人工巡检登记编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delArtificialPatrol(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有人工巡检登记数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportArtificialPatrol(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    getAddUser(data) {
      this.selectUser = data
      var userIds = ''
      var userNames = ''
      this.selectUser.map(item => {
        userIds += item.userId + ','
        userNames += item.nickName + ','
      });
      this.form.acceptBy = userIds.substring(0, userIds.length - 1);
      this.form.acceptByName = userNames.substring(0, userNames.length - 1);
    },
    getAddUser2(data) {
      this.selectUser2.push(data);
      var userId = data.userId;
      var userName = data.nickName;
      this.form_jc.relieveBy = userId;
      this.form_jc.relieveByName = userName;
    }
  }
};
</script>
