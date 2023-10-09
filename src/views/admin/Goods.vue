<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <el-button type="primary" @click="goodsDialogVisible = true;action='save'" size="medium">添加商品</el-button>
        </div></el-col>
      </el-row>
      <el-row>
        <el-table
            :data="goodsList"
            style="width: 90%;margin: 10px 0"
            border>
          <el-table-column
              prop="name"
              label="商品名称">
          </el-table-column>
          <el-table-column
              prop="price"
              label="商品价格">
          </el-table-column>
          <el-table-column
              prop="picture"
              label="商品图片">
            <template v-slot="scope">
              <img class="picture" :src="scope.row.picture" alt=""/>
            </template>
          </el-table-column>
          <el-table-column
              prop="category"
              label="商品类别">
          </el-table-column>
          <el-table-column
              label="操作">
            <template v-slot="scope">
              <el-button type="primary" size="small" icon="el-icon-edit"
                         @click="readGoods(scope.row.id)">编辑</el-button>
              <el-button type="warning" size="small" icon="el-icon-delete"
                         @click="delGoods(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageInfo.page"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="5"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </el-row>
    </el-card>
    <el-dialog title="商品信息" :visible.sync="goodsDialogVisible" width="50%" @close="goodsDialogClose">
      <el-form :model="goodsForm" ref="goodsFormRef">
        <el-form-item label="商品名称" prop="name" label-width="100px">
          <el-input v-model="goodsForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price" label-width="100px">
          <el-input v-model="goodsForm.price"></el-input>
        </el-form-item>
        <el-form-item label="商品类别" prop="category" label-width="100px">
          <el-select v-model="goodsForm.category" placeholder="请选择">
            <el-option v-for="category in categories" :label="category" :value="category"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述" prop="description" label-width="100px">
          <el-input v-model="goodsForm.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="picture" label-width="100px">
          <el-upload
              action="http://127.0.0.1:8000/admin/goods/upload"
              name = "image"
              list-type="picture-card"
              :limit="1"
              :on-preview="handlePictureCardPreview"
              :on-success="handleAvatarSuccess">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" :modal="false">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateGoods">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Goods",
  data(){
    return{
      goodsList:[],
      total:0,
      pageInfo: {
        page: 1,
        pageSize: 5,
      },
      goodsDialogVisible: false,
      action:'',
      goodsForm:{
        id:'',
        name:'',
        price:'',
        category:'',
        picture:'',
        description:'',
      },
      dialogImageUrl: '',
      dialogVisible: false,
      categories:['美味早餐', '奶茶果汁', '汉堡披萨', '简餐便当'],
    }
  },
  mounted() {
    this.getGoodsList();
  },
  methods: {
    async updateGoods(){
      const {data: res} = await this.$http.post("/admin/goods/" + this.action, this.goodsForm);
      if (res.code != 200) {
        this.$message.error(res.msg);
      } else {
        this.$message.success(res.msg);
        this.goodsDialogVisible = false;
        await this.getGoodsList();
      }
    },
    async readGoods(id) {
      const {data: res} = await this.$http.get("/admin/goods/read", {params: {"id":id}});
      if(res.code!=200){
        this.$message.error(res.msg);
      }else {
        this.goodsDialogVisible = true;
        this.action = 'update';
        this.goodsForm = res.data;

      }
    },

    async delGoods(id) {
      const confirmRes = await this.$confirm('此操作不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err;
      })
      if(confirmRes=="cancel")
        return
      const {data:res} = await this.$http.get("/admin/goods/delete",{params:{"id":id}});
      if(res.code!=200){
        this.$message.error(res.msg);
      }else {
        this.$message.success(res.msg);
        await this.getGoodsList();
      }
    },
    async getGoodsList() {
      const {data: res} = await this.$http.get("/admin/goods/index", {params: this.pageInfo});
      this.goodsList = res.data.data;
      this.total = res.data.total;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file) {
      this.goodsForm.picture = res.data;
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pagesize = pageSize;
      this.getGoodsList();
    },
    handleCurrentChange(page) {
      this.pageInfo.page = page;
      this.getGoodsList();
    },
    goodsDialogClose(){
      // this.$refs.goodsFormRef.resetFields()
      this.goodsForm={}
    },

  },

}
</script>

<style scoped>
  .el-card{
    margin-top: 12px;
    box-shadow: 0 0 5px #ddd;
  }
  .picture{
    width: 50px;
    height: 50px;
  }
</style>