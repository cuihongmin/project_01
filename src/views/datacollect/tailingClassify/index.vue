<template>
  <div class="app-container"><imgUpload /></div>
</template>

<script>
import imgUpload from "@/components/ImageUpload/imgUpload";

export default {
  name: "TailingClassify",
  components: {
    imgUpload,
  },
  data() {
    return {
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
      // 尾矿库分类表格数据
      tailingClassifyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {},
  methods: {},
};
</script>
