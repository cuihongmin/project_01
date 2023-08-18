<template>
    <div>
        <div class="videoContent">
         <video
                id="video"
                width="340"
                height="300"
                preload
                autoplay
                loop
                muted
            ></video>
    </div>

        <!-- <el-form :model="personalForm" :rules="rules" ref="personalForm" label-width="180px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="身份证证件照：" required style="" prop="merIdenImgFront">
                        <el-row type="flex" justify="space-between" class="uploadidcard">
                            <el-col :span="10">
                                <el-upload
                                    class="idCard1"
                                    :action="uploadURL"
                                    list-type="picture-card"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess1"
                                    accept=".JPG, .png, .jpeg"
                                    multiple="multiple"
                                    :on-change="idenImghandleChange"
                                    >
                                    <img v-if="merIdenImgFront" :src="merIdenImgFront" class="avatar" style="width:100%;height:100%">
                                </el-upload>
                            </el-col>
                            <el-col :span="10">
                                <el-upload
                                    
                                    class="idCard2"
                                    :action="uploadURL"
                                    list-type="picture-card"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess2"
                                    accept=".JPG, .png, .jpeg"
                                    multiple="multiple"
                                    :on-change="idenImghandleChange"
                                    >
                                    <img v-if="merIdenImgBack" :src="merIdenImgBack" class="avatar" style="width:100%;height:100%">
                                </el-upload>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label=""> 
                <p style="color:#888">注：以上所需上传照片仅支持JPEG、GIF、PNG格式的图片，大小不超过2M。</p>
            </el-form-item>
            <el-form-item label="">
                <div class="btn-wrap">
                    <button type="button" @click="personalSubmit('personalForm')">提交</button>
                </div>
            </el-form-item>
        </el-form> -->
    </div>
</template>
<script>
export default {
//     data() {
//         // 身份证正面验证
//         var validateImgFront=(rule, value, callback)=>{//（关键代码）
//             if(this.personalForm.merIdenImgFront==''&&this.personalForm.merIdenImgBack==''){
//                 return callback(new Error('附件不能为空'))
//             }else if(this.personalForm.merIdenImgFront==''){
//                 return callback(new Error('请上传身份证正面'))
//             }else if(this.personalForm.merIdenImgBack==''){
//                 return callback(new Error('请上传身份证背面'))
//             }else{
//                 callback()
//             }
//         };
//         return {
//             uploadURL:'',//自己的上传地址
//             personalForm:{
//                 merIdenImgFront:'',//身份证正面
//                 merIdenImgBack:'',//身份证反面
//             },
//             merIdenImgFront:'',
//             merIdenImgBack:'',
//             rules:{
//                 // 身份证正反面
//                 merIdenImgFront: [
//                     {validator: validateImgFront, trigger: 'change'}
//                 ]
//             }
//         }   
//     },
//     methods:{
//         // 上传身份证正面成功
//         handleAvatarSuccess1(response, file, fileList){
//             this.merIdenImgFront=file.url;//保存临时图片
//             this.personalForm.merIdenImgFront=response;//保存到提交表单
//         },
//         // 上传身份证反面成功
//         handleAvatarSuccess2(response, file, fileList){
//             this.merIdenImgBack=file.url;//保存临时图片
//             this.personalForm.merIdenImgBack=response;//保存到提交表单
//         },
        
//         // 身份证表单验证
//         idenImghandleChange(){
//             this.$refs.personalForm.validateField('merIdenImgFront');//对部分表单字段进行校验的方法，也就是手动进行表单验证（关键代码）
//         },
//         //提交
//         personalSubmit(formName){
//             this.$refs[formName].validate(async(valid) => {
//                 if (valid) {
//                     console.log('OJBK')
//                 } else {
//                     return false;
//                 }
//             });
//         },
//     }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.videoContent {
    width: 100%;
    height: 100%;
    // display: block;
  }
  .videoContent video {
    // width: 100px;
    // height: 100px;
    object-fit: fill;
    background: red;
    // object-fit: cover;
  }
</style>