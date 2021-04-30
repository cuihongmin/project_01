<template>
  <div class="app-container" data-options="region:'center',border: flase" style="position: absolute; padding: 2px; overflow: hidden; width: 100%; height: 100%;">
    <div class="newNotice" style="text-align: center">
      <h3>{{formDetail.sysColumn}}</h3>
      <div style="font-size: 14px; border-bottom:1px solid  #ccc; ">来源：{{ formDetail.createName }}&nbsp;&nbsp;{{ formDetail.createTime }}</div>
      <div style="text-align: left" v-html="formDetail.sysContent">
      </div>
    </div>
  </div>
</template>

<script>
import { getMaintainByTitle } from "@/api/maintain/maintain";

export default {
  name: "ProjectMaintain",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: "",
      formDetail: '',
    };
  },
  created() {
    this.getMaintain();
  },
  computed: {
    styles() {
      let style = {};
      if (this.minHeight) {
        style.minHeight = `${this.minHeight}px`;
      }
      if (this.height) {
        style.height = `${this.height}px`;
      }
      return style;
    },
  },
  methods: {
    /** 修改按钮操作 */
    getMaintain() {
      const sysColumn = '尾矿库介绍';
      getMaintainByTitle(sysColumn).then(response => {
        this.formDetail = response.data;
      });
    }
  }
};
</script>
<style>
.el-dialog__body {
  padding: 28px 18px !important;
  color: #606266 !important;
  font-size: 14px !important;
  word-break: break-all !important;
}
.el-dialog__header {
  padding: 6px !important;
  padding-bottom: 6px !important;
}
.newNotice {
  width: 100%;
  margin: 0 auto;
  position: relative;
  top: 0px;
  left: 0px;
  padding: 0 35px;
}
</style>
