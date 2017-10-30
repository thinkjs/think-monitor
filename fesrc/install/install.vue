<template>
  <div class="install-ctn">
    <div class="background">

    </div>
    <div class="form-ctn">
      <h1 class="title">Think Monitor</h1>
      <el-form label-position="left" :model="userForm" :rules="rules" ref="userForm" inline size="small">
        <el-form-item label-width="100px" label="管理账号信息"></el-form-item>
        <el-form-item prop="id" label-width="10px" label=" ">
          <el-input placeholder="账号" v-model="userForm.id"></el-input>
        </el-form-item>
        <el-form-item prop="psw" label-width="10px" label=" ">
          <el-input placeholder="密码" type="password" v-model="userForm.psw"></el-input>
        </el-form-item>
      </el-form>
      <el-form label-position="left" ref="mysqlForm" :rules="rules" :model="mysqlForm" inline size="small">
        <el-form-item label-width="100px" label="MySQL信息"></el-form-item>
        <el-form-item prop="mysqlId" label-width="10px" label=" ">
          <el-input placeholder="账号" v-model="mysqlForm.mysqlId"></el-input>
        </el-form-item>
        <el-form-item prop="mysqlPsw" label-width="10px" label=" ">
          <el-input placeholder="密码" type="password" v-model="mysqlForm.mysqlPsw"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label=" "></el-form-item>
        <el-form-item prop="mysqlIp" label-width="10px" label=" ">
          <el-input placeholder="主机" v-model="mysqlForm.mysqlIp"></el-input>
        </el-form-item>
        <el-form-item prop="mysqlPort" label-width="10px" label=" ">
          <el-input placeholder="端口" v-model="mysqlForm.mysqlPort"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label=" "></el-form-item>
        <el-form-item prop="mysqlName" label-width="10px" label=" ">
          <el-input placeholder="数据库名" v-model="mysqlForm.mysqlName"></el-input>
        </el-form-item>
      </el-form>
      <el-form label-position="left" ref="influxForm" :rules="rules" :model="influxForm" inline label-width="120px" size="small">
        <el-form-item label-width="100px" label="influxDB信息"></el-form-item>
        <el-form-item prop="influxIp" label-width="10px" label=" ">
          <el-input placeholder="主机" v-model="influxForm.influxIp"></el-input>
        </el-form-item>
        <el-form-item prop="influxPort" label-width="10px" label=" ">
          <el-input placeholder="端口" v-model="influxForm.influxPort"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-ctn">
        <el-button type="primary" @click="onSubmit" size="small">开始配置MySQL</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userForm: {
        id: "",
        psw: ""
      },
      mysqlForm: {
        mysqlId: "",
        mysqlPsw: "",
        mysqlIp: "",
        mysqlPort: "",
        mysqlName: ""
      },
      influxForm: {
        influxIp: "",
        influxPort: ""
      },
      rules: {
        id: [{ required: true, message: "请输入管理账号", trigger: "blur" }],
        psw: [{ required: true, message: "请输入密码", trigger: "blur" }],
        mysqlId: [{ required: true, message: "请输入数据库账号", trigger: "blur" }],
        mysqlPsw: [{ required: true, message: "请输入数据库密码", trigger: "blur" }],
        mysqlIp: [{ required: true, message: "请输入数据库主机地址", trigger: "blur" }],
        mysqlPort: [
          { required: true, message: "请输入数据库主机端口号", trigger: "blur" }
        ],
        mysqlName: [{ required: true, message: "请输入数据库名", trigger: "blur" }],
        influxIp: [{ required: true, message: "请填写主机地址", trigger: "blur" }],
        influxPort: [{ required: true, message: "请填写主机端口号", trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {
      const that = this;
      ["userForm", "mysqlForm", "influxForm"].forEach(formName => {
        that.$refs[formName].validate(valid => {
          if (valid) {
            console.log("submit!");
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      });
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
    height: 450px;
    box-sizing: border-box;
    padding: 20px 30px;
    border: 1px solid #c9c9c9;
    border-radius: 5px;
    background: rgb(255, 255, 255);
    box-shadow: 0 0 20px 1px rgb(255, 255, 255);
  }
  .btn-ctn {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
