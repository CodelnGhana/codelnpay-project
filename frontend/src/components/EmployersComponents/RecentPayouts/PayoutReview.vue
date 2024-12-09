<template>
  <a-card style="width: 100%;" :bordered="false">
    <template #title>
      Payment Review

    </template>
    <template #extra v-if=" state.invoice">
      Status
      <a-tag color="success" v-if="state.invoice.status ==='disbursed'">{{ state.invoice.status }}</a-tag>
      <a-tag color="blue" v-else-if="state.invoice.status ==='payed in'">{{ state.invoice.status }}</a-tag>
      <a-tag color="error" v-else-if="state.invoice.status ==='failed'">{{ state.invoice.status }}</a-tag>
      <a-tag color="cyan" v-else>created</a-tag>
    </template>
    <template #actions>
      <p>Thank you. If you have any questions, please contact
        <br/>
        [codeln@codeLn.com]</p>

    </template>
    <section v-if="state.invoice">
      <div>

        <p>Company: {{ state.invoice.employer.company }}</p>
        <p>Email: {{ state.invoice.employer.user.email }}</p>
        <p>Date issued: {{formattedDate(state.invoice.created_date)}}</p>
      </div>

      <a-divider/>
      <p >
        Recipient
      </p>
      <!---table title--->
      <a-row>
        <a-col span="6">
          <a-card size="small" class="cardTitle">
            Name
          </a-card>

        </a-col>
        <a-col span="6">
          <a-card size="small" class="cardTitle">
            Reason
          </a-card>

        </a-col>
        <a-col span="6">
          <a-card size="small" class="cardTitle">
            Amount
          </a-card>

        </a-col>
        <a-col span="6">
          <a-card size="small" class="cardTitle">
            Charges
          </a-card>

        </a-col>
      </a-row>
      <!---table data--->
      <a-row>
        <a-col span="6">
          <a-card size="small" class="cardTitle2">
            <span class="capitalize">{{ state.invoice.employee_ref.firstname }} {{ state.invoice.employee_ref.lastname }}</span>
          </a-card>

        </a-col>
        <a-col span="6">
          <a-card size="small" class="cardTitle2">
            {{ state.invoice.reason }}
          </a-card>

        </a-col>
        <a-col span="6">
          <a-card size="small" class="cardTitle2">
            {{ state.invoice.currency }} {{ state.invoice.amount }}
          </a-card>

        </a-col>
        <a-col span="6">
          <a-card size="small" class="cardTitle2">
            <span>
              {{ Number(state.invoice.amount) / 100 }}
            </span>



          </a-card>

        </a-col>
      </a-row>
      <!---table total--->
      <a-row>
        <a-col :span="6" :offset="18">
          <a-card size="small" class="cardTitle">
            Total: {{ state.invoice.currency }}

            <span>
              {{ Number(state.invoice.amount) * 101 / 100 }}

            </span>
          </a-card>
        </a-col>
      </a-row>
      <a-divider/>
      <p class="Title">How to Pay</p>

      <a-select
          v-model:value="state.country"
          :options="state.options"
          style="width: 100%;margin-bottom: 1rem"

      ></a-select>
      <p class="Title">
        Reference Number: {{ state.invoice.payment_id }}

      </p>

      <p>Dont forget to add the reference number to transfer notes.It will help us process your payment faster</p>

      <div v-if="state.invoice.currency ==='USD'">
        <div v-if="state.country==='USA'">
          <div v-if="state.invoice.provider ==='truly'">
            <TrulyUsdLocal/>
          </div>
          <div v-if="state.invoice.provider ==='verto'">
            <VertoUsdLocal/>
          </div>




        </div>
        <div v-else>
          <div v-if="state.invoice.provider ==='truly'">
            <TrulyUsdGlobal/>
          </div>
          <div v-if="state.invoice.provider ==='verto'">
            <VertoUsdGlobal/>


          </div>
        </div>
      </div>
      <div v-if="state.invoice.currency ==='EUR'">
        <div v-if="state.country==='Euro'">
          <div v-if="state.invoice.provider ==='truly'">
           <TrulyEuroLocal/>
          </div>
          <div v-if="state.invoice.provider ==='verto'">
            <VertoEuroLocal/>
          </div>





        </div>
        <div v-else>
          <div v-if="state.invoice.provider ==='truly'">
            <TrulyEuroGlobal/>
          </div>
          <div v-if="state.invoice.provider ==='verto'">
            <VertoEuroGlobal/>

          </div>




        </div>
      </div>
      <div v-if="state.invoice.currency ==='GBP'">
        <div v-if="state.country==='UK'">
          <div v-if="state.invoice.provider ==='truly'">
            <TrulyPoundLocal/>
          </div>
          <div v-if="state.invoice.provider ==='verto'">
            <VertoPoundLocal/>
          </div>

        </div>
        <div v-else>
          <div v-if="state.invoice.provider ==='truly'">
            <TrulyPoundGlobal/>
          </div>
          <div v-if="state.invoice.provider ==='verto'">
            <VertoPoundGlobal/>
          </div>




        </div>
      </div>
    </section>
    <section v-else>
      <a-skeleton active />
      <a-skeleton active />
      <a-skeleton active />

    </section>
  </a-card>
</template>

<script>
import {defineComponent, reactive, onMounted, inject} from 'vue';
import PaymentService from "../../../services/PaymentService";
import {useRouter} from 'vue-router';
import {  RollbackOutlined} from '@ant-design/icons-vue';
import TrulyUsdLocal from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Truly/Usd/TrulyUsdLocal.vue";
import VertoUsdLocal from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Verto/Usd/VertoUsdLocal.vue";
import TrulyUsdGlobal from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Truly/Usd/TrulyUsdGlobal.vue";
import VertoUsdGlobal from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Verto/Usd/VertoUsdGlobal.vue";
import TrulyEuroLocal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Truly/Euro/TrulyEuroLocal.vue";
import VertoEuroLocal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Verto/Euro/VertoEuroLocal.vue";
import TrulyEuroGlobal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Truly/Euro/TrulyEuroGlobal.vue";
import VertoEuroGlobal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Verto/Euro/VertoEuroGlobal.vue";
import TrulyPoundLocal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Truly/Pound/TrulyPoundLocal.vue";
import TrulyPoundGlobal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Truly/Pound/TrulyPoundGlobal.vue";
import VertoPoundLocal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Verto/Pound/VertoPoundLocal.vue";
import VertoPoundGlobal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Verto/Pound/VertoPoundGlobal.vue";
export default defineComponent( {
  components:{
    VertoPoundGlobal,
    VertoPoundLocal,
    TrulyPoundGlobal,
    TrulyPoundLocal,
    VertoEuroGlobal,
    TrulyEuroGlobal,
    VertoEuroLocal,
    TrulyEuroLocal,
    VertoUsdGlobal,
    TrulyUsdGlobal,
    VertoUsdLocal,
    TrulyUsdLocal,
    RollbackOutlined

  },
  setup() {

    const router = useRouter();
    const state = reactive({

      invoice_id:router.currentRoute.value.params.invoiceId,
      country: 'USA',
      options:[],
      usdOptions: [
        {
          value: 'USA',
          label: 'My Bank is in The United States',
        }, {
          value: 'Outside',
          label: 'My Bank is outside of the United States',
        }
      ],
      euroOptions: [
        {
          value: 'Euro',
          label: 'My bank is in the European countries',
        }, {
          value: 'Outside',
          label: 'My Bank is outside of the European countries',
        }],
      gbpOptions: [
        {
          value: 'UK',
          label: 'My bank is in the united kingdom',
        }, {
          value: 'Outside',
          label: 'My Bank is outside of the United Kingdom',
        }
      ],
      invoice:null,
      loading:false,
      currentTheme: localStorage.getItem("theme"),
      themeVars : {},
      defaultVars:inject('defaultVars'),
      darkModeVars:inject('darkModeVars'),


    });
    onMounted(() => {
      state.loading=true
      window.addEventListener('themeChanged', (event) => {
        state.currentTheme = event.detail.storage;
        if(state.currentTheme === 'dark'){
          state.themeVars = state.darkModeVars
        }else {
          state.themeVars = state.defaultVars
        }
      });

      getInvoice()



    });
    if(state.currentTheme === 'dark'){
      state.themeVars = state.darkModeVars
    }else {
      state.themeVars = state.defaultVars
    }
    const getInvoice  = ()=>{
      PaymentService.getMyPayment(state.invoice_id)
          .then(resp=>{
            state.invoice = resp.data
            state.loading=false
            selectOptions()



          })

    }


    const selectOptions = () => {

      if (state.invoice.currency === 'USD') {
        state.options =state.usdOptions;
      } else if (state.invoice.currency === 'EUR') {
        state.country = 'Euro';
        state.options = state.euroOptions;
      } else if (state.invoice.currency === 'GBP') {
        state.country = 'UK';
        state.options = state.gbpOptions;
      }
    };
    const formattedDate = (unformatedDate)=>{
      let date = new Date(unformatedDate)
      return (date.toLocaleDateString('default', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}))


    }


    return {
      state,
      formattedDate

    };
  }
})
</script>

<style scoped>
.Title {

  font-family: 'Poppins', sans-serif;
  color: #15161A;
  font-weight: bold;
}
.cardTitle {
  background-color: v-bind(state['themeVars']['invoiceStripColor']);
  border-radius: 0;
  border: none;
}

.cardTitle2 {

  border-radius: 0;
  height: 100%;

}
</style>