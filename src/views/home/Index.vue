<template>
  <el-container>
    <el-header>
      <div class="h-left">
        <span>外卖点餐</span>
      </div>
      <div class="h-right">
        <div v-if="!isLogin">
          <router-link :to="{name:'login'}" style="text-decoration: none">登录</router-link>
          <span @click="dialogFormVisible = true;action = 'register'">注册</span>
        </div>
        <div v-if="isLogin">
          <span>欢迎，</span>
          <span>{{this.user.username}}</span>
        </div>
        <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <img src="@/assets/images/user.jpg" alt="">
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="update" >修改个人信息</el-dropdown-item>
            <el-dropdown-item command="showOrders">我的订单</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="50%">
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="20%">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender" placeholder="请选择">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收货地址" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateCustomer">确 定</el-button>
        </div>
      </el-dialog>
    </el-header>
    <el-main>
      <div class="nav clearfix" >
        <a v-for="(category,index) in categories" :href="`#category${index}`" >
          <i :class="`el-icon-${category.icon}`" ></i>
          {{category.name}}
        </a>
      </div>
      <el-row v-for="(category,index) in categories">
        <el-card class="category" :id="`category${index}`">
          <el-row class="category-top">
            <span>{{ category.name }}</span>
          </el-row>
          <el-row :gutter="20" class="category-content">
            <el-col v-for="goods in goodsOfCategory(category.name)" :span="6">
                <img @click="showGoodsDetail(goods.id)" :src="goods.picture" class="image">
                <div>
                  <p class="goods-name">{{ goods.name }}</p>
                  <p class="goods-description">{{ goods.description }}</p>
                  <el-rate
                      style="display: flex;flex-direction: row;justify-content: center"
                      v-model="rateValue"
                      disabled
                      text-color="#ff9900">
                  </el-rate>
                  <p class="goods-price">&yen;{{ goods.price }}</p>
                </div>
            </el-col>
          </el-row>
        </el-card>
      </el-row>

      <el-dialog
          title="商品详情"
          v-model="goods"
          :visible.sync="goodsDialogVisible"
          width="50%"
          class="goods-dialog">
        <div class="left"><img :src="goods.picture" alt=""></div>

        <div class="right">
          <p class="goods-name">{{goods.name}}</p>
          <p class="goods-price">&yen;{{goods.price}}</p>
          <p class="goods-description">{{goods.description}}</p>

          <p class="num">数量:<el-input-number v-model="orders.num" :min="1" label="数量"></el-input-number></p>
          <p class="total_cost">总金额：<span>{{ orders.num*goods.price }}</span></p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="purchase(user.id,goods.id,goods.price)" round>立即下单</el-button>
          <el-button @click="goodsDialogVisible = false" round>取 消</el-button>

        </span>
      </el-dialog>

      <el-dialog title="我的订单" :visible.sync="ordersDialogTableVisible" width="80%" >
        <el-table :data="ordersList" stripe>
          <el-table-column prop="goods_name" label="商品名称" width="160"></el-table-column>
          <el-table-column prop="num" label="数量" width="80"></el-table-column>
          <el-table-column prop="total_cost" label="总金额" width="80"></el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="address" label="收货地址"></el-table-column>
          <el-table-column prop="state" label="状态" width="80"></el-table-column>
          <el-table-column label="操作" width="180">
            <template v-slot="scope" >
              <div v-if="scope.row.state==='待付款'">
                <el-button type="primary" size="small" @click="payOrders(scope.row.id)">支付</el-button>
                <el-button type="warning" size="small" icon="el-icon-delete" @click="delOrders(scope.row.id)">取消</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
export default {
  name: "Index",
  data(){
    return{

      isLogin:false,
      user:{
        id:'',
        username:'',
        password:'',
        phone: '',
        address:'',
        gender:''
      },
      goodsList:[],
      categories:[
        {
          name:'美味早餐',
          icon:'tableware'
        },
        {
          name:'奶茶果汁',
          icon:'milk-tea'
        },
        {
          name:'汉堡披萨',
          icon:'burger'
        },
        {
          name:'简餐便当',
          icon:'food'
        },
      ],
      goods:{
        id:'',
        name:'',
        price:'',
        description:'',
        picture:''
      },

      action: '',
      dialogFormVisible: false,
      form: {
        id:'',
        username: '',
        password: '',
        phone: '',
        gender: '',
        address:''
      },
      formRules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {pattern:/^[0-9A-Za-z]{4,10}$/,message: '用户名由4-10位数字和字母组成',trigger: 'blur'}
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          {min:4,message: '密码至少为4位',trigger: 'blur'}
        ],
        phone:[
          {required:true,message:'请输入手机号',trigger:'blur'},
          {pattern:/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message: '请输入正确的手机号',trigger: 'blur'}
        ],
        gender:[{required:true,message:'请选择性别',trigger:'blur'}],
        address: [{required:true,measure:'请输入收货地址',trigger:'blur'}]
      },
      goodsDialogVisible:false,

      orders:{
        create_time:new Date().toLocaleString(),
        customer_id:'',
        goods_id:'',
        num:1,
        state:'待付款',
        total_cost: 0
      },
      ordersList:[],
      ordersDialogTableVisible:false,

      rateValue: 5,
    }
  },

  mounted() {
    this.readCustomer(sessionStorage.getItem('userId'))
    this.getGoodsList();
  },
  methods:{
    async getGoodsList() {
      const {data: res} = await this.$http.get("/index/index/getGoods");
      this.goodsList = res.data;
    },

    async readCustomer(id) {
      const {data: res} = await this.$http.get("/index/customer/read", {params: {"id":id}});
      if(res.code!=200){
        this.$message.error(res.msg);
      }else {
        // this.$message.success(res.msg);
        this.user = res.data;
        this.isLogin=true;
      }
    },
    async updateCustomer() {
      await this.$refs.formRef.validate(async v => {
        if (!v)
          return;
        const {data: res} = await this.$http.post("/index/customer/" + this.action, this.form);
        if (res.code != 200) {
          this.$message.error(res.msg);
        } else {
          this.$message.success(res.msg);
          this.dialogFormVisible = false;
        }
      })
    },
    handleCommand(command) {
      switch (command) {
        case 'update':
          this.dialogFormVisible = true;
          this.action = 'update';
          this.form=this.user;
          break;
        case 'showOrders':
          this.ordersDialogTableVisible = true;
          this.getOrdersList();

          break;
        case 'logout':
          sessionStorage.removeItem('userId');
          break;
      }
    },
    async getOrdersList() {
      const {data: res} = await this.$http.get("/index/index/getOrdersList", {params: {"id":this.user.id}});
      this.ordersList = res.data;
    },
    async payOrders(id){
      const {data:res} = await this.$http.post("/index/orders/pay", {'id':id});
      if(res.code!=200){
        this.$message.error(res.msg);
      }else {
        this.$message.success(res.msg);
        await this.getOrdersList();
      }
    },
    async delOrders(id) {
      const confirmRes = await this.$confirm('确定要取消订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err;
      })
      if(confirmRes=="cancel")
        return
      const {data:res} = await this.$http.get("/index/orders/delete",{params:{"id":id}});
      if(res.code!=200){
        this.$message.error(res.msg);
      }else {
        this.$message.success(res.msg);
        await this.getOrdersList();
      }
    },

    async showGoodsDetail(id){
      this.goodsDialogVisible=true;
      const {data: res} = await this.$http.get("/index/goods/read", {params: {"id":id}});
      if(res.code!=200){
        this.$message.error(res.msg);
      }else {
        // this.$message.success(res.msg);
        this.goods = res.data;
      }
    },
    async purchase(customer_id,goods_id,price){
      this.orders.customer_id=customer_id
      this.orders.goods_id=goods_id
      this.orders.total_cost=this.orders.num*price
      const {data: res} = await this.$http.post("/index/goods/purchase", this.orders);
      if(res.code!=200){
        this.$message.error(res.msg);
      }else {
        this.$message.success(res.msg);
      }
      this.goodsDialogVisible =false
    }
  },

  computed:{
    goodsOfCategory(){
      return function (category) {
        return this.goodsList.filter(item => item['category']===category)
      }
    },
  }
}
</script>

<style lang="less" scoped>

.el-header {
  height: 70px;
  padding: 0 20px;
  background-color: #FDF5DE;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .h-left{
    display: flex;
    align-items: center;
  }
  .h-right{
    display: flex;
    align-items: center;

    span,.router-link{
      margin-left: 20px;
      cursor: pointer;
    }
    span:hover{
      color: #66B1FF;
    }
    span > img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }

}
.el-main{
  background-color: #efefef;
  padding: 0;
  .nav {
    text-align: center;
    height: 80px;
    line-height: 80px;
    border-bottom: 1px solid #CCC;
    border-top: 1px solid #ccc;
    background-color: #FFF;

    a {
      display: inline-block;
      text-decoration: none;
      height: 100%;
      padding: 0 20px;
      color: black;
    }
    a:hover {
      background-color: #E4EEFF;
    }
  }

  .category{
    width: 70%;
    margin: 20px auto;
    .category-top{
      padding: 10px 30px;
      border-bottom: 1px solid #ccc;
      span{
        font-size: 20px;
      }
    }
    .category-content{
      padding: 20px 30px;
      .el-col{
        display: flex;
        flex-direction: column;
        align-items: center;

        img{
          width: 100%;
          height: 200px;
        }
        img:hover{
          opacity: 0.7;
          cursor: pointer;
        }
        div{
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;

          .goods-description{
            text-align: center;
            width: 100%;
            font-size: 12px;
            color: #999;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
.goods-dialog{

  .left{
    width: 40%;
    img{
      width: 100%;
      float: left;
    }
  }
  .right{
    display: inline-block;
    padding-left: 20px;
    width: 50%;

    .goods-name{
      font-size: 34px;
      margin-bottom: 10px;
    }
    .goods-price{
      font-size: 24px;
      margin-bottom: 10px;
      color: #A0B37C;
    }
    .goods-description{
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 10px;
      color: #A6A6A9;
    }
    .num{
      font-size: 20px;
      margin-bottom: 5px;
    }
    .total_cost{
      font-size: 20px;
      span{
        color:red;
        font-weight: bold;
      }
    }
  }
}
</style>