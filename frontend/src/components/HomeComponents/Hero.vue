<template>
  <section class="heroSection hideMobile" :style="{height:(Number(state.size)) +'px'  }">
    <div  >
      <a-row :gutter="[16,16]">
        <a-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10" class="herocontainer" :style="{height:(Number(state.size)*0.8) +'px'  }">
          <div >
            <h1 class="herotitle">
              The Payroll  Platform for <br/> <span class="heroTitleColor">Cross-border</span> <br/> Salary<br/>
              Payments
            </h1>

            <a-space>
              <router-link to="Register">
                <a-button type="primary" class="buttonbar">
                  Get Started
                </a-button>
              </router-link>
            </a-space>


          </div>

        </a-col>
        <a-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
          <div >
            <a-row :gutter="[8,8]">
              <a-col :span="12">
                <div  class="herocontainer" :style="{height:(Number(state.size)*0.8) +'px'  }">
                  <a-space direction="vertical" :size="32" class="bigScreenWidth">
                    <a-card class="cardpayroll">
                      <p class="cardpayrollTitle">Next Payroll </p>
                      <p><span
                          class="cardpayrollDate">July 28</span>

                      </p>
                      <p>
                        <a-badge color='#2db7f5'/>
                        <span>
                        Full Time
                        </span>

                      </p>
                      <a-statistic :value="20000" :value-style="{ color: 'white' }">
                        <template #prefix>
                          $
                        </template>
                      </a-statistic>

                      <p>
                        <a-badge color='gold'/>
                        <span>
                        Contractors
                        </span>

                      </p>
                      <a-statistic :value="5000" :value-style="{ color: 'white' }">
                        <template #prefix>
                          $
                        </template>
                      </a-statistic>
                    </a-card>
                    <div class="Payrollaction">
                      <a-card class="cardgetpaid" :bordered="false" size="small">
                        <span style="color:white">
                        Estimated Totals
                        </span>


                        <a-statistic :value="25000" :value-style="{ color: 'white' }" prefix="$"/>
                      </a-card>
                      <a-card class="payrollActions" :bordered="false">

                        <a-button type="primary">
                          Approve Payroll
                        </a-button>


                      </a-card>
                    </div>

                  </a-space>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="herocontainer" :style="{height:(Number(state.size)*0.9) +'px'  }">
                  <a-badge-ribbon text="Paid: $2500" color="#722ed1">

                    <a-card class="heroimageCard">
                      <template #cover>
                        <img alt="example" src="@/assets/images/talent/mantra.jpg"/>
                      </template>
                      <a-card-meta style="color: white">
                        <template #title ><span class="heroCardText">Jessica Aba</span></template>
                        <template #description ><span class="heroCardText">Researcher [Freelancer]</span></template>
                      </a-card-meta>
                    </a-card>
                  </a-badge-ribbon>

                </div>


              </a-col>

            </a-row>
          </div>

        </a-col>

      </a-row>
    </div>
  </section>
  <section class="showMobile">
    <HeroMobile/>
  </section>
</template>

<script>
import {DollarOutlined} from '@ant-design/icons-vue';
import {defineComponent,reactive,onMounted} from 'vue';
import {inject} from "vue";
import HeroMobile from "@/components/HomeComponents/HeroMobile.vue";
export default defineComponent( {

  setup() {
    const state = reactive({
      currentTheme: localStorage.getItem("theme"),
      themeVars : {},
      defaultVars:inject('defaultVars'),
      darkModeVars:inject('darkModeVars'),
      size: window.innerHeight,
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
      link: 'https://docs.google.com/forms/d/e/1FAIpQLScjedivjlR7dmr7Gk6-Eiyz9eI8akoSuoJtPvJyKh_AJqMV6w/viewform',
      date: new Date(),

    }
  },

  components: {
    DollarOutlined,
    HeroMobile
  },
});
</script>

<style scoped>



.heroSection {
  padding: 0 15%;
  background-color: v-bind(state['themeVars']['alt']);

}


.heroTitleColor {
  color: #007BFF
}


.buttonbar {
  height: 3rem;
  width: 14rem;

  font-size: 1rem;


}




.herocontainer {
  justify-content: center;
  align-items: center;
  display: flex;


}



.herotitle {

  font-size: clamp(2.5rem, 3.4783vw + 0.3043rem, 5rem);
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: v-bind(state['themeVars']['color']);
  margin-bottom: 1%;

}

.cardcontainer {
  width: 100%;

}

.ImageContainer {
  margin-top: 25%;
}

.cardpayroll {
  color: white;
  background-color: #030852;
  width: 55%;
  border: none;
  float: right;
}
.heroimageCard{
  border: none;
  background-color: v-bind(state['themeVars']['themeColor']);
  color:  v-bind(state['themeVars']['color']);
}
.heroCardText{
  color:  v-bind(state['themeVars']['color']);
}
.cardpayrollTitle {
  font-size: 1rem;
}

.cardpayrollDate {
  font-size: 2rem;

}


.cardgetpaid {
  background-color: #3e4878;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;

  width: 70%;
  float: right;
}

.payrollActions {
  width: 70%;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: v-bind(state['themeVars']['themeColor']);
  float: right;
}

.Payrollaction {
  display: block;
}

/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {

  .heroIllustrationsContainer {
    margin-top: 0;
  }

  .bigScreenWidth {
    width: 100%;
  }


}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {
  .heroSection {
    padding: 0 10%;

  }

  .heroIllustrationsContainer {
    margin-top: 0;
  }

  .bigScreenWidth {
    width: 100%;
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

  .bigScreenWidth {
    width: 100%;
  }




  .cardpayroll {
    width: 100%;

    float: right;
  }

  .cardcontainer {
    width: 100%;

    margin-top: 70%;
  }

  .ImageContainer {
    margin-top: 35%;
  }



  .Payrollaction {
    display: none;
  }

  .cardpayrollTitle {
    font-size: 1rem;
  }

  .cardpayrollDate {
    font-size: 2rem;
  }




}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {




  .heroSection {
    padding: 0 5%;

  }

  .buttonbar {
    height: 3rem;
    width: 12rem;
    font-size: 0.9rem;

  }




  .cardpayroll {
    width: 100%;

    float: none;
  }

  .cardcontainer {
    width: 100%;

    margin-top: 65%;
  }

  .ImageContainer {
    margin-top: 65%;
  }



  .Payrollaction {
    display: none;
  }

  .cardpayrollTitle {
    font-size: 1rem;
  }

  .cardpayrollDate {
    font-size: 2rem;
  }

}

/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {
  .heroSection {
    padding: 0 5%;


  }

  .buttonbar {
    height: 3rem;
    width: 12rem;
    font-size: 0.9rem;

  }




  .cardpayroll {
    width: 100%;

    float: none;
  }

  .cardcontainer {
    width: 100%;
    margin-top: 1rem;
  }

  .ImageContainer {
    margin-top: 1rem;
  }


  .Payrollaction {
    display: none;
  }

  .cardpayrollTitle {
    font-size: 1rem;
  }

  .cardpayrollDate {
    font-size: 1.8rem;
  }

  .herocontainer {
    margin-top: 8%;


  }

}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .heroSection {
    padding: 0 5%;

  }

  .herocontainer {
    margin-top: 8%;
  }

  .buttonbar {
    height: 3rem;
    width: 10rem;
    font-size: 0.9rem;
  }




  .cardpayroll {
    width: 100%;
    float: none;
  }

  .cardcontainer {
    width: 100%;
    margin-top: 1rem;
  }

  .ImageContainer {
    margin-top: 1rem;
  }

  .Payrollaction {
    display: none;
  }

  .cardpayrollTitle {
    font-size: 0.8rem;
  }

  .cardpayrollDate {
    font-size: 1.5rem;
  }

}
</style>