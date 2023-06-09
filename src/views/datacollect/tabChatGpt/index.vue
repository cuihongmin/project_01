<template>
  
 <div> 
    <div>
       <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
    <el-tab-pane
    :key="item.name"
    v-for="(item, index) in editableTabs"
    :class="{ active: activeTab === index }"
    :label="item.title"
    :name="item.name"
  >
    {{item.content}}
    </el-tab-pane>
  </el-tabs> 
    </div>
   
  <!-- <div> -->
    <!-- <div class="tab-bar" ref="tabContainer" @mousemove="handleMou" @mouseleave="reset">  -->
  <div class="tab-bar" ref="tabContainer"> 
    <ul>
      <li v-for="(tab, index) in tabs" :key="index" :class="{ active: activeTab === index }"  @click="onTabClick(index)"  @edit="handleTabsEdit">{{ tab.title }}</li>
    </ul>
  </div>
  <div class="tab-content">
      <div v-for="(tab, index) in tabs" :key="index" v-show="activeTab === index">{{ tab.content }}</div>
  </div>
  </div>
   
  <!-- </div> -->
 

</template>

<script>
export default {
  data() {
    return {
      editableTabsValue: '2',
      editableTabs: [{
          title: 'Tab 1',
          name: '1',
          content: 'Tab 1 content'
        }, {
          title: 'Tab 2',
          name: '2',
          content: 'Tab 2 content'
        }],
      tabIndex: 2,
      tabs: [
        { title: 'Tab 1', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid e' },
        { title: 'Tab 2', content: '我是tab2!' },
        { title: 'Tab 3', content: '我是tab3' },
        { title: 'Tab 1', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid e' },
        { title: 'Tab 2', content: '我是tab2!' },
        { title: 'Tab 3', content: '我是tab3' },
        { title: 'Tab 1', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid e' },
        { title: 'Tab 2', content: '我是tab2!' },
        { title: 'Tab 3', content: '我是tab3' },
        { title: 'Tab 1', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid e' },
        { title: 'Tab 2', content: '我是tab2!' },
        { title: 'Tab 3', content: '我是tab3' },
        { title: 'Tab 1', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid e' },
        { title: 'Tab 2', content: '我是tab2!' },
        { title: 'Tab 3', content: '我是tab3' },
        { title: 'Tab 1', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid e' },
        { title: 'Tab 2', content: '我是tab2!' },
        { title: 'Tab 3', content: '我是tab3' },
        { title: 'Tab 1', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid e' },
        { title: 'Tab 2', content: '我是tab2!' },
        { title: 'Tab 3', content: '我是tab3' },
        { title: 'Tab 1', content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid e' },
        { title: 'Tab 2', content: '我是tab2!' },
        { title: 'Tab 3', content: '我是tab3' }
      ],
      // tabs: ["Tab 1", "Tab 2", "Tab 3", "Tab 4", "Tab 5", "Tab 2", "Tab 3", "Tab 4", "Tab 5", "Tab 3", "Tab 4", "Tab 5", "Tab 2", "Tab 3", "Tab 4", "Tab 5", "Tab 3", "Tab 4", "Tab 5", "Tab 2", "Tab 3", "Tab 4", "Tab 5", "Tab 3", "Tab 4", "Tab 5", "Tab 2", "Tab 3", "Tab 4", "Tab 5"], // 标签页名称
      activeTab: 0, // 当前活动标签页的索引
      containerWidth: 0, // 标签容器的宽度
      tabWidth: 0, // 单个标签页的宽度
      isDragging: false, // 标识鼠标是否在标签上移动
      dragStartX: 0, // 拉动开始时的鼠标横坐标
      scrollOffset: 0, // 当前滚动偏移量
    };
  },
  mounted() {
    console.log(this.$refs.tabContainer);
    this.containerWidth = this.$refs.tabContainer.clientWidth;
    this.tabWidth = this.$refs.tabContainer.querySelector("li").clientWidth;
  },
 
  computed: {
    activeTabLeft() {
      return this.activeTab * this.tabWidth - this.scrollOffset;
    },
    activeTabRight() {
      return this.activeTabLeft + this.tabWidth;
    },
  },
  watch: {
    activeTab() {
        console.log("ooo");
      this.scrollToTab();
    },
  },
  methods: {
    onTabClick(index) {
      console.log(index);
      console.log("ooo");
      this.activeTab = index
    },
    handleTabsEdit(targetName, action) {
      console.log("oooo1");
      if (action === 'add') {
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: 'New Tab',
            name: newTabName,
            content: 'New Tab content'
          });
          this.editableTabsValue = newTabName;
        }
        if (action === 'remove') {
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        }
      },
    // handleMou: function (event) {
    //     console.log("ggggg");
    //   if (!this.isDragging) {
    //     this.isDragging = true;
    //     this.dragStartX = event.clientX;
    //   }

    //   const delta = event.clientX - this.dragStartX; // 鼠标在X轴方向上移动的距离
    //   const containerScrollLeft = this.$refs.tabContainer.scrollLeft; // 容器当前的滚动位置
    //   const containerRect = this.$refs.tabContainer.getBoundingClientRect(); // 容器的位置、尺寸信息
    //   const containerLeft = containerRect.left; // 容器相对于浏览器窗口左侧边缘的距离
    //   const containerRight = containerRect.right; // 容器相对于浏览器窗口右侧边缘的距离

    //   // 计算新偏移量，限制在容器的滚动范围内
    //   let newOffset = containerScrollLeft - delta;
    //   if (newOffset < 0) {
    //     newOffset = 0;
    //   } else if (newOffset > this.containerWidth - containerRight + containerLeft) {
    //     newOffset = this.containerWidth - containerRight + containerLeft;
    //   }

    //   this.scrollOffset = newOffset;
    // },
    // reset() {
    //   console.log("kkkk");
    //   this.isDragging = false;
    // },
    scrollToTab() {
      console.log("uuuuu");
      const tabLeft = this.activeTabLeft;
      const tabRight = this.activeTabRight;

      if (tabLeft < 0) {
        // 向左滚动，让选中的标签完全在可视区域内
        this.scrollOffset -= Math.abs(tabLeft);
      } else if (tabRight > this.containerWidth) {
        // 向右滚动，让选中的标签完全在可视区域内
        this.scrollOffset += tabRight - this.containerWidth;
      }
    },
  },
};
</script>

<style scoped>
.tab-bar {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap; /* 防止标签折行 */
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: inline-block;
}

li {
  width: 200px;
  display: inline-block;
  text-align: center;
  padding: 0.5em 1em;
  background-color: #909399;
  border-radius: 5px;
  margin-right: 0.5em;
  cursor: pointer;
  transition: background-color 0.1s ease-out;
}

li.active {
  background-color: #33c3f0;
  color: red;
}
</style>