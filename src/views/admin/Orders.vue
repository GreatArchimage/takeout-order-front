<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-table
            :data="ordersList"
            stripe
            border
            style="width: 100%">
          <el-table-column
              type="selection">
          </el-table-column>
          <el-table-column
              prop="username"
              label="用户名">
          </el-table-column>
          <el-table-column
              prop="phone"
              label="手机号">
          </el-table-column>
          <el-table-column
              prop="goods_name"
              label="商品名称"
              width="160">
          </el-table-column>
          <el-table-column
              prop="num"
              label="商品数量"
              width="80">
          </el-table-column>
          <el-table-column
              prop="total_cost"
              label="总金额"
              width="100">
          </el-table-column>
          <el-table-column
              prop="create_time"
              label="创建时间"
              width="180">
          </el-table-column>
          <el-table-column
              prop="address"
              label="收货地址"
              width="180">
          </el-table-column>
          <el-table-column
              prop="state"
              label="状态"
              width="110">
            <template v-slot="scope">
              <el-select v-model="scope.row.state" placeholder="请选择" @change="updateOrders(scope.row.id,scope.row.state)">
                <el-option
                    v-for="item in states"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
              label="操作"
              width="100">
            <template v-slot="scope">
              <el-button type="warning" size="small" icon="el-icon-delete" @click="delOrders(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageInfo.page"
            :page-sizes="[5,10,20,40]"
            :page-size="5"
            :total="total"
            background
            layout="total,sizes, prev, pager, next,jumper"
        >
        </el-pagination>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Orders",
  data() {
    return {
      ordersList: [],
      states:['待付款','待送达','已完成'],
      // state:'',
      pageInfo: {
        page: 1,
        pageSize: 5,
      },
      total: 0,
    }
  },
  mounted() {
    this.getOrdersList();
  },
  methods: {
    async getOrdersList() {
      const {data: res} = await this.$http.get("/admin/orders/index", {params: this.pageInfo});
      this.ordersList = res.data.data;
      this.total = res.data.total;
    },
    async updateOrders(id,state){
      const {data: res} = await this.$http.get("/admin/orders/update", {params:{id:id,state:state}});
      if(res.code!=200){
        this.$message.error(res.msg);
      }else {
        this.$message.success(res.msg);
        await this.getOrdersList();
      }
    }
    ,
    async delOrders(id) {
      const confirmRes = await this.$confirm('此操作不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err;
      })
      if(confirmRes=="cancel")
        return
      const {data:res} = await this.$http.get("/admin/orders/delete",{params:{"id":id}});
      if(res.code!=200){
        this.$message.error(res.msg);
      }else {
        this.$message.success(res.msg);
        await this.getOrdersList();
      }
    },
    async handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      await this.getOrdersList();
    },
    async handleCurrentChange(page) {
      this.pageInfo.page = page;
      await this.getOrdersList();
    }
  }
}
</script>

<style scoped>
.el-card{
  margin-top: 12px;
  box-shadow: 0 0 5px #ddd;
}
.el-table{
  margin-top: 12px;
}
</style>