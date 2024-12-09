<template>
  <section class="mantraSection">
    <a-card style="background-color: #C5C8FD;width: 100%;margin-bottom: 1rem" class="showMobile">
      <img alt="example" style="width: 15%" src="@/assets/images/ben4.svg" />



      <a-card-meta style="margin-top: 2%">
        <template #title  class="ant-card-meta-title">
                <span class="pitchtitle bigheader">
                  Features
                </span>

        </template>



      </a-card-meta>

    </a-card>
    <div >

      <p class="mantratitle hideMobile bigheader">
        Some key features
      </p>


      <a-row :gutter="[16,16]" >
        <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <a-card class="cardpayroll">
            <p class="cardpayrollTitle">Multi-currency Options </p>

            <p>
              Send salaries in USD,GBP,  EUR or Crypto to Africa. Your employees can choose to receive it in the original currency or in their local currency.

            </p>



          </a-card>
        </a-col>
        <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <a-card class="cardpayrollcolor2" >
            <p class="cardpayrollTitle">Multi-payment Options
            </p>


            <p>
              Send salaries via bank transfers, debit/credit card, direct debit,  or integrate any of your preferred payment partners.


            </p>


          </a-card>
        </a-col>

        <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <a-card class="cardpayroll2">
            <p class="cardpayrollTitle">Payroll Scheduling
            </p>


            <p>
              For recurring or bulk payments, you can schedule your payroll for direct debit at your preferred time of the month.

            </p>


          </a-card>
        </a-col>

      </a-row>



    </div>
  </section>
</template>

<script>
import { UserSwitchOutlined } from '@ant-design/icons-vue';
import { reactive, defineComponent, inject, onMounted} from "vue";
export default defineComponent( {

  components:{
    UserSwitchOutlined
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
.mantraSection{
  min-height: 35vh;
  background-color: v-bind(state['themeVars']['altBack']);
  padding: 1% 15%;

}

.mantratitle {

  color: v-bind(state['themeVars']['color']);


}

.cardpayroll{
  color: white;
  background-color: #030852;
  height: 100%;
  border: v-bind(state['themeVars']['border']);
}
.cardpayroll2{
  color: white;
  background-color: #030852;
  height: 100%;
  border: v-bind(state['themeVars']['border']);

}

.cardpayrollcolor2{
  color: white;
  background-color: #3E4878;
  height: 100%;
  border: v-bind(state['themeVars']['border']);




}
.cardpayrollTitle{
  font-size: 1.3rem;
  font-weight: 600;
}

/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {

}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {
  .mantraSection{
    padding: 3% 10%;

  }


}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {
  .mantraSection{
    padding: 3% 10%;

  }


}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {
  .mantraSection{
    padding: 3% 8%;

  }


}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {
  .mantraSection{
    padding: 3% 5%;

  }



}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {
  .mantraSection{
    padding: 3% 5%;

  }




}
/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {
  .mantraSection{
    padding: 3% 5%;

  }

  .cardpayrollTitle{
    font-size: 1rem;

  }


}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .mantraSection{
    padding: 3% 5%;
  }

  .cardpayrollTitle{
    font-size: 1rem;

  }



}
</style>