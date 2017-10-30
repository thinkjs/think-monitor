<template>
  <div class="install-ctn">
    <div class="background">

    </div>
    <div class="form-ctn">
      <h1 class="title">Think Monitor</h1>
      <el-form ref="form" :model="form" label-width="80px" size="small">
        <el-form-item label="账号">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-ctn">
        <el-button type="primary" @click="onSubmit" size="small">开始配置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>

<style lang="scss">
.install-ctn {
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: url("../assets/img/S5bKt4s.jpg");
  }
  .title {
    color: #666;
    text-align: center;
    font-weight: 300;
  }
  .form-ctn {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 600px;
    height: 500px;
    box-sizing: border-box;
    padding: 20px;
    border: 1px solid #c9c9c9;
    border-radius: 5px;
    background: rgb(255, 255, 255);
    box-shadow: 0 0 20px 1px rgb(255, 255, 255);
  }
  .btn-ctn {
    text-align: center;
  }
}
</style>
