<template>
  <basic-container>
    <avue-crud
      :data="data"
      :option="option"
      :page.sync="page"
      v-model="form"
      @refresh-change="onLoad(page, query)"
      @on-load="onLoad"
    ></avue-crud>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import { sendList as getList } from "@/api/plugin/workflow/process";
// import exForm from "../mixins/ex-form";
export default {
  // mixins: [exForm],

  data() {
    return {
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      data: [],
      option: {
        size: "mini",
        height: "auto",
        calcHeight: 30,
        tip: false,
        border: true,
        selection: true,
        dialogType: "drawer",
        addBtn: false,
        editBtn: false,
        delBtn: false,
        align: "center",
        searchMenuSpan: 6,
        searchSize: "mini",
        searchIndex: 3,
        searchIcon: true,
        column: [
          {
            label: "流程名称",
            prop: "processDefinitionName",
            search: true,
            overHidden: true
          },
          {
            label: "流程标识",
            prop: "processDefinitionKey",
            search: true,
            overHidden: true
          },
          {
            label: "流水号",
            prop: "serialNumber",
            bind: "variables.serialNumber",
            search: true,
            overHidden: true
          },
          {
            label: "流程分类",
            row: true,
            type: "tree",
            dicUrl: "/dev-api/blade/design/category/tree",
            props: {
              label: "name",
              value: "id"
            },
            prop: "category",
            search: true
          },
          {
            label: "当前节点",
            prop: "taskName"
          },
          {
            label: "申请时间",
            prop: "createTime",
            type: "datetime",
            format: "yyyy-MM-dd HH:mm",
            width: 165
          },
          {
            label: "流程状态",
            prop: "processIsFinished",
            dicData: [
              {
                label: "进行中",
                value: "unfinished"
              },
              {
                label: "已完成",
                value: "finished"
              },
              {
                label: "已终结",
                value: "terminate"
              },
              {
                label: "已撤销",
                value: "withdraw"
              },
              {
                label: "已撤回",
                value: "recall"
              },
              {
                label: "被驳回",
                value: "reject"
              },
              {
                label: "已删除",
                value: "deleted"
              }
            ],
            type: "select",
            search: true
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.deployment_add, false),
        viewBtn: this.vaildData(this.permission.deployment_view, false),
        delBtn: this.vaildData(this.permission.deployment_delete, false),
        editBtn: this.vaildData(this.permission.deployment_edit, false)
      };
    }
    // ids() {
    //   let ids = [];
    //   this.selectionList.forEach(ele => {
    //     ids.push(ele.id);
    //   });
    //   return ids.join(",");
    // }
  },
  methods: {
    onLoad(page, params = {}) {
      this.loading = true;
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
      });
    }
  }
};
</script>
