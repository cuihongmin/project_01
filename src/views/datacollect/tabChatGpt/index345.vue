<template>
  <div class="tab-wrapper" @mouseenter="showTabs" @mouseleave="hideTabs">
    <div class="nav-tabs-wrapper">
      <ul class="nav-tabs" :style="{ transform: 'translateY(' + translateY + 'px)' }">
        <li v-for="(tab, index) in tabs" :key="index"
          :class="{ 'active': activeTab === index }" @click="activeTab = index">{{ tab.title }}</li>
      </ul>
    </div>
    <div class="tab-content-wrapper" v-show="showContent" :style="{ transform: 'translateY(' + translateY + 'px)' }">
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
     tabs: [
        { title: 'Tab 1', content: '这里是Tab1的内容' },
        { title: 'Tab 2', content: '这里是Tab2的内容' },
        { title: 'Tab 3', content: '这里是Tab3的内容' }
      ],
      activeTab: 0,
      showContent: false,
      translateY: 0,
      initialY: 0
    }
  },
  methods: {
    showTabs() {
      this.initialY = this.translateY;
      this.showContent = true;
    },
    hideTabs() {
      this.showContent = false;
    }
  },
  mounted() {
    const navTabs = this.$el.querySelector('.nav-tabs');
    let isDragging = false;
    let lastY = 0;

    navTabs.addEventListener('mousedown', (event) => {
      isDragging = true;
      lastY = event.clientY;
      event.preventDefault();
    });

    navTabs.addEventListener('mousemove', (event) => {
      if (!isDragging || !this.showContent) return;
      const y = event.clientY - lastY;
      this.translateY = this.initialY + y;
      event.preventDefault();
    });

    navTabs.addEventListener('mouseup', () => {
      isDragging = false;
      this.initialY = this.translateY;
    });

    navTabs.addEventListener('mouseleave', () => {
      isDragging = false;
      this.initialY = this.translateY;
    });
  }
}
</script>

<style scoped>
.tab-wrapper {
  position: relative;
}
.nav-tabs-wrapper {
  overflow: hidden;
}
.nav-tabs {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  transition: transform 0.2s ease-in-out;
}
.nav-tabs li {
  width: 100%;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #aaa;
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
.tab-content-wrapper {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  border: 1px solid #aaa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 10px;
  transition: transform 0.2s ease-in-out;
}
.tab-content-wrapper > div:not(:first-child) {
  display: none;
}
.tab-content-wrapper > div.active {
  display: block;
}
</style>