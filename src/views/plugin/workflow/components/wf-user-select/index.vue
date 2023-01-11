<template>
  <div>
    <el-input
      v-model="name"
      :size="size"
      suffix-icon="el-icon-user"
      :placeholder="placeholder || '人员选择'"
      readonly
      :disabled="disabled"
      @click.native="handleSelect"
    ></el-input>
    <!-- 人员选择弹窗 -->
    <wf-user-select
      ref="user-select"
      :check-type="checkType"
      :default-checked="value"
      @onConfirm="handleUserSelectConfirm"
    ></wf-user-select>
  </div>
</template>
<script>
import { getUser } from "@/api/system/user";

import WfUserSelect from "../../process/components/user-select.vue";

export default {
  name: "user-select",
  components: { WfUserSelect },
  props: {
    value: [String, Number],
    checkType: {
      // radio单选 checkbox多选
      type: String,
      default: () => {
        return "radio";
      }
    },
    size: {
      type: String,
      default: () => {
        return "small";
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    userUrl: {
      type: String,
      default: () => {
        return "/api/blade-user/search/user";
      }
    },
    change: Function
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          const name = [];
          const checks = (val + "").split(",");
          const asyncList = [];
          checks.forEach(c => {
            asyncList.push(getUser(c));
          });
          Promise.all(asyncList).then(res => {
            res.forEach(r => {
              const data = r.data.data;
              if (data) name.push(data.realName);
            });
            this.$set(this, "name", name.join(","));
          });
        } else this.$set(this, "name", "");
      },
      immediate: true
    }
  },
  data() {
    return {
      name: ""
    };
  },
  methods: {
    handleSelect() {
      console.log("5250520520520");
      console.log(this.readonly);
      console.log(this.disabled);
      if (this.readonly || this.disabled) return;
      else this.$refs["user-select"].visible = true;
    },
    handleUserSelectConfirm(id) {
      this.$emit("input", id);
      if (this.change && typeof this.change == "function")
        this.change({ value: id });
    }
  }
};
</script>
<style lang="scss"></style>
