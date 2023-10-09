
import Home from "@/views/admin/Home";

import Goods from "@/views/admin/Goods";
import Customer from "@/views/admin/Customer";
import Orders from "@/views/admin/Orders";
import Staff from "@/views/admin/Staff";

const routes = [
    {
        path:'/home',
        name:'home',
        component: Home,
        children:[
            {
                path: '/goods',
                name: 'goods',
                component: Goods
            },
            {
                path: '/customer',
                name: 'customer',
                component: Customer
            },
            {
                path: '/orders',
                name: 'orders',
                component: Orders
            },
            {
                path: '/staff',
                name: 'staff',
                component: Staff,
                beforeEnter: (to, from, next) => {
                    const admin = JSON.parse(sessionStorage.getItem('admin'))
                    if(admin.access!=='1'){
                        next(false)
                    }else{
                        next()
                    }
                }
            },
        ],
        beforeEnter: (to, from, next) => {
            const admin = JSON.parse(sessionStorage.getItem('admin'))
            if(!admin && to.name !== 'login'){
                next({ name:'login' })
            }else{
                next();
            }
        }
    },

]

export default routes