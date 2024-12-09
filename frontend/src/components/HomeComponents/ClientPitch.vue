<template>
  <section class="clientPitchSection">
    <a-card style="background-color: #C5C8FD;width: 100%;margin-bottom: 1rem" class="showMobile">
      <img alt="example" style="width: 15%" src="@/assets/images/ben1.svg" />



      <a-card-meta style="margin-top: 2%">
        <template #title  class="ant-card-meta-title">
                <span class="pitchtitle bigheader">
                  Employer Benefits
                </span>

        </template>



      </a-card-meta>

    </a-card>
    <a-row :gutter="[16,16]" class="showMobile">
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12"  >
        <a-card  class="featureCard" >
          <template #title ><span class="titleColor">Payroll Management</span></template>




          <ul>
            <li>
              Onboard new staffs
            </li>
            <li>
              Set recurrent payments
            </li>
            <li>
              Manage bulk payments
            </li>

            <li>
              Make salary disbursements
            </li>
          </ul>



        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12"  >
        <a-card  class="featureCard">
          <template #title ><span class="titleColor">Employer of Record</span></template>

          <ul>
            <li>
              Employee contract
            </li>
            <li>
              Employee benefit
            </li>
            <li>
              Pay contractors
            </li>
            <li>
              Compliance (legal, tax, accounting)
            </li>
          </ul>


        </a-card>
      </a-col>


    </a-row>


    <div>



      <a-card style="background-color: #030852;border: none" class="hideMobile">
        <div class="featuresection">
          <a-row :gutter="[8,8]" type="flex">


            <a-col :xs="{span: 24, offset: 0 }" :sm="{span: 24, offset: 0 }"
                   :md="{span: 24, offset: 0 }"
                   :lg="{span: 6, offset: 0 }" :xl="{span: 6, offset: 0 }"
            >
              <div>

                <p class="pitchtitle hideMobile bigheader" style="color: white">
                  <span class="hider">
                    Employer <br/> Benefits
                  </span>

                  <span class="shower">Employer Benefits</span>

                </p>

              </div>
            </a-col>
            <a-col :xs="{span: 24, offset: 0 }" :sm="{span: 24, offset: 0 }"
                   :md="{span: 24, offset: 0 }"
                   :lg="{span: 18, offset: 0 }" :xl="{span: 18, offset: 0 }"
            >
              <a-row :gutter="[32,32]" type="flex">


                <a-col :xs="{span: 24, offset: 0 }" :sm="{span: 24, offset: 0 }"
                       :md="{span: 12, offset: 0 }"
                       :lg="{span: 12, offset: 0 }" :xl="{span: 12, offset: 0 }"
                       style="margin-bottom: 1rem">
                  <a-card  class="featureCard" >
                    <template #title ><span class="titleColor">Payroll Management</span></template>




                    <ul>
                      <li>
                        Onboard new staffs
                      </li>
                      <li>
                        Set recurrent payments
                      </li>
                      <li>
                        Manage bulk payments
                      </li>

                      <li>
                        Make salary disbursements
                      </li>
                    </ul>



                  </a-card>

                </a-col>
                <a-col :xs="{span: 24, offset: 0 }" :sm="{span: 24, offset: 0 }"
                       :md="{span: 12, offset: 0 }"
                       :lg="{span: 12, offset: 0 }" :xl="{span: 12, offset: 0 }"
                       style="margin-bottom: 1rem">
                  <a-card  class="featureCard">
                    <template #title ><span class="titleColor">Employee of Record</span></template>

                    <ul>
                      <li>
                        Employee contract
                      </li>
                      <li>
                        Employee benefit
                      </li>
                      <li>
                        Pay contractors
                      </li>
                      <li>
                        Compliance (legal, tax, accounting)
                      </li>
                    </ul>


                  </a-card>

                </a-col>



              </a-row>
            </a-col>
          </a-row>


        </div>
      </a-card>


    </div>


  </section>

</template>

<script>
import {UserSwitchOutlined} from '@ant-design/icons-vue';
import { reactive, defineComponent, inject, onMounted} from "vue";
export default defineComponent({

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
.clientPitchSection{
  min-height: 40vh;

  padding: 3% 15%;

}

.hider{
  display: block;
}
.shower{
  display: none;
}
.pitchtitle {

  color: v-bind(state['themeVars']['color']);


}
.titleColor{
  color:  v-bind(state['themeVars']['color']);
}

.featureCard{
  border: none;
  margin-bottom: 1rem;
  min-height: 95%;
  background-color: v-bind(state['themeVars']['themeColor']);
  color:  v-bind(state['themeVars']['color']);
}


.payrollImage{
  display: block;
  margin-top: 5rem;
  width: 100%;
  filter: v-bind(state['themeVars']['filter']);
}

/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {


}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {
  .clientPitchSection{
    padding: 3% 10%;

  }




}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {
  .clientPitchSection{
    padding: 3% 10%;

  }


}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {
  .clientPitchSection{
    padding: 3% 8%;

  }


}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {
  .clientPitchSection{
    padding: 3% 5%;

  }

  .hider{
    display: none;
  }
  .shower{
    display: block;
  }


}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {
  .clientPitchSection{
    padding: 3% 5%;

  }

  .hider{
    display: none;
  }
  .shower{
    display: block;
  }


}
/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {
  .clientPitchSection{
    padding: 3% 5%;

  }


  .hider{
    display: none;
  }
  .shower{
    display: block;
  }


}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .clientPitchSection{
    padding: 3% 5%;
  }


  .hider{
    display: none;
  }
  .shower{
    display: block;
  }


}

</style>