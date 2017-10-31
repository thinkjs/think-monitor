<template>
  <div class="monitor">
    <el-menu
      :default-active="pageNow"
      class="menu"
      router
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="isCollapse">
      <h3 class="title">
        Think monitor
        <i class="el-icon-more-outline btn-more" @click="toggleMenu"></i>
      </h3>
      <el-menu-item index="/">
        <i class="el-icon-u iconfont">&#xe600;</i>
        <span slot="title">项目管理</span>
      </el-menu-item>
      <el-menu-item index="users">
        <i class="el-icon-p iconfont">&#xe926;</i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-menu-item index="dashboard">
        <i class="el-icon-d iconfont">&#xe7c2;</i>
        <span slot="title">仪表盘</span>
      </el-menu-item>
    </el-menu>
    <div class="main">
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      isCollapse: true
    };
  },
  computed: {
    pageNow() {
      let hash = String.prototype.slice.call(location.hash, 2);
      return hash ? hash : '/';
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    toggleMenu() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>

<style lang="scss">
body {
  margin: 0;
}

@font-face {
  font-family: "iconfont"; /* project id 459437 */
  src: url("//at.alicdn.com/t/font_459437_ge3beh3gatoz85mi.eot");
  src: url("//at.alicdn.com/t/font_459437_ge3beh3gatoz85mi.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_459437_ge3beh3gatoz85mi.woff") format("woff"),
    url("//at.alicdn.com/t/font_459437_ge3beh3gatoz85mi.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_459437_ge3beh3gatoz85mi.svg#iconfont")
      format("svg");
}
.iconfont {
  font-family: "iconfont" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
.monitor {
  .iconfont {
    font-size: 20px;
  }
  .menu {
    float: left;
    height: 100vh;
  }
  .menu:not(.el-menu--collapse) {
    width: 300px;
    .title {
      margin-left: 30px;
    }
  }
  .title {
    height: 56px;
    line-height: 56px;
    margin: 0;
    font-size: 24px;
    font-weight: 200;
    color: #fff;
    margin-left: -300px;
  }
  .btn-more {
    float: right;
    width: 64px;
    height: 56px;
    line-height: 56px;
    text-align: center;
    color: #878d99;
    cursor: pointer;
  }
  .main {
    height: 100vh;
    overflow: hidden;
  }
  .content{
    height: 100%;
    overflow: scroll;
  }
}
</style>
