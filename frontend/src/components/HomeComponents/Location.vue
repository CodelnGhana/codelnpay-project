<template>
  <section class="avaiablitySection" >
    <a-card style="background-color: #C5C8FD;width: 100%;margin-bottom: 1rem" class="showMobile">
      <img alt="example" style="width: 15%" src="@/assets/images/ben3.svg" />



      <a-card-meta style="margin-top: 2%">
        <template #title  class="ant-card-meta-title">
                <span class="pitchtitle bigheader">
                  Availability
                </span>

        </template>



      </a-card-meta>

    </a-card>

    <div >
      <a-row :gutter="[16,16]">
        <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">

          <p class="Availabilitytitle hideMobile bigheader">
            Unlock global growth
          </p>
          <p class="Availabilitysubtitle">
            Send and receive International Payments in any currency.
          </p>
          <p class="sendfromtotitle">Send from</p>
          <a-row :gutter="[16,16]">
            <a-col class="gutter-row" :span="6">
              <a-card size="small" class="cardTheme">
                <img class="flags" src="@/assets/images/flags/usa.png"/>
                <p class="countriestext">USA</p>

              </a-card>
            </a-col>
            <a-col class="gutter-row" :span="6">
              <a-card size="small" class="cardTheme">
                <img class="flags" src="@/assets/images/flags/eu.png"/>
                <p class="countriestext">EU</p>

              </a-card>
            </a-col>
            <a-col class="gutter-row" :span="6">
              <a-card size="small" class="cardTheme">
                <img class="flags" src="@/assets/images/flags/canada.png"/>
                <p class="countriestext">Canada</p>

              </a-card>
            </a-col>
            <a-col class="gutter-row" :span="6">
              <a-card size="small" class="cardTheme">
                <img class="flags" src="@/assets/images/flags/uk.png"/>
                <p class="countriestext">UK</p>

              </a-card>
            </a-col>


          </a-row>
          <p class="sendfromtotitle" style="margin-top: 1rem">Send to</p>
          <a-row :gutter="[16,16]" class="flagRow">
            <a-col class="gutter-row" :span="6">
              <a-card size="small" class="cardTheme">
                <img class="flags" src="@/assets/images/flags/africa.png"/>
                <p class="countriestext">Africa</p>

              </a-card>
            </a-col>

          </a-row>

        </a-col>
        <a-col  :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="hideMobile">

          <img alt="map" class="locationImage" src="@/assets/images/talent/ma.svg"/>

        </a-col>
      </a-row>


    </div>





  </section>

</template>

<script>
import { GlobalOutlined } from '@ant-design/icons-vue';

import { reactive,  defineComponent, inject, onMounted} from "vue";
export default defineComponent({
  components:{
    GlobalOutlined
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
});
</script>

<style scoped>
.avaiablitySection{
  padding: 3% 15%;
  min-height: 40vh;

  background-color: v-bind(state['themeVars']['backgroundColor']);
}
.Availabilitytitle {

  color: v-bind(state['themeVars']['color']);


}
.cardTheme{
  border: v-bind(state['themeVars']['border']);
  background-color: v-bind(state['themeVars']['themeColor']);
}
.Availabilitysubtitle {
  color: v-bind(state['themeVars']['color']);
  font-size: 1.2rem;
  font-family: 'Poppins', sans-serif;




}
.sendfromtotitle {
  color: v-bind(state['themeVars']['color']);
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;




}
.countriestext{
  color: v-bind(state['themeVars']['color']);
  font-family: 'Poppins', sans-serif;

}
.locationImage{
  width: 100%;
}
.flags{
  width: 30%;
}
.flagRow{
  margin-bottom: 1rem;
}
.showIvory{
  display: block;
}
/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {

}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {
  .avaiablitySection{
    padding: 3% 10%;

  }
  .locationImage{
    margin-top: 1rem;
  }

}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {
  .avaiablitySection{
    padding: 3% 10%;

  }
  .locationImage{
    margin-top: 4rem;
  }

}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {
  .avaiablitySection{
    padding: 3% 8%;

  }
  .locationImage{
    margin-top: 4rem;
  }

}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {
  .avaiablitySection{
    padding: 3% 5%;

  }

  .Availabilitysubtitle {

    font-size: 1rem;
  }

  .countriestext{
    font-size: 0.8rem;

  }
  .flags{
    width: 50%;
  }
  .showIvory{
    display: block;
  }
  .locationImage{
    margin-top: 5rem;
  }

}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {
  .avaiablitySection{
    padding: 3% 5%;

  }

  .Availabilitysubtitle {

    font-size: 1rem;
  }

  .countriestext{
    font-size: 0.8rem;

  }
  .flags{
    width: 40%;
  }
  .showIvory{
    display: block;
  }
  .locationImage{
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }

}
/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {
  .avaiablitySection{
    padding: 3% 5%;

  }

  .Availabilitysubtitle {

    font-size: 1rem;
  }

  .countriestext{
    font-size: 0.8rem;

  }
  .flags{
    width: 50%;
  }
  .showIvory{
    display: none;
  }


}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .avaiablitySection{
    padding: 3% 5%;
  }

  .Availabilitysubtitle {

    font-size: 1rem;
  }
  .countriestext{
    font-size: 0.8rem;

  }
  .flags{
    width: 50%;
  }
  .showIvory{
    display: none;
  }


}
</style>