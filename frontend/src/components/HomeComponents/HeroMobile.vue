<script setup>
import {computed, inject, onMounted, reactive,} from 'vue';
import {onUnmounted} from "vue";

import {useRouter} from "vue-router";
import store from "@/store/store.js";

const router = useRouter();
const state = reactive({
  size: window.innerHeight,
  currentTheme: localStorage.getItem("theme"),
  themeVars : {},
  defaultVars:inject('defaultVars'),
  darkModeVars:inject('darkModeVars'),

})
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
const deviceHeight = (e) => {
  state.size = e.srcElement.innerHeight;
};
onUnmounted(() => {
  // window.removeEventListener("resize", deviceHeight);
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

</script>

<template>
  <section class="sectionMain" :style="{height:(Number(state.size)*0.9) +'px'  }">
    <div class="imageAttribs" :style="{height:(Number(state.size)*0.3) +'px'  }">
      <img alt="example" src="@/assets/images/talent/mantra.jpg" style="width: 100%"/>
    </div>


    <a-card class="heroCard">
      <h1 class="herotitle">
        The Payroll <br/> Platform for<br/> <span class="heroTitleColor">Cross-border</span> <br/>Salary
        Payments

      </h1>


      <a-button type="primary" :block="true" class="buttonbar" @click="handleClick('Register')">
        Get Started
      </a-button>


    </a-card>
  </section>

</template>

<style scoped>
.sectionMain {

  background-color: v-bind(state['themeVars']['alt']);

  position: relative;
}

.herotitle {
  font-size: 4rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
//color: v-bind(state ['themeVars'] ['color']);

}

.heroTitleColor {
  color: #007BFF
}

.imageAttribs {

  justify-content: center;
  align-items: center;
  display: flex;
}

.buttonbar {
  height: 3rem;


  font-size: 1rem;


}

.heroCard {
  width: 100%;
  position: absolute;
  bottom: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border: none;
}


/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {


  .buttonbar {
    height: 3rem;

    font-size: 0.9rem;

  }

  .herotitle {
    font-size: 2.3rem;

  }


}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {


  .buttonbar {
    height: 3rem;
    font-size: 0.9rem;
  }

  .herotitle {
    font-size: 2.3rem;
  }


}
</style>