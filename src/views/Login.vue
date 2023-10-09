<template>
<div class="layout">
  <h2>登录</h2>
  <el-form ref="loginRef" :model="loginForm" :rules="loginRules" label-width="100px">
    <el-form-item label="用户名：" prop="username">
      <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username" clearable></el-input>
    </el-form-item>
    <el-form-item label="密码：" prop="password">
      <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password" clearable></el-input>
    </el-form-item>
    <el-form-item label="验证码：" prop="captcha">
      <el-input v-model="loginForm.captcha" style="width: 120px; height: 50px; float: left"></el-input>
      <img id="captcha" @click="captcha" style="width: 120px; height: 50px; float: left" :src="showCaptcha" alt="">
    </el-form-item>
    <el-form-item class="btn">
      <el-button type="primary" @click="login">登录</el-button>
      <el-button type="danger">取消</el-button>
    </el-form-item>
    <el-form-item>
        <el-radio v-model="userType" label="customer">用户登录</el-radio>
        <el-radio v-model="userType" label="admin">管理员登录</el-radio>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  name: "Login",
  data(){
    let checkCaptcha=async (rule,value,callback)=>{
      if(await this.validateCaptcha(value)){
        callback()
      }
      callback(new Error("验证码输入错误"))
    }
    return{
      userType:'customer',
      loginForm:{
        username:'',
        password:'',
        captcha:'',
        captchaKey:''
      },
      showCaptcha:'',
      loginRules:{
        username:[{required:true, message:"请输入账号", trigger:"blur"}],
        password:[{required:true, message:"请输入密码", trigger:"blur"}],
        captcha:[{required:true, message:"请输入验证码", trigger:"blur"},
          {trigger: "blur", validator:checkCaptcha}]
      }
    }
  },
  mounted() {
    this.captcha();
  },
  methods:{
    async login(){
      await this.$refs.loginRef.validate(async v => {
        if (!v) {
          return;
        }
        if (this.userType==='admin') {
          const {data: res} = await this.$http.post('admin/login/index', this.loginForm);
          if (res.code !== 200) {
            return this.$message.error(res.msg);
          }
          this.$message.success(res.msg);
          sessionStorage.setItem('admin',JSON.stringify(res.data))
        } else {
          const {data: res} = await this.$http.post('/index/index/login', this.loginForm);
          if (res.code !== 200) {
            return this.$message.error(res.msg);
          }
          this.$message.success(res.msg);
          sessionStorage.setItem('userId',res.data.id)
        }
        if(this.userType==='admin'){
          await this.$router.push('/home');
        }else {
          await this.$router.push('/user/index');
        }
      });
    },

    async captcha(){
      const {data:res} = await this.$http.get("/index/verify/index");
      this.showCaptcha = res.captcha;
      this.loginForm.captchaKey = res.captchaKey;
    },
    async validateCaptcha(value){
      this.loginForm.captcha= value;
      const {data:res}=await this.$http.get('/index/verify/checkCaptcha',{params:this.loginForm})
      if(res.code!=200){
        return false;
      }
      return true;
    },
  }
}
</script>

<style lang="less" scoped>
.layout{
  width: 380px;
  height: 360px;
  margin: 150px auto;
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 10px 15px;
  box-shadow: 0 0 15px #218BC3;

  h2{
    text-align: center;
    line-height: 60px;
  }
  #captcha{
    border: 1px solid #ccc;
    margin-left: 20px;
  }
  .btn{
    .el-button:last-of-type{
      margin-left: 50px;
    }
  }
}

</style>