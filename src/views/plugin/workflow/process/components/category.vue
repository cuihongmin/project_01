<template>
  <avue-tree
    :option="option"
    :data="data"
    @node-click="handleNodeClick"
  ></avue-tree>
</template>
<script>
import { tree } from "@/api/plugin/workflow/category";

export default {
  name: "wf-category",
  data() {
    return {
      data: [],
      option: {
        size: "mini",
        menu: false,
        addBtn: false,
        props: {
          label: "name",
          value: "id"
        }
      }
    };
  },
  mounted() {
    this.getCategoryList();
  },
  methods: {
    handleNodeClick({ id }) {
      this.$emit("node-click", { id });
    },
    getCategoryList() {
      tree().then(res => {
        const data = res.data.data;
        this.$emit("list-change", this.deepClone(data));

        this.data = data;
        this.data.unshift({ id: "", name: "全部" });
      });
    }
  }
};
</script>

<style></style>
