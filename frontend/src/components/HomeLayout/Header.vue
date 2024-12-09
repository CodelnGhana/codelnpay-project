<template>

  <a-layout-header style="padding: 0;" >
    <div class="header headerResp headerBorderBottom" >
      <div class="logo">

        <router-link to="/">
          <img alt="logo" :src="state.logo" class="logoImage" style="width: 100%;">
        </router-link>
      </div>


      <a-menu

          class="menuBackground"


          mode="horizontal"
          :style="{ lineHeight: '64px',justifyContent:'end' }"
          @click="handleClick"

      >
        <a-menu-item key="Pricing">Pricing</a-menu-item>
        <a-menu-item key="EmployerDashBoard" v-if="isLoggedIn && isEmployer ">Dashboard</a-menu-item>
        <a-menu-item key="DashBoard" v-if="isLoggedIn && !isEmployer ">Dashboard</a-menu-item>
        <a-menu-item key="Login" v-if="!isLoggedIn">Login</a-menu-item>
        <a-menu-item @click="logout('Home')" key="Home" v-if="isLoggedIn">Logout</a-menu-item>


      </a-menu>

    </div>
  </a-layout-header>

</template>

<script>
import {computed, defineComponent, inject, onMounted, reactive, watch} from 'vue';
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import {BgColorsOutlined} from "@ant-design/icons-vue";
import LightLogo from '@/assets/images/6.svg'
import DarkLogo from '@/assets/images/7.svg'

export default defineComponent({
  components: {
    BgColorsOutlined
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const handleClick = (e) => {
      router.push({
        name: e.key
      })
    }
    watch(() => (store.getters["auth/isLoggedIn"]), (newValues) => {
      if (newValues === false) {
        logout('Home')
      }
    });

    const state = reactive({
      currentTheme: localStorage.getItem("theme"),
      themeVars : {},
      defaultVars:inject('defaultVars'),
      darkModeVars:inject('darkModeVars'),
      logo:LightLogo
    })
    onMounted(()=>{
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
    if(state.currentTheme === 'dark'){
      state.themeVars = state.darkModeVars
      state.logo = DarkLogo
    }else {
      state.themeVars = state.defaultVars
      state.logo = LightLogo
    }
    const logout = (e) => {
      router.push({
        name: e
      })
      store.dispatch('auth/setToken', null);
      store.dispatch('auth/setRefresh', null);
      store.dispatch('auth/setEphToken', null)
      store.dispatch('auth/setProfile', null)
      store.dispatch('auth/setExpiration', null)

    }
    return {
      state,
      handleClick,
      logout,
      isLoggedIn: computed(() => store.getters["auth/isLoggedIn"]),
      isEmployer: computed(() => store.getters["auth/isEmployer"])
    }
  }


});
</script>

<style scoped>
.logo {
  width: 120px;
  height: 31px;

  margin: 0 24px 16px 0;
  float: left;
}
.logoImage{
  filter: v-bind(state['themeVars']['filter']);
}

.headerBorderBottom{
  border-bottom: v-bind(state['themeVars']['borderBottom'])
}

.header {
  position: fixed;
  z-index: 2;
  width: 100%;
  background-color: v-bind(state['themeVars']['headerColor']);
}
.menuBackground{
  background-color: v-bind(state['themeVars']['headerColor']);
}
.headerResp {
  padding: 0 15%;
}

/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {

}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {
  .headerResp {
    padding: 0 10%;
  }


}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {
  .headerResp {
    padding: 0 10%;
  }


}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {
  .headerResp {
    padding: 0 8%;
  }


}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {

  .headerResp {
    padding: 0 5%;
  }

}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {
  .headerResp {
    padding: 0 5%;
  }

}

/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {
  .headerResp {
    padding: 0 10%;
  }


}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .headerResp {
    padding: 0 10%;
  }


}

</style>