<template>
  <div>
    <el-dialog title="" :visible.sync="openDetail" width="70%" append-to-body class="el-dialog__body el-dialog__header">
			<div style="border: 2px solid #E6E6FA;padding:0px 0px 10px 0px;">
				<div
        	style="padding-left:5px;margin-bottom:15px;height:30px;line-height:30px;width:100%;color:black;font-size:15px;background-color:#87CEFF;"
      	>系统信息详情
				</div>
				<el-row style="margin:20px 10px 0px 10px;">
          <div>
            <span style="font-weight:bold;">栏目：</span>
              {{ formDetail.sysColumn }}
          </div>
    		</el-row>
      	<el-row style="margin:20px 10px 0px 10px;">
        	<div>
						<span style="font-weight:bold;">标题：</span>
          	{{ formDetail.sysTitle }}
        	</div>
      	</el-row>
      	<el-row style="margin:20px 10px 0px 10px;">
        	<div>
						<span style="font-weight:bold;">内容：</span>
            <div :style="styles" style="padding:2px;margin-left:20px;overflow:auto;border:1px solid #3c3c3c;" v-html="formDetail.sysContent">
            </div>
        	</div>
      	</el-row>
			</div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
   return {
     title: '检查项详情',
     formDetail: '',
     openDetail: false,
   }
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
   showDetail(row) {
     this.openDetail = true
     this.formDetail = row
     console.log('详情页面打开成功，获取的数据为：', row)
   }
  }
}
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
</style>
