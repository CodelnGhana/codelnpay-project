<template>
<HomeBaseLayout>
  <section class="heroSection">
    <a-row style="padding: 3%" type="flex" justify="space-around" align="middle">
      <a-col :xs="22" :sm="22" :md="20" :lg="20" :xl="20" class="textColor">
        <p>Hero Mobile Illustration : <a href="https://www.freepik.com/free-vector/flat-hand-drawn-people-working-same-room_12201366.htm#fromView=search&page=1&position=8&uuid=c6c40be6-929f-4b98-849c-06cb13599ab0">Image by pikisuperstar</a> on Freepik</p>
        <a href="https://www.flaticon.com/free-icons/location" title="location icons">Location icons created by Freepik - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/feature" title="feature icons">Feature icons created by Icongeek26 - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/salary" title="salary icons">Salary icons created by Eucalyp - Flaticon</a>


      </a-col>
    </a-row>

  </section>

</HomeBaseLayout>
</template>

<script>
import HomeBaseLayout from "../../components/HomeLayout/HomeBaseLayout.vue";
import {useStore} from "vuex";
import {computed, inject, onMounted, reactive, watch} from "vue";
export default {
  name: "Attributions",
  components:{
    HomeBaseLayout
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
.textColor{
  color: v-bind(state['themeVars']['color']);
}
.herotitle {
  font-size: 1.8rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.heroSection {
  padding: 0 15%;
  background-color: v-bind(state['themeVars']['backgroundColor']);

}


/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {


}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {


  .heroSection {
    padding: 0 10%;

  }

}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {




  .heroSection {
    padding: 0 10%;

  }

}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {



  .heroSection {
    padding: 0 8%;

  }

}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {



  .heroSection {
    padding: 0 5%;

  }

}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {


  .herotitle {
    font-size: 1.5rem;

  }

  .heroSection {
    padding: 0 5%;

  }


}

/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {
  .herotitle {
    font-size: 1.2rem;


  }
  .heroSection {
    padding: 0 5%;


  }


}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {


  .herotitle {
    font-size: 1.2rem;



  }
  .heroSection {
    padding: 0 5%;


  }



}
</style>