import Vue from 'vue'
import VueRouter from 'vue-router'

import adminRouter from "@/router/admin"
import userRouter from "@/router/user"
import Login from "@/views/Login";


Vue.use(VueRouter)

const indexRouter = [
  {
    path:'/login',
    name:'login',
    component:Login
  }
]

const routes = adminRouter.concat(userRouter).concat(indexRouter)


const router = new VueRouter({
  routes
})



export default router
