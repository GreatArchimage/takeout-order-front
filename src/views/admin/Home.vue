<template>
  <el-container>
    <el-aside :width="isCollapse?'auto':'180px'">
      <el-menu
          default-active="/goods"
          background-color="#272727"
          text-color="#fff"
          :collapse="isCollapse"
          router
          active-text-color="#ffd04b">
        <h3>{{isCollapse ? '后台':'后台管理系统'}}</h3>
        <el-menu-item index="/goods">
          <i class="el-icon-goods"></i>
          <span slot="title">商品管理</span>
        </el-menu-item>
        <el-menu-item index="/orders">
          <i class="el-icon-document-copy"></i>
          <span slot="title">订单管理</span>
        </el-menu-item>
        <el-menu-item index="/customer">
          <i class="el-icon-user-solid"></i>
          <span slot="title">顾客管理</span>
        </el-menu-item>
        <el-menu-item index="/staff">
          <i class="el-icon-s-management"></i>
          <span slot="title">人员管理</span>
        </el-menu-item>
      </el-menu>

    </el-aside>

    <el-container>
      <el-header>
        <div>
          <el-button icon="el-icon-menu" size="medium" @click="handleMenu"></el-button>
        </div>
        <div>
          <span style="margin-right: 10px">你好，{{adminName}}</span>
          <el-button type="info" size="small" @click="logout()">退出</el-button>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data(){
    return{
      isCollapse:false,
      adminName:''
    }
  },
  mounted() {
    this.adminName=JSON.parse(sessionStorage.getItem('admin')).username
  },
  methods:{
    logout(){
      sessionStorage.removeItem('admin')
      this.$router.push('/login');
    },
    handleMenu(){
      this.isCollapse=!this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>

.el-main{
  background-color: #efefef;
}
.el-header{
  height: 70px!important;
  background-color: #272727;
  color: #efefef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-menu{
  height: 100vh;
  border-right: none;
  text-align: center;
  h3{
    line-height: 70px;
    color: #fff;
    text-align: center;
  }
}

</style>