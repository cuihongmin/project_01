<template>
  <el-dialog center title="详情" :visible.sync="dialogVisible" width="65%">
    <div class="bff_wrap">
      <div class="bff_table">
        <el-row :gutter="20" type="flex">
          <el-col :span="4" class="col col_key">
            <div>巡检时间</div>
          </el-col>
          <el-col :span="8" class="col co_value">
            <div>{{ detialData.patrolTime }}</div>
          </el-col>
          <el-col :span="4" class="col col_key">
            <div>巡检类别</div>
          </el-col>
          <el-col :span="8" class="col co_value">
            <div>{{ detialData.patrolTypeName }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="4" class="col col_key">
            <div>巡查人员</div>
          </el-col>
          <el-col :span="8" class="col co_value">
            <div>{{ detialData.patrolPerson }}</div>
          </el-col>
          <el-col :span="4" class="col col_key">
            <div>安全评估</div>
          </el-col>
          <el-col :span="8" class="col co_value">
            <div>{{ detialData.safetyAssessmentName }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="4" class="col col_key">
            <div>巡检情况</div>
          </el-col>
          <el-col :span="20" class="col co_value">
            <div v-html="detialData.patrolDetails"></div>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="4" class="col col_key">
            <div>资料附件</div>
          </el-col>
          <el-col :span="20" class="col co_value">
            <div style="margin-bottom:5px;color:blue;"
              v-for="(d,index) in files"
              :key="index"
              href="#"
              @click="previewFile(d.url,d.name)"
            ><a>{{ d.name }}</a>
            </div>
            <el-row style="display:none;">
              <el-dialog :visible.sync="dialogImageVisible" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
            </el-row>
            <el-row style="display:none;">
              <a id="linkUrl" href download></a>
            </el-row>
            <el-row style="display:none;">
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
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="4" class="col col_key">
            <div>发布内容</div>
          </el-col>
          <el-col :span="20" class="col co_value">
            <div>{{ detialData.releaseContent }}</div>
          </el-col>
        </el-row>

        <el-row :gutter="20" type="flex">
          <el-col :span="4" class="col col_key">
            <div>状态发布</div>
          </el-col>
          <el-col :span="8" class="col co_value">
            <div>{{ detialData.stateReleaseName }}</div>
          </el-col>
          <el-col :span="4" class="col col_key">
            <div>接受人员</div>
          </el-col>
          <el-col :span="8" class="col co_value">
            <div>{{ detialData.acceptByName }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
          <el-col :span="4" class="col col_key">
            <div>创建时间</div>
          </el-col>
          <el-col :span="8" class="col co_value">
            <div>{{ detialData.createTime }}</div>
          </el-col>
          <el-col :span="4" class="col col_key">
            <div>创建人</div>
          </el-col>
          <el-col :span="8" class="col co_value">
            <div>{{ detialData.createBy }}</div>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { getArtificialPatrol } from "@/api/datacollect/artificialPatrol";
export default {
  data() {
    return {
      // 视频播放
      dialogAedioVisible: false,
      aideoUrl: undefined,
      dialogVedioVisible: false,
      videoUrl: undefined,
      // 文件
      fileNameDown: undefined,
      dialogImageUrl: undefined,
      dialogImageVisible: false,
      fileNameDown: undefined,
      dialogVisible: false,
      detialData: {},
      files: [],
      disabled: true
    };
  },
  methods: {
    open(data) {
      getArtificialPatrol(data.id).then(response => {
        this.detialData = response.data;
        response.data.files !== ""
          ? (this.files = JSON.parse(response.data.files))
          : (this.files = []);
        this.dialogVisible = true;
      });
    },
    previewFile(url, name) {
      var filesName = name
      filesName = filesName.toUpperCase()
      if (
        filesName.indexOf("JPG") != -1 ||
        filesName.indexOf("JPEG") != -1 ||
        filesName.indexOf("PNG") != -1 ||
        filesName.indexOf("GIF") != -1
      ) {
        this.dialogImageUrl = url
        this.dialogImageVisible = true
      } else if (
        filesName.indexOf("MP4") != -1 ||
        filesName.indexOf(".AVI") != -1 ||
        filesName.indexOf(".ASF") != -1 ||
        filesName.indexOf(".RM") != -1 ||
        filesName.indexOf("NAVI") != -1
      ) {
        this.videoUrl = url;
        this.dialogVedioVisible = true;
      } else if (
        filesName.indexOf("MP3") != -1 ||
        filesName.indexOf("WAV") != -1
      ) {
        this.aideoUrl = url;
        this.dialogAedioVisible = true;
      } else {
        this.fileNameDown = name
        var aLink = document.getElementById("linkUrl")
        aLink.href = url
        aLink.click()
      }
    },
    ok() {
      console.log(111);
    }
  }
};
</script>
<style scoped>
.bff_title {
  font-size: 20px;
  font-weight: 600;
  color: #2ab4c0;
}
.bff_table {
  margin-top: 20px;
  padding: 0 10px;
}
.col {
  border: 1px solid #dedede;
}
.col_key {
  line-height: 30px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  background: #8edbff;
}
.co_value {
  line-height: 30px;
  /* height: 32px; */
}
.col_key2 {
  line-height: 30px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  background: #f2f2f2;
}
.co_value2 {
  line-height: 30px;
  /* height: 32px; */
}
.col_key22 {
  line-height: 80px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  background: #f2f2f2;
}
.co_value22 {
  line-height: 82px;
}
.col_pinion {
  margin-top: 10px;
}
</style>
