<template>
  <div class="tab-wrapper">
    <ul class="nav-tabs">
      <li v-for="(tab, index) in tabs" :key="index" :class="{ 'active': activeTab === index }" @click="onTabClick(index)">{{ tab.title }}</li>
    </ul>
    <div class="tab-content">
      <div v-for="(tab, index) in tabs" :key="index" v-show="activeTab === index">{{ tab.content }}</div>
    </div>
  </div>
</template>

<script>
export default {
//   props: {
//     tabs: {
//       type: Array,
//       default: () => [],
//       required: true
//     }
//   },
  data() {
    return {
      activeTab: 0,
       tabs: [
        { title: 'Tab 1', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid e' },
        { title: 'Tab 2', content: '我是tab2!' },
        { title: 'Tab 3', content: '我是tab3' }
      ]
    }
  },
  methods: {
    onTabClick(index) {
        console.log(index);
        console.log("ooo");
      this.activeTab = index
    }
  }
}
</script>

<style scoped>
.tab-wrapper {
  position: relative;
  overflow-x: auto;
  white-space: nowrap; /* 防止标签折行 */
}
.nav-tabs {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}
.nav-tabs li {
  margin-right: 15px;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 3px;
  background-color: #eee;
  color: #333;
  transition: background-color 0.2s ease-in-out;
}
.nav-tabs li:hover {
  background-color: #ddd;
}
.nav-tabs li.active {
  background-color: #333;
  color: #fff;
}
.tab-content {
  display: flex;
  margin-top: 10px;
  flex-wrap: wrap;
}
.tab-content > div {
  display: none;
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #fff;
}
.tab-content > div:first-child {
  display: block;
}
.tab-content > div.active {
  display: block;
}
</style>