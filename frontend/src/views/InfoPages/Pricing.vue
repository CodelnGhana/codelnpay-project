<template>
  <HomeBaseLayout>
    <section class="heroSection">

      <a-row style="padding: 3%" type="flex" justify="space-around">
        <a-col :xs="22" :sm="22" :md="20" :lg="16" :xl="16" >
          <p class="herotitle">Simple Transparent Pricing to suit all  your  needs.</p>
          <a-row :gutter="[16,16]">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="margin-bottom: 1rem">

              <a-card class="cardpayroll"  >
                <p class="cardpayrollTitle" style="text-align: start">
                  We  bill a 1% transaction fee on salary amount.
                </p>

                <ul>
                  <li>Receive amount in 2 working days.  </li>
                  <li>Multi currency pay in options.</li>
                  <li>Fund Security.</li>
                </ul>
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 1rem;display: none">

              <a-card class="cardpayroll2"  >
                <p class="cardpayrollTitle">$50 </p>
                <p style="text-align: center">For salary amounts less than $4000.</p>
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 1rem;display: none">
              <a-card  class="cardpayroll2"  >
                <p class="cardpayrollTitle">$100 </p>
                <p style="text-align: center">For salary amounts greater than $4000.</p>
              </a-card>
            </a-col>

          </a-row>
        </a-col>
      </a-row>

    </section>


  </HomeBaseLayout>

</template>

<script>
import HomeBaseLayout from "../../components/HomeLayout/HomeBaseLayout.vue";
import { inject, onMounted, reactive} from "vue";

export default {
  name: "Pricing",
  components: {HomeBaseLayout},
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
.herotitle {
  font-size: 2rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: v-bind(state['themeVars']['color']);
  text-align: center;

}

.heroSection {
  padding: 0 15%;
  background-color: v-bind(state['themeVars']['backgroundColor']);


}

.cardpayroll{
  color: white;
  background-color: #030852;
  height: 100%;
  border-radius: 8px;
  border: v-bind(state['themeVars']['border']);

}
.cardpayroll2{


  height: 100%;
  border-radius: 10px;

}

.cardpayrollTitle{
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
}

/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {


}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {

  .herotitle {
    font-size: 2rem;

  }

  .heroSection {
    padding: 0 10%;

  }

}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {


  .herotitle {
    font-size: 2rem;

  }

  .heroSection {
    padding: 0 10%;

  }

}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {

  .herotitle {
    font-size: 2rem;

  }

  .heroSection {
    padding: 0 8%;

  }

}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {

  .herotitle {
    font-size: 2rem;

  }

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
  .cardpayrollTitle{
    font-size: 1rem;

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
  .cardpayrollTitle{
    font-size: 1rem;

  }


}
</style>