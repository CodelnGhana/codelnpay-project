<template>
  <section class="mantraSection">
    <div >

      <p class="mantratitle bigheader">
        Faqs
      </p>
      <a-card class="cardTheme" >
        <a-collapse v-model:activeKey="activeKey" accordion ghost >
          <template #expandIcon="{ isActive }">
            <caret-right-outlined :rotate="isActive ? 90 : 0" />
          </template>
          <a-collapse-panel key="1" >
            <template #header>
             <span class="accordionText" style="font-weight: bold;font-size: 1rem">
               How does CodeLn Pay work?
             </span>
            </template>
            <p class="accordionText" style="font-size: 1rem">
              Employees can generate and send an invoice to
              their employers. Employers can add their employees to the platform and manage their payroll.
            </p>
          </a-collapse-panel>
          <a-collapse-panel key="2" >
            <template #header>
             <span class="accordionText" style="font-weight: bold;font-size: 1rem">
               What currencies do you support?
             </span>
            </template>

            <p class="accordionText" style="font-size: 1rem">
              Employers can pay in USD, GBP, EUR or Crypto. While Employees can collect these currencies directly
              in their domiciliary account, convert to any local African currency or collect in cryptocurrencies.
            </p>
          </a-collapse-panel>
          <a-collapse-panel key="3" >
            <template #header>
             <span class="accordionText" style="font-weight: bold;font-size: 1rem">
               How long will it take to get my money?
             </span>
            </template>
            <p class="accordionText" style="font-size: 1rem">
              It takes 2  working days from requesting a payout
              for the money to hit your account.
            </p>
          </a-collapse-panel>
          <a-collapse-panel key="4"  >
            <template #header>
             <span class="accordionText" style="font-weight: bold;font-size: 1rem">
              How can I withdraw my money?
             </span>
            </template>
            <p class="accordionText" style="font-size: 1rem">
              Salaries will be sent to the bank account
              or digital wallet you provide when you request a payout.
            </p>
          </a-collapse-panel>
          <a-collapse-panel key="5"  >
            <template #header>
             <span class="accordionText" style="font-weight: bold;font-size: 1rem">
              What are the charges?
             </span>
            </template>
            <p class="accordionText" style="font-size: 1rem">
              We only bill a 1% transaction fee on salary amount, we have no hidden charges.

            </p>
          </a-collapse-panel>
          <a-collapse-panel key="6"  >
            <template #header>
             <span class="accordionText" style="font-weight: bold;font-size: 1rem">
             What are the payment options for an employer?
             </span>
            </template>
            <p class="accordionText" style="font-size: 1rem">
              Employers will be provided with a bank account in the US, Europe, UK, or Canada based on their specified location. They can pay using any of their preferred
              payment choice, bank transfer, debit/credit cards, digital wallets, cash, etc.
            </p>
          </a-collapse-panel>
        </a-collapse>
      </a-card>






    </div>
  </section>
</template>


<script>
import { defineComponent, inject, onMounted, reactive, ref,} from 'vue';
import { CaretRightOutlined } from '@ant-design/icons-vue';
import { QuestionOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components:{QuestionOutlined,CaretRightOutlined},
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

    const activeKey = ref(['1']);


    return {
      activeKey,
      state
    };
  },
});
</script>

<style scoped>
.mantraSection{
  min-height: 35vh;
  padding: 1% 15%;
  background-color: v-bind(state['themeVars']['altBack']);


}

.mantratitle {

  color: v-bind(state['themeVars']['color']);


}
.cardTheme{
  border: v-bind(state['themeVars']['border']);
  background-color: v-bind(state['themeVars']['themeColor']);
}
.accordionText{
  color: v-bind(state['themeVars']['color']);
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



}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .mantraSection{
    padding: 3% 5%;
  }





}
</style>