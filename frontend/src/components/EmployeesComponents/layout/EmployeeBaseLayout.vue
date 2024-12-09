<template>
  <a-layout class='layoutDimensions'>

    <a-layout>
      <a-layout-header style="padding: 0;">
        <div class="header headerRespEmp headerBorderBottom">
          <div class="logo">

            <router-link to="/">
              <img alt="logo" :src="state.logo" style="width: 100%;">
            </router-link>

          </div>
          <div v-if="isMobile" style="float: right">


            <a-dropdown>
              <MenuFoldOutlined />
              <template #overlay>
                <a-menu>
                  <EmployeeMenu/>
                </a-menu>
              </template>
            </a-dropdown>
          </div>

          <a-menu class="menuBackground" v-model:selectedKeys="selectedKeys" @click="handleClick" mode="horizontal"
                  :style="{ lineHeight: '64px',justifyContent:'end',borderBottom:'0' }" v-if="!isMobile">


            <a-menu-item key="Home" @click="logout('Home')" v-if="isLoggedIn">
              <span class="nav-text">Logout</span>
            </a-menu-item>
          </a-menu>
        </div>


      </a-layout-header>

      <a-layout-content class="bodyMargins content">

        <a-breadcrumb style="margin: 16px 0" class="navMenu" v-if="!isMobile">
          <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
          <a-breadcrumb-item v-if="path[0]!=='DashBoard'">{{ path[0] }}</a-breadcrumb-item>

        </a-breadcrumb>
        <a-layout style="position: relative">

          <div class="menuIconEmployee" @click="showDrawer"  v-if="!isMobile">

            <unordered-list-outlined/>
            <a-drawer
                v-model:open="visible"
                class="custom-class"
                title="Menu"
                placement="left"

            >
              <EmployeeMenu/>
            </a-drawer>
          </div>


          <a-layout-sider width="200" class="navMenu">
            <EmployeeMenu/>
          </a-layout-sider>

          <a-layout-content :style="{ minHeight: '280px' }" class="content">
            <slot/>
          </a-layout-content>

        </a-layout>

      </a-layout-content>


      <MobileFooter v-if="isMobile"/>


      <a-layout-footer v-if="!isMobile" style="text-align: center">
        Codeln Pay
      </a-layout-footer>


    </a-layout>
  </a-layout>
</template>
<script>

import {computed, defineComponent, inject, onMounted, onUnmounted, reactive, ref,} from 'vue';
import {useRouter} from "vue-router/dist/vue-router";
import {useStore} from "vuex";
import {UnorderedListOutlined,MenuFoldOutlined} from '@ant-design/icons-vue';
import EmployeeMenu from "./EmployeeMenu.vue";
import moment from "moment/moment";
import LightLogo from "@/assets/images/6.svg";
import DarkLogo from '@/assets/images/7.svg'

import MobileFooter from './mobileComponents/Footer.vue'

export default defineComponent({
  components: {
    UnorderedListOutlined,
    EmployeeMenu,
    MobileFooter,
    MenuFoldOutlined
  },

  setup() {
    const store = useStore();
    const onCollapse = (collapsed, type) => {
      return type
    };
    const onBreakpoint = broken => {
      return broken
    };
    const router = useRouter();
    const path = computed(() => {
      let pathString = [];
      pathString.push(router.currentRoute.value.name);
      return pathString;
    });
    let active = [];
    active.push(path);
    const handleClick = (e) => {
      router.push({
        name: e.key
      });

    };
    const currentTime = () => {
      state.time = moment();
      setTimeout(currentTime, 1000);

    };

    const state = reactive({
      currentTheme: localStorage.getItem("theme"),
      themeVars: {},
      defaultVars: inject('defaultVars'),
      darkModeVars: inject('darkModeVars'),
      logo: LightLogo,
      size: window.innerWidth,

    })
    onMounted(() => {
      window.addEventListener("resize", deviceWidth);
      window.addEventListener('themeChanged', (event) => {
        state.currentTheme = event.detail.storage;
        if (state.currentTheme === 'dark') {
          state.themeVars = state.darkModeVars
          state.logo = DarkLogo
        } else {
          state.themeVars = state.defaultVars
          state.logo = LightLogo
        }
      });
    })
    onUnmounted(() => {
      window.removeEventListener("resize", deviceWidth);
    });
    const deviceWidth = (e) => {
      state.size = e.srcElement.innerWidth;
    };
    const isMobile = computed(() => {
      return state.size <= 425;

    });
    if (state.currentTheme === 'dark') {
      state.themeVars = state.darkModeVars
      state.logo = DarkLogo
    } else {
      state.themeVars = state.defaultVars
      state.logo = LightLogo
    }

    const logout = (e) => {

      router.push({
        name: e
      });

      store.dispatch('auth/setToken', null);
      store.dispatch('auth/setRefresh', null);
      store.dispatch('auth/setEphToken', null);
      store.dispatch('auth/setProfile', null);
      store.dispatch('auth/setExpiration', null);

    };
    const visible = ref(false);
    const showDrawer = () => {
      visible.value = true;

    };
    return {
      state,
      path,
      selectedKeysMenu: ref(path),
      selectedKeys: ref(['Dashboard']),
      onCollapse,
      onBreakpoint,
      handleClick,
      collapsed: ref(false),
      logout,
      isLoggedIn: computed(() => store.getters["auth/isLoggedIn"]),
      visible,
      showDrawer,
      isMobile
    };
  },
});
</script>
<style scoped>
.logo {
  width: 120px;
  height: 31px;
  margin: 0 24px 16px 0;
  float: left;
}

.bodyMargins {
  padding: 0 15%;

}

.header {
  position: fixed;
  z-index: 1;
  width: 100%;
  background-color: v-bind(state ['themeVars'] ['headerColor']);

}
.layoutDimensions{
  min-height: 100vh;
}

.mobileComponent {
  display: none;
}

.menuBackground {
  background-color: v-bind(state ['themeVars'] ['headerColor']);
}

.content {
  background-color: v-bind(state ['themeVars'] ['dashBoard']);
}

.headerRespEmp {
  padding: 0 15%;
}

.headerBorderBottom {
  border-bottom: v-bind(state ['themeVars'] ['borderBottom'])
}

.navMenu {
  display: block;
}

.menuIconEmployee {
  position: fixed;
  top: 105px;
  z-index: 1;
  width: 36px;
  height: 42px;
  color: #fff;
  font-size: 18px;
  line-height: 42px;
  text-align: center;
  background: #001529;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background 0.3s ease;
  display: none;
}

/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {

}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {
  .bodyMargins {
    padding: 0 10%;

  }

  .headerRespEmp {
    padding: 0 10%;
  }


}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {
  .bodyMargins {
    padding: 0 10%;

  }

  .headerRespEmp {
    padding: 0 10%;
  }


}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {
  .bodyMargins {
    padding: 0 10%;

  }

  .headerRespEmp {
    padding: 0 10%;
  }


}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {

  .bodyMargins {
    padding: 0 5%;

  }

  .headerRespEmp {
    padding: 0 5%;
  }

}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {
  .bodyMargins {
    padding: 0 1%;

  }

  .headerRespEmp {
    padding: 0 5%;
  }

  .navMenu {
    display: none;
  }

  .menuIconEmployee {
    display: block;
  }


}

/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {
  .headerRespEmp {
    padding: 0 10%;
  }

  .bodyMargins {
    padding: 0 1%;

  }

  .navMenu {
    display: none;
  }

  .menuIconEmployee {
    display: block;
  }

  .mobileComponent {
    display: block;
  }



}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .headerRespEmp {
    padding: 0 10%;
  }

  .bodyMargins {
    padding: 0 1%;

  }

  .navMenu {
    display: none;
  }

  .menuIconEmployee {
    display: block;
  }

  .mobileComponent {
    display: block;
  }



}

</style>