<template>
  <basic-container class="wf-design">
    <el-steps
      :active="step"
      finish-status="success"
      simple
      style="margin-bottom: 20px"
    >
      <el-step title="设计表单" icon="el-icon-edit"></el-step>
      <el-step title="设计流程" icon="el-icon-upload">
        <template #title>
          设计流程
          <el-tooltip v-show="step == '1'" content="全屏">
            <i class="el-icon-full-screen" @click="handleFullScreen"></i>
          </el-tooltip>
        </template>
      </el-step>
      <el-step title="完成" icon="el-icon-circle-check"></el-step>
    </el-steps>

    <div v-show="step == 0" class="demo">
      <avue-form
        style="margin-bottom: 66px"
        ref="form1"
        :option="step1.option"
        v-model="step1.form"
      >
        <template #tip>
          <el-link
            type="primary"
            :underline="false"
            @click="$router.push('/plugin/workflow/design/form')"
            >没有想要的表单？点击去设计</el-link
          >
        </template>
        <template #form>
          <avue-form
            v-if="
              option &&
              ((option.column && option.column.length > 0) ||
                (option.group && option.group.length > 0))
            "
            ref="form2"
            v-model="form"
            :option="option"
          ></avue-form>
        </template>
      </avue-form>
    </div>
    <div v-if="step == 1">
      <div
        class="canvas"
        ref="canvas"
        style="height: calc(100vh - 290px); background: white"
      ></div>
      <div id="js-properties-panel" class="panel"></div>
    </div>
    <div v-if="step == 2">
      <wf-design
        ref="bpmn3"
        style="height: calc(100vh - 290px)"
        :options="step3.option"
      ></wf-design>
    </div>
    <div
      class="foot-item"
      :style="{
        width: isCollapse ? 'calc(100% - 80px)' : 'calc(100% - 220px)',
      }"
    >
      <el-button type="primary" size="medium" v-if="step > 0" @click="step--"
        >上一步</el-button
      >
      <el-button
        type="success"
        size="medium"
        v-if="step < 2"
        @click="handleNextStep"
        >下一步</el-button
      >
      <!--<el-button
        type="success"
        size="medium"
        v-if="step == 2"
        @click="handleSave"
        >保存</el-button
      > -->
    </div>
  </basic-container>
</template>

<script>
import { getDetail as getFormByKey } from "@/api/plugin/workflow/form";
import { fullscreenToggel } from "@/utils/util";
import { getList as formList } from "@/api/plugin/workflow/form";
import { mapGetters } from "vuex";
// 引入相关的bpmn的依赖
import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
// import "bpmn-js-properties-panel/dist/assetselement-templates.css";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css"; // 右边工具栏样式

// 初始化xml
import diagramXML from "./bpmnXML";
// 汉化
import zh from "./zh";
// 构建模块
// import propertiesPanelModule from "bpmn-js-properties-panel";
// import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
  CloudElementTemplatesPropertiesProviderModule,
} from "bpmn-js-properties-panel";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda.json";

// import propertiesPanelModule from "bpmn-js-properties-panel";
// import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
// import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";

// import { xmlStr } from "./xmlStr";

export default {
  name: "design",
  created() {
    console.log("旮角哈手机号");
    console.log(diagramXML);
    console.log(this.$route.params.id);
  },
  computed: {
    ...mapGetters(["isCollapse"]),
  },
  watch: {
    //  监听路由的变化获取参数
    "$route.params.id": {
      handler(val) {
        // console.log("HASJDKKS");
        // console.log(val);
        if (!val || val == 0) return;
      },
      immediate: true, // 一开始的数据也要当做一种变化
    },
  },

  data() {
    const _this = this;
    return {
      BpmnModeler: null,
      container: null,
      canvas: null,
      // xmlStr: `
      //     <?xml version="1.0" encoding="UTF-8"?>
      //     <definitions
      //         xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
      //         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      //         xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
      //         xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
      //         xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
      //         xmlns:xsd="http://www.w3.org/2001/XMLSchema"
      //         xmlns:activiti="http://activiti.org/bpmn"
      //         id="m1577635100724"
      //         name=""
      //         targetNamespace="http://www.activiti.org/testm1577635100724"
      //       >
      //       <process id="process" processType="None" isClosed="false" isExecutable="true">
      //         <extensionElements>
      //           <camunda:properties>
      //             <camunda:property name="a" value="1" />
      //           </camunda:properties>
      //         </extensionElements>
      //         <startEvent id="_2" name="start" />
      //       </process>
      //       <bpmndi:BPMNDiagram id="BPMNDiagram_leave">
      //         <bpmndi:BPMNPlane id="BPMNPlane_leave" bpmnElement="leave">
      //           <bpmndi:BPMNShape id="BPMNShape__2" bpmnElement="_2">
      //             <omgdc:Bounds x="144" y="368" width="32" height="32" />
      //             <bpmndi:BPMNLabel>
      //               <omgdc:Bounds x="149" y="400" width="23" height="14" />
      //             </bpmndi:BPMNLabel>
      //           </bpmndi:BPMNShape>
      //         </bpmndi:BPMNPlane>
      //       </bpmndi:BPMNDiagram>
      //     </definitions>
      // `,
      form: {},
      option: {},
      step: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: -1,
        status_equal: 1,
      },
      step1: {
        form: {},
        option: {
          menuBtn: false,
          group: [
            {
              labelPosition: "left",
              label: "选择表单",
              icon: "el-icon-warning-outline",
              arrow: false,
              column: [
                {
                  label: "表单类型",
                  prop: "formType",
                  type: "radio",
                  dicData: [
                    {
                      label: "内置表单",
                      value: 1,
                    },
                    {
                      label: "外置表单",
                      value: 2,
                    },
                    {
                      label: "节点独立表单",
                      value: 3,
                    },
                  ],
                  span: 24,
                  value: 1,
                  event: {
                    change: (val) => {
                      console.log(val);
                      if (!val) return;
                      if (val.value == 1) {
                        console.log("/////");
                        console.log(this.$route.params.id);
                        this.findObject(
                          // 找到this.step1.option.group[0].column下的prop字段，然后定义规则  (发现结构对象 this.findObject是avue中封装的api，可对对象和数组深拷贝。)
                          this.step1.option.group[0].column,
                          "exFormKey"
                        ).display = false;
                        this.findObject(
                          this.step1.option.group[1].column,
                          "column"
                        ).display = false;
                        this.findObject(
                          this.step1.option.group[0].column,
                          "formKey"
                        ).display = true;
                        this.findObject(
                          this.step1.option.group[0].column,
                          "tip"
                        ).display = true;
                        this.findObject(
                          this.step1.option.group[1].column,
                          "form"
                        ).display = true;
                        this.step1.option.group[1].display = true;
                      } else if (val.value == 2) {
                        this.findObject(
                          this.step1.option.group[0].column,
                          "exFormKey"
                        ).display = true;
                        this.findObject(
                          this.step1.option.group[1].column,
                          "column"
                        ).display = true;
                        this.findObject(
                          this.step1.option.group[0].column,
                          "formKey"
                        ).display = false;
                        this.findObject(
                          this.step1.option.group[0].column,
                          "tip"
                        ).display = false;
                        this.option = {};
                        this.step1.option.group[1].display = true;
                      } else if (val.value == 3) {
                        this.findObject(
                          this.step1.option.group[0].column,
                          "exFormKey"
                        ).display = false;
                        this.findObject(
                          this.step1.option.group[1].column,
                          "column"
                        ).display = false;
                        this.findObject(
                          this.step1.option.group[0].column,
                          "formKey"
                        ).display = false;
                        this.findObject(
                          this.step1.option.group[0].column,
                          "tip"
                        ).display = false;
                        this.option = {};
                        this.step1.option.group[1].display = false;
                      }
                    },
                  },
                },
                {
                  label: "表单key",
                  prop: "exFormKey",
                  display: false,
                  rules: [{ required: true, message: "请输入外置表单key" }],
                },
                {
                  label: "表单",
                  prop: "formKey",
                  type: "select",
                  props: {
                    label: "name",
                    value: "formKey",
                  },
                  dicData: [],
                  event: {
                    change: (val) => {
                      _this.option = { menuBtn: false, readonly: true };
                      if (val.value) {
                        console.log("bbbbbb");
                        // console.log(val.value);
                        getFormByKey({ formKey: val.value })
                          .then((res) => {
                            console.log(res);
                            _this.option = {
                              // 此函数可以接受一个字符串str作为参数，并把此str当做一段javascript代码去执行，如果str执行结果是一个值则返回此值，
                              // 否则返回undefined。如果参数不是一个字符串，则直接返回该参数，实例如下:
                              ...eval(
                                "(" +
                                  res.data.content.replace(/this/g, "_this") +
                                  ")"
                              ),
                              menuBtn: false,
                              readonly: true,
                            };
                            console.log("44555888");
                            console.log(_this.option);
                            _this.findObject(
                              this.step1.option.group[1].column,
                              "form"
                            ).display = true;
                          })
                          .catch(() => {
                            _this.findObject(
                              this.step1.option.group[1].column,
                              "form"
                            ).display = false;
                          });
                      } else {
                        _this.findObject(
                          this.step1.option.group[1].column,
                          "form"
                        ).display = false;
                      }
                    },
                  },
                  rules: [{ required: true, message: "请选择表单" }],
                  display: true,
                  filterable: true,
                },
                {
                  labelWidth: 0,
                  prop: "tip",
                  formslot: true,
                },
              ],
            },
            {
              label: "表单预览",
              icon: "el-icon-view",
              display: true,
              arrow: false,
              column: [
                {
                  prop: "form",
                  labelWidth: 0,
                  span: 24,
                  formslot: true,
                  display: false,
                },
                {
                  prop: "column",
                  labelWidth: "0",
                  tip: "可用于控制外置表单字段的显隐配置，如果希望自己控制请忽略此字段",
                  tipPlacement: "top",
                  span: 24,
                  type: "dynamic",
                  children: {
                    align: "center",
                    column: [
                      {
                        label: "字段",
                        prop: "label",
                        rules: [{ required: true, message: "请输入字段名" }],
                      },
                      {
                        label: "属性",
                        prop: "prop",
                        rules: [{ required: true, message: "请输入属性名" }],
                      },
                      {
                        label: "默认可读",
                        prop: "readable",
                        type: "switch",
                        disabled: true,
                        value: true,
                      },
                      {
                        label: "默认可写",
                        prop: "writable",
                        type: "switch",
                        disabled: true,
                        value: true,
                      },
                    ],
                  },
                  display: false,
                },
              ],
            },
          ],
        },
      },
      step2: {
        option: {
          config: false,
          mode: "edit",
          engine: "flowable",
          toolbar: [
            "open",
            "create",
            "fit",
            "zoom-in",
            "zoom-out",
            "undo",
            "redo",
            "import",
            "preview",
          ],
          script: {
            script: {
              enable: false,
              alert:
                "使用之前请先了解脚本会带来的危害，若确定使用请参考文档放开此配置。<br>1、脚本中可以完全访问JVM。<br>2、脚本执行时阻塞许多系统资源。<br>3、脚本执行死循环/占用大量内存等会导致程序崩溃。",
            },
            shell: {
              enable: false,
              alert:
                "使用之前请先了解Shell会带来的危害，若确定使用请参考文档放开此配置。<br>因不确定是否可执行危险命令，如rm -rf *，请充分了解之后再使用。",
              pattern:
                "(rm|mv|kill|ifconfig|docker|reboot|dd|wget|shutdown|halt|poweroff|init|:(){:|:&};:|^foo^bar)",
            },
          },
        },
      },
      process: {},
    };
  },

  mounted() {
    this.getFormList();
    // this.init();
  },
  methods: {
    init() {
      console.log("开始执行");
      // 获取到属性ref为“canvas”的dom节点
      const canvas = this.$refs.canvas;
      // 建模
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        // 添加控制板
        propertiesPanel: {
          parent: "#js-properties-panel",
        },
        additionalModules: [
          // propertiesProviderModule,
          // propertiesPanelModule,

          BpmnPropertiesPanelModule,
          BpmnPropertiesProviderModule,
          CamundaPlatformPropertiesProviderModule,
          CloudElementTemplatesPropertiesProviderModule,
          { translate: ["value", this.customTranslate] }, // 汉化
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor,
        },
      });
      this.createNewDiagram();
    },
    // 方法
    customTranslate(template, replacements) {
      replacements = replacements || {};
      template = zh[template] || template;
      return template.replace(/{([^}]+)}/g, function (_, key) {
        return replacements[key] || "{" + key + "}";
      });
    },
    createNewDiagram() {
      this.openDiagram(diagramXML);

      // 将字符串转换成图显示出来
      // try {
      //   const result = this.bpmnModeler.importXML(diagramXML);
      //   const { warnings } = result;
      //   console.log("0000");
      //   console.log(warnings);
      // } catch (err) {
      //   console.log(err.message, err.warnings);
      // }
      // this.bpmnModeler.importXML(this.xmlStr, err => {
      //   if (err) {
      //     // console.error(err)
      //   } else {
      //     // 这里是成功之后的回调, 可以在这里做一系列事情
      //     this.success();
      //   }
      // });
    },
    async openDiagram(xml) {
      const result = this.bpmnModeler.importXML(xml);
      console.log(result);
    },
    success() {
      console.log("创建成功");
    },

    // 下一步
    handleNextStep() {
      switch (this.step) {
        case 0:
          this.$refs.form1.validate((valid, done) => {
            // 这个valid表示的是验证是否通过输出的是一个布尔值类型
            // done 表示的是验证未通过的数据，返回值是一个对象
            if (valid) {
              const { formType, formKey, exFormKey, column } = this.step1.form;
              if (formType == 1) {
                // 内置表单
                this.process.formKey = formKey;
                //调用方法：this.$set( target, key, value )
                //              target：要更改的数据源(可以是对象或者数组)
                //              key：要更改的具体数据
                //              value ：重新赋的值
                console.log(this.option);
                this.$set(this.step2.option, "form", this.option);
                console.log("step2");
                console.log(this.step2.option);
                this.init();
              } else if (formType == 2) {
                // 外置表单
                this.process.formKey = "wf_ex_" + exFormKey;
                this.$set(this.step2.option, "exForm", {
                  exFormKey,
                  column,
                });
              } else if (formType == 3) {
                // 独立表单
                this.$set(this.step2.option, "indepForm", {
                  mode: "indep",
                  list: this.formList,
                });
              }
              this.step++;
              console.log(this.step);
              done();
            }
          });
          break;
        case 1:
          if (this.step1.form.formType == 3) {
            // 节点独立表单
            const registry = this.$refs.bpmn2.getElementRegistry().getAll();
            let errorList = [];
            registry.forEach((ele) => {
              this.validateIndepFormOption(ele, errorList);
            });
            if (errorList.length > 0) {
              errorList = new Set(errorList);
              let message = "";
              errorList.forEach((err) => {
                const { businessObject } = err;
                const { id, name } = businessObject;
                message += `<p>${name || id} 节点未正确配置表单</p>`;
              });
              this.$message({
                type: "error",
                dangerouslyUseHTMLString: true,
                message,
              });
              return;
            }
          }
          this.$refs.bpmn2.getData("xml").then((data) => {
            this.$set(this.step2.option, "xml", data);
            this.$set(this.step3.option, "xml", data);
            this.process.xml = data;
            this.step++;
          });
          break;
      }
    },
    handleFullScreen() {
      fullscreenToggel();
      this.$store.commit("SET_COLLAPSE");
    },
    getFormList() {
      formList(this.queryParams).then((res) => {
        console.log("hahahh");
        console.log(res);
        this.formList = res.rows;
        // 找到this.step1.option.group下prop为formKey
        this.findObject(this.step1.option.group, "formKey").dicData =
          this.formList; // 拷贝
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.wf-design {
  .avue-group__title {
    margin-top: -48px;
    margin-left: 20px;
    font-size: 16px;
    width: 64px;
    height: 50px;
  }
  .el-collapse {
    margin-top: 20px;
  }
  .avue-group__header {
    width: 1620px;
    height: 50px;
    // margin-top: 50px;
  }
}
.canvas {
  width: 100%;
  height: 100%;
}
.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}
</style>
<style>
.el-collapse-item__header {
  margin-top: -5px;
}
</style>
<style scoped lang="scss">
.foot-item {
  position: fixed;
  bottom: 0;
  margin-left: -20px;
  //   // right: 0;
  z-index: 101;
  height: 66px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); // 作用:属性可以设置一个或多个下拉阴影的框  /* x偏移量 | y偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
}
</style>
