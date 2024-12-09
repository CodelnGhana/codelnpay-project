<script>


import {RouterView} from 'vue-router'
import {useRouter} from 'vue-router'
import {computed, defineComponent, onMounted, reactive, ref, watch,provide} from "vue";
import {useStore} from "vuex";
import {BgColorsOutlined} from "@ant-design/icons-vue";
import {theme} from 'ant-design-vue';

const {darkAlgorithm} = theme;
const defaultVars = {
  backgroundColor: '#F5F8FF',
  themeColor: '#FFFFFF',
  color: '#15161A',
  border:'1px solid #f0f0f0',
  filter:'none',
  headerColor:'#FFFFFF',
  altColor:'#F1F4FF',
  borderBottom:'1px solid #f0f0f0',
  invoiceStripColor:'#D3D9EB',
  alt:'#F5F8FF',
  altBack:'#F0F2F5',
  employee:'#FFFFFF',
  dashBoard:'#ECEFF9',


}
const darkModeVars = {
  backgroundColor: '#141414',
  headerColor:'#000000',
  themeColor: '#0f1027',
  color: '#FFFFFF',
  border:'none',
  filter: 'saturate(3)',
  borderBottom:'none',
  invoiceStripColor:'#2a2c33',
  alt:'#141414',
  dashBoard:'#141414',
  altBack:'#141414',
  employee:'#141414'
}

export default defineComponent({

  components: {
    BgColorsOutlined,
    RouterView,

  },

  setup() {

    const store = useStore()
    const router = useRouter()
    provide('defaultVars', defaultVars)
    provide('darkModeVars', darkModeVars)


    onMounted(() => {
      authChecker()
    })


    const authChecker = () => {
      if (store.state.auth.expiration) {
        const currentTime = new Date().getTime();
        const adjExpirationTime = new Date(store.state.auth.expiration).getTime()
        const remainingDuration = adjExpirationTime - currentTime
        if (remainingDuration <= 60000) {
          logout()
        }
        setTimeout(authChecker, 60000);

      }
    }
    watch(() => (store.state.auth.expiration), (newValues, oldValues) => {
      if (newValues) {
        authChecker()
      }


    });

    let current = ref(['light']);
    const themeState = computed(() => store.state.utils.theme);
    current = ref([themeState.value]);
    let themeArray = []
    let colorDark = '#030852'
    let colorLight = '#1677ff'
    let color =''
    if (themeState.value === 'dark') {
      themeArray = [darkAlgorithm]
      color = colorLight

    } else {
      themeArray = []
      color = colorDark

    }


    const state = reactive({
      currentTheme: current,
      theme: {
        algorithm: themeArray,
        token: {
          colorPrimary: color ,
        },
      }


    })
    provide('theme', state.currentTheme)


    const changeTheme = e => {
      store.dispatch('utils/setTheme', e.key)
      localStorage.setItem("theme", e.key);


      window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: {
          storage: localStorage.getItem('theme')
        }
      }));

      let update = ref([e.key]);
      state.currentTheme = update
      if (e.key === 'dark') {
        state.theme.algorithm = [darkAlgorithm]
        state.theme.token.colorPrimary = colorLight




      } else {
        state.theme.algorithm = []
        state.theme.token.colorPrimary = colorDark


      }


    };

    const logout = () => {
      router.push({
        name: 'Login'
      })
      store.dispatch('auth/setToken', null);
      store.dispatch('auth/setRefresh', null);
      store.dispatch('auth/setEphToken', null)
      store.dispatch('auth/setProfile', null)
      store.dispatch('auth/setExpiration', null)

    }


    return {
      state,
      changeTheme,


    }


  }


});


</script>

<template>
  <a-config-provider :theme="state.theme">
    <RouterView/>
  </a-config-provider>


  <a-dropdown placement="topRight">
    <a-button type="primary" shape="circle" class="lena" size="large">
      <template #icon>
        <BgColorsOutlined/>
      </template>
    </a-button>
    <template #overlay>
      <a-menu v-model:selectedKeys="state.currentTheme" @click="changeTheme">
        <a-menu-item key="light">
          <a href="javascript:;">Light Theme</a>
        </a-menu-item>
        <a-menu-item key="dark">
          <a href="javascript:;">Dark Theme</a>
        </a-menu-item>

      </a-menu>
    </template>
  </a-dropdown>

</template>

<style scoped>
.lena {
  position: fixed;
  bottom: 12%;
  right: 2%;

  z-index: 4;

}


</style>
