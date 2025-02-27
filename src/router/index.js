import { createRouter, createWebHistory } from "vue-router"
import Dashboard from "../views/Dashboard.vue"
import UserManagement from "../views/UserManagement.vue"
import ContentManagement from "../views/ContentManagement.vue"
import TestManagement from "../views/TestManagement.vue"

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/users",
    name: "Users",
    component: UserManagement,
  },
  {
    path: "/content",
    name: "Content",
    component: ContentManagement,
  },
  {
    path: "/tests",
    name: "Tests",
    component: TestManagement,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

