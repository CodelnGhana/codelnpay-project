<template>
  <a-layout style="min-height: 100vh;" class="content">
    <Header/>
    <a-layout-content :style="{ marginTop: '1rem' }">

      <div v-if="!store.state.auth.profile">
        <a-row style="padding: 3%" type="flex" justify="space-around" >
          <a-col :xs="22" :sm="22" :md="12" :lg="12" :xl="6" >
            <p class="Headertitle">Signup as an Employer or Employee</p>
            <a-space direction="vertical" style="width: 100%;margin-bottom: 1rem">
              <a-card  hoverable @click="pickProfile('employer')">
                <a-card-meta title="Employer" description="I want to pay my employees">

                </a-card-meta>

              </a-card>
              <a-card  hoverable @click="pickProfile('employee')">
                <a-card-meta title="Employee" description="I want to receive my salary">

                </a-card-meta>

              </a-card>
            </a-space>

            <div>

              <a-card hoverable style="width: 100%" size="small" @click="codelnLogin">

                <a-row :gutter="[16,16]">
                  <a-col :xs="6" :sm="6" :md="6" :lg="4" :xl="4" >
                    <img alt="logo" src="@/assets/images/props/cropped.png" class="logSize" >

                  </a-col>
                  <a-col span="16">

                    <p >Or Signup  with your  Codeln account</p>
                  </a-col>
                </a-row>



              </a-card>
            </div>
            <div style="text-align: center;margin-top: 1.5rem">
              <p class="ctaLogin">
                Already have an account?
                <a>
                  <router-link to="/Login"> Sign in</router-link>
                </a>
              </p>
            </div>



          </a-col>
        </a-row>


      </div>
    </a-layout-content>
    <Footer/>
  </a-layout>
</template>

<script>
import { defineComponent, inject, onMounted, reactive,} from 'vue';
import Header from "../../components/HomeLayout/Header.vue";
import Footer from "../../components/HomeLayout/Footer.vue";
import { useStore } from 'vuex'
import {useRouter} from "vue-router/dist/vue-router";
export default  defineComponent({
  components: {Header,Footer},
  setup(){
    const store = useStore()
    const router = useRouter()
    const pickProfile = (profile_type)=>{
      store.dispatch('auth/setProfileType', profile_type)
      router.push({
        name: 'Signup'
      })

    }

    const state = reactive({
      currentTheme: localStorage.getItem("theme"),
      themeVars : {},
      defaultVars:inject('defaultVars'),
      darkModeVars:inject('darkModeVars')

    });
    onMounted(()=>{
      window.addEventListener('themeChanged', (event) => {
        state.currentTheme = event.detail.storage;
        if(state.currentTheme === 'dark'){
          state.themeVars = state.darkModeVars
        }else {
          state.themeVars = state.defaultVars
        }
      });
    })
    if(state.currentTheme === 'dark'){
      state.themeVars = state.darkModeVars
    }else {
      state.themeVars = state.defaultVars
    }
    const codelnLogin = ()=>{
      router.push({
        name: 'CodelnLogin'
      })
    }
    return{
      pickProfile,
      store,
      codelnLogin,
      state
    }
  }

})
</script>

<style scoped>
.content{
  background-color: v-bind(state['themeVars']['backgroundColor']);
}
.Headertitle {
  font-size: 1.2rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  text-align: center;
  color: v-bind(state['themeVars']['color']);


}

.ctaLogin{
  color: v-bind(state['themeVars']['color']);
}
.logSize {
  width: 100%;
}
/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {
  .logSize {
    width: 40%;
  }
}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {

  .logSize {
    width: 40%;
  }
}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {

  .logSize {
    width: 40%;
  }
}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {

  .logSize {
    width: 40%;
  }

}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {
  .logSize {
    width: 60%;
  }



}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {
  .logSize {
    width: 100%;
  }

}

/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {

  .logSize {
    width: 100%;
  }
}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .logSize {
    width: 100%;
  }


}
</style>