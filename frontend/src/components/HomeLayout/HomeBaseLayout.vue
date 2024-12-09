<template>
  <a-layout class="home">
    <Header/>
    <a-layout-content>

        <slot/>

    </a-layout-content>
    <Footer/>

  </a-layout>
</template>

<script>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import {inject, onMounted, reactive} from "vue";

export default {
  name: "HomeBaseLayout",
  components:{
    Header,Footer
  },
  setup() {
    const state = reactive({
      currentTheme: localStorage.getItem("theme"),
      themeVars : {},
      defaultVars:inject('defaultVars'),
      darkModeVars:inject('darkModeVars')
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

    return {
      state,


    }
  },
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: v-bind(state['themeVars']['backgroundColor']);


}
</style>