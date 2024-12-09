<template>
  <a-layout style="min-height: 100vh">

    <a-layout class="content">
      <a-layout-header style="padding: 0;">
        <div class="header headerResp headerBorderBottom" >
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
                  <EmployerMenu/>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <a-menu class="menuBackground" v-model:selectedKeys="selectedKeys" @click="handleClick" theme="light"  mode="horizontal"
                  :style="{ lineHeight: '64px',justifyContent:'end',borderBottom:'0' }" v-if="!isMobile">


            <a-menu-item key="Home" @click="logout('Home')" v-if="isLoggedIn">
              <span class="nav-text">Logout</span>
            </a-menu-item>
          </a-menu>
        </div>


      </a-layout-header>
      <a-layout-content class="bodyMargins" >

        <a-breadcrumb style="margin: 16px 0" class="navMenu">
          <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
          <a-breadcrumb-item v-if="path[0]!=='EmployerDashBoard'">{{path[0]}}</a-breadcrumb-item>

        </a-breadcrumb>



        <a-layout style="position: relative">
          <div class="menuIcon" @click="showDrawer" v-if="!isMobile">
            <unordered-list-outlined />
            <a-drawer
                v-model:open="visible"
                class="custom-class"
                title="Menu"
                placement="left"

            >
              <EmployerMenu/>
            </a-drawer>
          </div>

        <a-layout-sider width="200"
                        class="navMenu"
        >

          <EmployerMenu/>

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
import EmployerMenu from "./EmployerMenu.vue";
import {useRouter} from "vue-router/dist/vue-router";
import {useStore} from "vuex";
import {MenuFoldOutlined, UnorderedListOutlined} from '@ant-design/icons-vue';
import LightLogo from "@/assets/images/6.svg";
import DarkLogo from '@/assets/images/7.svg'
import MobileFooter from './EmployerMobileComponents/Footer.vue'

export default defineComponent({
  components: {
    MenuFoldOutlined,
    EmployerMenu,
    UnorderedListOutlined,
    MobileFooter
  },

  setup() {
    const store = useStore()
    const state = reactive({
      currentTheme: localStorage.getItem("theme"),
      themeVars : {},
      defaultVars:inject('defaultVars'),
      darkModeVars:inject('darkModeVars'),
      logo:LightLogo,
      size: window.innerWidth,

    })
    onMounted(()=>{
      window.addEventListener("resize", deviceWidth);
      window.addEventListener('themeChanged', (event) => {
        state.currentTheme = event.detail.storage;
        if(state.currentTheme === 'dark'){
          state.themeVars = state.darkModeVars
          state.logo = DarkLogo
        }else {
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
    if(state.currentTheme === 'dark'){
      state.themeVars = state.darkModeVars
      state.logo = DarkLogo
    }else {
      state.themeVars = state.defaultVars
      state.logo = LightLogo
    }

    const onCollapse = (collapsed, type) => {
      return type
    };
    const onBreakpoint = broken => {
      return broken
    };
    const router = useRouter()
    const path = computed(() =>{
      let pathString =[]
      pathString.push(router.currentRoute.value.name)
      return pathString
    })
    let active = []
    active.push(path)
    const handleClick = (e)=>{
      router.push({
        name: e.key
      })

    }


    const logout = (e)=>{

      router.push({
        name: e
      })

      store.dispatch('auth/setToken', null);
      store.dispatch('auth/setRefresh', null);
      store.dispatch('auth/setEphToken', null)
      store.dispatch('auth/setProfile', null)
      store.dispatch('auth/setExpiration', null)

    }
    const visible = ref(false);
    const showDrawer = () => {
      visible.value = true;
    };
    return {
      state,
      path,
      selectedKeys: ref(path),
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
.bodyMargins{
  padding: 0 15%;

}
.header{
  position: fixed;
  z-index: 1;
  width: 100%;
  background-color: v-bind(state['themeVars']['headerColor']);
}
.headerResp{
  padding: 0 15%;
}
.menuBackground{
  background-color: v-bind(state['themeVars']['headerColor']);
}
.content{
  background-color: v-bind(state['themeVars']['dashBoard']);
}

.headerBorderBottom{
  border-bottom: v-bind(state['themeVars']['borderBottom'])
}
.navMenu{
  display: block;
}
.menuIcon{
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
  .bodyMargins{
    padding: 0 10%;

  }
  .headerResp{
    padding: 0 10%;
  }

}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {
  .bodyMargins{
    padding: 0 10%;

  }
  .headerResp{
    padding: 0 10%;
  }

}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {
  .bodyMargins{
    padding: 0 10%;

  }
  .headerResp{
    padding: 0 10%;
  }


}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {

  .bodyMargins{
    padding: 0 5%;

  }
  .headerResp{
    padding: 0 5%;
  }

}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {
  .bodyMargins{
    padding: 0 1%;
    height: 100%;
  }
  .navMenu{
    display: none;
  }
  .menuIcon{
    display: block;
  }
  .headerResp{
    padding: 0 5%;
  }


}

/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {
  .headerResp{
    padding: 0 10%;
  }

  .bodyMargins{
    padding: 0 1%;

  }
  .navMenu{
    display: none;
  }
  .menuIcon{
    display: block;
  }


}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .headerResp{
    padding: 0 10%;
  }
  .bodyMargins{
    padding: 0 1%;

  }
  .navMenu{
    display: none;
  }
  .menuIcon{
    display: block;
  }



}

</style>