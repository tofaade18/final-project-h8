import { createWebHistory, createRouter } from "vue-router";
import home from "../components/Home.vue"
import Forbidden from "../components/forbidden.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
const Profile = () => import("../components/Profile.vue")
const add = ()=> import("../components/addlayanan.vue")
import layananU from "../components/layananlist(user).vue"
const listu = () => import("../components/layanan(user).vue")
const LA = () => import("../components/layananP.vue")
const edit = () => import ("../components/editlayanan.vue")
const deletel = () => import ("../components/deletelayanan.vue")

const routes = [
  {
    path: "/home",
    component: layananU,
  },
  {
      path: "/details/:id",
      name: "layanan-details-",
      component: listu,
    },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/forbidden",
    name: "forbidden",
    component: Forbidden,
    meta: { requiresSpecialAccess: true },
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/profile/",
    name: "profile",
    component: Profile,
  },
  {
    path: "/admin",
    name: "admin",
    children: [
      {
    path: "/admin/add",
    name: "user",
    component: add,
  },
  {
    path: "/admin/edit",
    component: edit,
  },
  {
    path: "/admin/delete",
    component: deletel,
  },
  {
      path: "/admin/home/:id",
      name: "layanan-details",
      component: () => import("../components/layanan.vue")
    },
    ]
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // Check if the route requires special access
  if (to.matched.some(record => record.meta.requiresSpecialAccess)) {
    // Check if the specialAccess parameter is present
    if (!to.params.specialAccess) {
      // Redirect to the forbidden page if special access is required but not present
      next();
    } else {
      next({ path: '/forbidden' });
    }
  } else {
    next();
  }
});

export default router;