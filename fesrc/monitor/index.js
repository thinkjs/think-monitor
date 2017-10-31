import Vue from "vue";
import VueRouter from "vue-router";
import App from "./monitor.vue";
import * as _components from "./components";
import "element-ui/lib/theme-chalk/index.css";
import { Tooltip, Menu, MenuItem } from "element-ui";

Vue.use(VueRouter);
Vue.component(Tooltip.name, Tooltip);
Vue.component(Menu.name, Menu);
Vue.component(MenuItem.name, MenuItem);

const components = _components.default;

const router = new VueRouter({
  // mode: 'history',
  routes: [
    {
      path: "/",
      component: components.projects
    },
    {
      path: "/users",
      component: components.users
    },
    {
      path: "/dashboard",
      component: components.dashboard
    }
  ]
});

new Vue({
  el: "#app",
  router: router,
  render: h => h(App)
});
