<template>
  <section class="ctaSection" >

    <div >

      <p class="ctatitle">
        <span class="titleColor">Pay</span> or  <span class="titleColor">Get Paid</span> using Codeln Pay today
      </p>


        <a-button type="primary" @click="handleClick('Register')"  :block="isMobile" class="buttonbar">
          Get Started
        </a-button>



    </div>





  </section>
</template>

<script>
import { SmileOutlined } from '@ant-design/icons-vue';

import {reactive, defineComponent, inject, onMounted, computed, onUnmounted} from "vue";
import store from "@/store/store.js";

import {useRouter} from "vue-router";
export default defineComponent( {
  name: "HomeCta",
  components:{
    SmileOutlined
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      size: window.innerWidth,
      currentTheme: localStorage.getItem("theme"),
      themeVars : {},
      defaultVars:inject('defaultVars'),
      darkModeVars:inject('darkModeVars')
    })
    onMounted(()=>{
      window.addEventListener("resize", deviceWidth);
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
    onUnmounted(() => {
      window.removeEventListener("resize", deviceWidth);
    });
    const deviceWidth = (e) => {
      state.size = e.srcElement.innerWidth;
    };
    const isMobile = computed(() => {
      return state.size <= 425;
    });
    const isLoggedIn = computed(() => store.getters["auth/isLoggedIn"])
    const isEmployer = computed(() => store.getters["auth/isEmployer"])
    const handleClick = (e) => {
      if(isLoggedIn && isEmployer){
        router.push({
          name: 'EmployerDashBoard'
        });
      }else if(isLoggedIn && !isEmployer){
        router.push({
          name: 'DashBoard'
        });
      }else {
        router.push({
          name: e
        });
      }


    };

    return {
      state,
      isMobile,
      handleClick


    }
  },

});
</script>

<style scoped>
.ctaSection{
  padding: 3% 15%;
  min-height: 35vh;
  background-color: v-bind(state['themeVars']['backgroundColor']);
}
.ctatitle {
  font-size: 2.5rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: v-bind(state['themeVars']['color']);


}

.buttonbar {
  height: 3rem;
  width: 14rem;
  font-size: 1rem;
}
.titleColor{
  color:#007BFF
}

/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {

}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {
  .ctaSection{
    padding: 3% 10%;

  }

}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {
  .ctaSection{
    padding: 3% 10%;

  }

}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {
  .ctaSection{
    padding: 3% 8%;

  }

}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {
  .ctaSection{
    padding: 3% 5%;

  }

}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {
  .ctaSection{
    padding: 3% 5%;

  }
  .ctatitle {
    font-size: 2rem;

  }
  .buttonbar {
    height: 3rem;
    width: 12rem;
    font-size: 0.9rem;

  }

}
/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {
  .ctaSection{
    padding: 3% 5%;
    display: flex;
    justify-content: center;
    align-items: center;

  }
  .ctatitle {
    font-size: 1.7rem;

  }
  .buttonbar {
    height: 3rem;
    width: 100%;
    font-size: 0.9rem;

  }



}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .ctaSection{
    padding: 3% 5%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .ctatitle {
    font-size: 1.7rem;

  }
  .buttonbar {
    height: 3rem;
    width: 100%;
    font-size: 0.9rem;

  }



}
</style>