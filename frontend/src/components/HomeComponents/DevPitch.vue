<template>
  <section class="devPitchSection">
    <a-card style="background-color: #C5C8FD;width: 100%;margin-bottom: 1rem" class="showMobile">
      <img alt="example" style="width: 15%" src="@/assets/images/ben2.svg" />



      <a-card-meta style="margin-top: 2%">
        <template #title  class="ant-card-meta-title">
                <span class="pitchtitle bigheader">
                  Employee Benefits
                </span>

        </template>



      </a-card-meta>

    </a-card>


    <div>



      <p class="pitchtitle hideMobile bigheader">
        Why do Employees choose CodeLn Pay?

      </p>
      <a-row :gutter="[16,16]">
        <a-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6" >
          <a-card class="featureCard featureCard1" >
            <img alt="example" class="pitchImage " src="@/assets/images/props/invoice.png" />


            <a-card-meta style="margin-top: 2%">
              <template #title  class="ant-card-meta-title">
                <span class="cardText">
                  Fast Disbursement
                </span>

              </template>
              <template #description >
                <span class="cardText">
                   Whether you are invoicing an employer once or accepting recurring payments,
                we offer fast payment processing time.
                </span>

              </template>


            </a-card-meta>

          </a-card>



        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6"  >
          <a-card class="featureCard featureCard2" >
            <img alt="example" class="pitchImage " src="@/assets/images/props/affordable.png" />
            <a-card-meta style="margin-top: 2%">
              <template #title  class="ant-card-meta-title">
                <span class="cardText">
                  Affordable Rates
                </span>

              </template>
              <template #description >
                <span class="cardText">
                  We offer transparency in our pricing at the best
              market rates with no hidden charges.
                </span>

              </template>


            </a-card-meta>


          </a-card>



        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6"  >
          <a-card class="featureCard featureCard1" >
            <img alt="example" class="pitchImage " src="@/assets/images/props/security.png" />
            <a-card-meta style="margin-top: 2%">
              <template #title  class="ant-card-meta-title">
                <span class="cardText">
                  Fund Security
                </span>

              </template>
              <template #description >
                <span class="cardText">
                  Rest assured knowing that your funds and data are
              secured by approved financial partners.
                </span>

              </template>


            </a-card-meta>



          </a-card>

        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6"  >
          <a-card class="featureCard featureCard2" >
            <img alt="example" class="pitchImage " src="@/assets/images/props/help.png" />
            <a-card-meta style="margin-top: 2%">
              <template #title  class="ant-card-meta-title">
                <span class="cardText">
                  24/7 Customer Support
                </span>

              </template>
              <template #description >
                <span class="cardText">
                  Our support team is accessible all round the clock
              across various timezones for any issue resolution.
                </span>

              </template>


            </a-card-meta>



          </a-card>

        </a-col>


      </a-row>





    </div>


  </section>
</template>

<script>
import { DollarOutlined } from '@ant-design/icons-vue';
import { reactive,  defineComponent, inject, onMounted} from "vue";
export default defineComponent({
  components:{DollarOutlined},
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
      state


    }
  },
});
</script>

<style scoped>
.devPitchSection{
  background-color: v-bind(state['themeVars']['employee']);
  min-height: 40vh;

  padding: 3% 15%;
}

.pitchImage{
  width: 15%;
  filter: v-bind(state['themeVars']['filter']);


}

.pitchtitle {
  color: v-bind(state['themeVars']['color']);


}
.featureCard{
  border: v-bind(state['themeVars']['border']);
  margin-bottom: 1rem;
  height: 95%;

}
.featureCard1{
  background-color: #898FFB
}
.featureCard2{
  background-color: #A5A9FC
}
.cardText{
  color: v-bind(state['themeVars']['color']);
}

/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {

}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {
  .devPitchSection{
    padding: 3% 10%;

  }

}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {
  .devPitchSection{
    padding: 3% 10%;

  }


}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {
  .devPitchSection{
    padding: 3% 8%;

  }


}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {
  .devPitchSection{
    padding: 3% 5%;

  }




}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {
  .devPitchSection{
    padding: 3% 5%;

  }




}
/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {
  .devPitchSection{
    padding: 3% 5%;

  }
  .featureCard1{
    background-color: v-bind(state['themeVars']['themeColor']);
  }
  .featureCard2{
    background-color: v-bind(state['themeVars']['themeColor']);
  }




}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .devPitchSection{
    padding: 3% 5%;
  }
  .featureCard1{
    background-color: v-bind(state['themeVars']['themeColor']);
  }
  .featureCard2{
    background-color: v-bind(state['themeVars']['themeColor']);
  }




}

</style>