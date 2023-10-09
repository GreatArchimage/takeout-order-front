<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>顾客管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入要搜索的用户内容" v-model="pageInfo.keywords" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getCustomers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="dialogFormVisible = true;action = 'save';form = {}" size="medium">添加用户</el-button>

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
              <el-form-item label="地址" prop="address">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="updateCustomer">确 定</el-button>
            </div>
          </el-dialog>

        </el-col>
      </el-row>
      <el-row>
        <el-table
            :data="customers"
            stripe
            border
            style="width: 80%">
          <el-table-column
              type="selection"
              width="80">
          </el-table-column>
          <el-table-column
              prop="username"
              label="用户名"
              width="120">
          </el-table-column>
          <el-table-column
              prop="gender"
              label="性别"
              width="80">
          </el-table-column>
          <el-table-column
              prop="phone"
              label="手机号"
              width="160">
          </el-table-column>
          <el-table-column
              prop="address"
              label="地址">
          </el-table-column>
          <el-table-column
              label="操作">
            <template v-slot="scope">
              <el-button type="primary" size="small" icon="el-icon-edit" @click="readCustomer(scope.row.id)">编辑</el-button>
              <el-button type="warning" size="small" icon="el-icon-delete" @click="delCustomer(scope.row.id)">删除</el-button>
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
  name: "Customer",
  data() {
    return {
      customers: [],
      pageInfo: {
        page: 1,
        pageSize: 5,
        keywords: '',
      },
      total: 0,
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
    }
  },
  mounted() {
    this.getCustomers();
  },
  methods: {
    async getCustomers() {
      const {data: res} = await this.$http.get("/admin/customer/index", {params: this.pageInfo});
      this.customers = res.data.data;
      this.total = res.data.total;
    },
    async delCustomer(id) {
      const confirmRes = await this.$confirm('此操作不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err;
      })
      if(confirmRes=="cancel")
        return
      const {data:res} = await this.$http.get("/admin/customer/delete",{params:{"id":id}});
      if(res.code!=200){
        this.$message.error(res.msg);
      }else {
        this.$message.success(res.msg);
        await this.getCustomers();
      }
    },
    async readCustomer(id) {
      const {data: res} = await this.$http.get("/admin/customer/read", {params: {"id":id}});
      if(res.code!=200){
        this.$message.error(res.msg);
      }else {
        this.$message.success(res.msg);
        this.dialogFormVisible = true;
        this.action = 'update';
        this.form = res.data;
      }
    },
    async updateCustomer() {
      await this.$refs.formRef.validate(async v => {
        if (!v)
          return;
        const {data: res} = await this.$http.post("/admin/customer/" + this.action, this.form);
        if (res.code != 200) {
          this.$message.error(res.msg);
        } else {
          this.$message.success(res.msg);
          this.dialogFormVisible = false;
          await this.getCustomers();
        }
      })
    },
    async handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      await this.getCustomers();
    },
    async handleCurrentChange(page) {
      this.pageInfo.page = page;
      await this.getCustomers();
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