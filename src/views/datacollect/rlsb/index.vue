<template>
<div class="login">
     <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
    <h3 class="title">管理系统</h3>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="账户登录" name="first">
             <el-form-item prop="username">
                <el-input
                v-model="loginForm.username"
                type="text"
                auto-complete="off"
                placeholder="账号"
            >
              <svg-icon
                slot="prefix"
                icon-class="user"
                class="el-input__icon input-icon"
               />
            </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                   v-model="loginForm.password"
                   type="password"
                   auto-complete="off"
                   placeholder="密码"
                   @keyup.enter.native="handleLogin"
                   >
                   <svg-icon
                     slot="prefix"
                     icon-class="password"
                     class="el-input__icon input-icon"
                    />
                </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaOnOff">
                <el-input
                  v-model="loginForm.code"
                  uto-complete="off"
                  placeholder="验证码"
                  style="width: 63%"
                  @keyup.enter.native="handleLogin"
                >
                  <svg-icon
                   slot="prefix"
                   icon-class="validCode"
                   class="el-input__icon input-icon"
                  />
                </el-input>
                <div class="login-code">
                  <img :src="codeUrl" @click="getCode" class="login-code-img" />
                </div>
            </el-form-item>
             <el-checkbox
            v-model="loginForm.rememberMe"
            style="margin: 0px 0px 25px 0px"
            >记住密码</el-checkbox>
             <el-form-item style="width: 100%">
                <el-button
                  :loading="loading"
                  size="medium"
                  type="primary"
                  tyle="width: 100%"
                  @click.native.prevent="handleLogin"
                >
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
                <div style="float: right" v-if="register">
              <router-link class="link-type" :to="'/register'"
                >立即注册</router-link
              >
            </div>
             </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="人脸识别" name="second">
             <div class="testTrackingWrapper">
                <video
                id="video"
                width="340"
                height="300"
                preload
                autoplay
                loop
                muted
            ></video>
             <canvas id="canvas" width="550" height="400"></canvas>
             <div class="buttonWrapper">
                <button type="button" @click="submitPhoto">上传</button>
                <button type="button" name="button" @click="openCamera">拍照</button>
             </div>
             </div>
        </el-tab-pane>
    </el-tabs>
    </el-form>
    <!-- 底部 -->
</div>
</template>

<script>
// import  {getCodeImg}  from "@/api/login";
// import {Cookies} from "js-cookie";
// import  {encrypt, decrypt}  from "@/utils/jsencrypt";
// import tracking from '@/assets/js/face-min.js';
// import '@/assets/js/face-min.js'
require('tracking/build/tracking-min.js')
require('tracking/build/data/face-min.js')

export default {
    data() {
        return {
        // open: false, //控制摄像头开关
        // video: null,
        image: "",
        activeName: "first",
        codeUrl: "",
        url: "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",
        loginForm: {
         username: "admin",
         password: "admin123",
         rememberMe: false,
         code: "",
         uuid: "a2c85bb253e1480495a43508b4edc482",
        },
        loginRules: {
          username: [{required: true, trigger: "blur", message: "请输入您的账号" }],
          password: [{required: true, trigger: "blur", message: "请输入您的密码"}],
          code: [{required: true, trigger: "change", message: "请输入验证码"}],
        },
        loading: false,
        // 验证码开关
        captchaOnOff: true,
        // 注册开关
        register: true,
        redirect: undefined,
        }
    },
    created() {
      this.getCode();
    //   this.getCookie();
    //   getTitle().then(res => {
    //     this.title = res.msg;
    //  });
  },
    methods: {
        //选项卡点击事件
     handleClick(tab, event) {
         console.log(tab, event);
         if (tab.name == "first") {
            this.stopNaigator();
         } else {
            // this.openCamera();
         }

     },
     // 获取验证码
     getCode() {
        console.log("56897");
         this.codeUrl = "data:image/gif;base64," + this.url;
        //  this.loginForm.uuid = res.uuid;
        // getCodeImg().then((res) => {
        //     console.log("2356");
        //     this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        //     if (this.captchaOnOff) {
        //       this.codeUrl = "data:image/gif;base64," + res.img;
        //       this.loginForm.uuid = res.uuid;
        // }
        // });
     },

     //提交
    submitPhoto() {
        let _this = this;
        let canvas = document.getElementById("canvas");
        let context = canvas.getContext("2d");
        let video = document.getElementById("video");
        context.drawImage(video, 0, 0, 500, 400);
        let formData=new FormData();
        let base64File=canvas.toDataURL(); 
        formData.append("file",base64File);
        formData.append("groupId","group1");
        this.$store
            .dispatch("Facelogin", formData)
             .then(() => {
                this.stopNavigator();
                this.$router.push( {path: this.redirect || "/" }).catch(() => {});
             })
             .catch(() =>{
                this.loading = false;
                this.getCode();
             });
    },
    // 打开摄像头
    openCamera() {
      let formData=new FormData();
      formData.append("file","base64File");
      formData.append("groupId","group1");
      console.log(formData);
      console.log("oooo");
      var _this = this;
      var video = document.getElementById("video");
      var canvas = document.getElementById("canvas");
      var context = canvas.getContext("2d");
      console.log(video);
      console.log(canvas);
      console.log(context);
      const tracker = new tracking.ObjectTracker('face');
      console.log("258963");
      console.log(tracker);

    //   var tracker = new tracking.ObjectTracker("face");
      tracker.setInitialScale(4);
      tracker.setStepSize(2);
      tracker.setEdgesDensity(0.1);

      this.trackerTask = tracking.track("#video", tracker,  {camera: true });
      console.log("456789");

       tracker.on("track", function (event) {
         context.clearRect(0, 0, canvas.width, canvas.height);
         event.data.forEach(function (rect) {
          context.font = "11px Helvetica";
          context.fillText("已识别到人脸，请点击拍照", 100, 40);
          context.strokeStyle = "#a64ceb";
          context.strokeRect(rect.x, rect.y, rect.width, rect.height);
         });

       });
    },

    //关闭摄像头
    stopNavigator() {
        if (video && video !== null) {
             video.srcObject.getTracks()[0].stop();
            // this.open = true; //切换成打开摄像头
        }
    },
    beforeDestroy() {
      this.stopNavigator();
    }
   
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../../../assets/image/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}
.login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;
  .el-input {
     height: 38px;
    input {
     height: 38px;
    }
  }
  .input-icon {
     height: 39px;
    width: 14px;
    margin-left: 2px;
  }
   
} 
  
  

.login-tip {
 font-size: 13px;
  text-align: center;
  color: #bfbfbf;

}
 
.login-code {
 width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
   
}
 
  

.el-login-footer {
 height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
 

.login-code-img {
 height: 38px;
}
 

.testTrackingWrapper {
height: 300px;
  width: 200px;
  position: relative;
}
  

video {
    background: red;
}
canvas {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  background: yellow;
}
.buttonWrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 7%;
}
  

</style>