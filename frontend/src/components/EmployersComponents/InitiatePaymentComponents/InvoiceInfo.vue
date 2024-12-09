<template>
  <a-card style="margin-bottom: 3rem">
    <template #actions>
      <p>Thank you. If you have any questions, please contact
        <br/>
        [codeln@codeLn.com]</p>

    </template>
    <section v-if="state.otpForm">
      <h3>Input the One time Password to access the invoice. It is part of the email you received</h3>
      <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
          autocomplete="off"
          @finish="otpAuthCheck"

      >
        <a-form-item
            label="One time Password"
            name="otp"
            :rules="[{ required: true, message: 'Please input your One time Password!' }]"
        >
          <a-input-password v-model:value="formState.otp" autocomplete="off"/>
        </a-form-item>


        <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
          <a-button type="primary" html-type="submit" :loading="state.submitting">Submit</a-button>
        </a-form-item>
      </a-form>

    </section>
    <section v-else>
      <section v-if="state.invoice">
        <div>
          <p class="ant-descriptions-title">
            Invoice To
          </p>
          <p>Company: {{ state.invoice.employer.name }}</p>

          <p>Date issued: {{ formattedDate(state.invoice.created_date) }}</p>
        </div>


        <a-divider/>
        <p>
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
            <span class="capitalize">{{
                state.invoice.employee.user.first_name
              }} {{ state.invoice.employee.user.last_name }}</span>
            </a-card>

          </a-col>
          <a-col span="6">
            <a-card size="small" class="cardTitle2">
              {{ state.invoice.reason }}
            </a-card>

          </a-col>
          <a-col span="6">
            <a-card size="small" class="cardTitle2">
              {{ state.invoice.currency }}
              <span v-if="state.invoice.crypto_account">
            {{ Math.ceil((Number(state.invoice.amount) * 100) / 101) }}
          </span>
              <span v-else>
            {{ state.invoice.amount }}
          </span>
            </a-card>

          </a-col>
          <a-col span="6">
            <a-card size="small" class="cardTitle2">
              <p v-if="state.invoice.recruiter_charged">
                {{ state.invoice.currency }}

              <span v-if="state.invoice.crypto_account">
                {{ Math.ceil(((Number(state.invoice.amount) * 100) / 101) / 100) }}
              </span>
              <span v-else>


                {{ Number(state.invoice.amount) / 100 }}
              </span>
              </p>
              <p v-else>
                0
              </p>


            </a-card>

          </a-col>
        </a-row>
        <!---table total--->
        <a-row>
          <a-col :span="6" :offset="18">
            <a-card size="small" class="cardTitle">
              <p v-if="state.invoice.recruiter_charged">
                Total: {{ state.invoice.currency }}
                <span v-if="state.invoice.crypto_account">
            {{ (((Number(state.invoice.amount) * 100) / 101) / 100) + ((Number(state.invoice.amount) * 100) / 101) }}
          </span>
                <span v-else>
            {{ Number(state.invoice.amount) * 101 / 100 }}
          </span>
              </p>
              <p v-else>
                Total: {{ state.invoice.currency }}
                <span v-if="state.invoice.crypto_account">
                  {{Number(state.invoice.amount)}}

          </span>
                <span v-else>
            {{ Number(state.invoice.amount) }}
          </span>
              </p>



            </a-card>
          </a-col>
        </a-row>
        <a-divider/>
        <p class="Title">How to Pay</p>
        <div v-if="state.invoice.bank_account">
          <a-select
              v-model:value="state.country"
              :options="state.options"
              style="width: 100%;margin-bottom: 1rem"

          ></a-select>
          <p class="Title">
            Reference Number: {{ state.invoice.invoice_id }}

          </p>

          <p style="font-weight: bold">Don't forget to add the reference number above to the transfer notes. It will
            help
            us
            process your payment faster.</p>

          <div v-if="state.invoice.currency ==='USD'">
            <div v-if="state.country==='USA'">
              <div v-if="state.invoice.bank_account.currency === 'USD'">
                <TrulyUsdLocal/>
              </div>
              <div v-else>
                <VertoUsdLocal/>


              </div>


            </div>
            <div v-else>
              <div v-if="state.invoice.bank_account.currency === 'USD'">
                <TrulyUsdGlobal/>

              </div>
              <div v-else>
                <VertoUsdGlobal/>


              </div>


            </div>
          </div>
          <div v-if="state.invoice.currency ==='EUR'">
            <div v-if="state.country==='Euro'">
              <div v-if="state.invoice.bank_account.currency === 'EUR'">
                <TrulyEuroLocal/>

              </div>
              <div v-else>
                <VertoEuroLocal/>


              </div>


            </div>
            <div v-else>
              <div v-if="state.invoice.bank_account.currency === 'EUR'">
                <TrulyEuroGlobal/>


              </div>
              <div v-else>
                <VertoEuroGlobal/>


              </div>


            </div>
          </div>
          <div v-if="state.invoice.currency ==='GBP'">
            <div v-if="state.country==='UK'">
              <div v-if="state.invoice.bank_account.currency === 'GBP'">
                <TrulyPoundLocal/>

              </div>
              <div v-else>
                <VertoPoundLocal/>

              </div>
            </div>
            <div v-else>
              <div v-if="state.invoice.bank_account.currency === 'GBP'">
                <TrulyPoundGlobal/>
              </div>
              <div v-else>
                <VertoPoundGlobal/>


              </div>


            </div>
          </div>
        </div>
        <div v-else-if="state.invoice.crypto_account">
          <p>This is a crypto invoice the payment link will take you to a portal on how to pay</p>
          <a :href="state.secondTemplate.eukapay_template_url" target="_blank">Payment Link</a>
        </div>


      </section>
      <section v-else>
        <a-skeleton active/>
        <a-skeleton active/>
        <a-skeleton active/>

      </section>
    </section>


  </a-card>

</template>

<script>
import {defineComponent, reactive, onMounted, inject} from 'vue';


import InvoiceService from "../../../services/InvoiceService";
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import CryptoWalletsService from "../../../services/CryptoWalletsService";
import VertoPoundGlobal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Verto/Pound/VertoPoundGlobal.vue";
import TrulyPoundGlobal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Truly/Pound/TrulyPoundGlobal.vue";
import VertoPoundLocal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Verto/Pound/VertoPoundLocal.vue";
import TrulyPoundLocal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Truly/Pound/TrulyPoundLocal.vue";
import VertoEuroGlobal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Verto/Euro/VertoEuroGlobal.vue";
import TrulyEuroGlobal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Truly/Euro/TrulyEuroGlobal.vue";
import VertoEuroLocal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Verto/Euro/VertoEuroLocal.vue";
import TrulyEuroLocal
  from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Truly/Euro/TrulyEuroLocal.vue";
import VertoUsdGlobal from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Verto/Usd/VertoUsdGlobal.vue";
import TrulyUsdGlobal from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Truly/Usd/TrulyUsdGlobal.vue";
import VertoUsdLocal from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Verto/Usd/VertoUsdLocal.vue";
import TrulyUsdLocal from "@/components/EmployersComponents/RecentPayouts/PaymentOptions/Truly/Usd/TrulyUsdLocal.vue";

export default defineComponent({
  components: {
    TrulyUsdLocal,
    VertoUsdLocal,
    TrulyUsdGlobal,
    VertoUsdGlobal,
    TrulyEuroLocal,
    VertoEuroLocal,
    TrulyEuroGlobal, VertoEuroGlobal, TrulyPoundLocal, VertoPoundLocal, TrulyPoundGlobal, VertoPoundGlobal
  },


  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      invoice_id: router.currentRoute.value.params.invoiceId,
      country: 'USA',
      options: [],
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
      invoice: null,
      loading: false,
      secondTemplate: '',
      otpForm: true,
      submitting: false,
      currentTheme: localStorage.getItem("theme"),
      themeVars : {},
      defaultVars:inject('defaultVars'),
      darkModeVars:inject('darkModeVars'),


    });
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
    const formState = reactive({
      otp: '',

    });

    const otpAuthCheck = () => {
      state.submitting = true
      InvoiceService.otpAuth(state.invoice_id, {password: formState.otp})
          .then((resp) => {
            state.submitting = false
            state.invoice = resp.data;
            state.otpForm = false
            selectOptions();

          })
          .catch(() => {
            state.submitting = false
          })
    }


    const selectOptions = () => {
      if (state.invoice.bank_account) {
        if (state.invoice.currency === 'USD') {
          state.options = state.usdOptions;
        } else if (state.invoice.currency === 'EUR') {
          state.country = 'Euro';
          state.options = state.euroOptions;
        } else if (state.invoice.currency === 'GBP') {
          state.country = 'UK';
          state.options = state.gbpOptions;
        }

      } else if (state.invoice.crypto_account) {
        getCryptoPaymentTemplate(state.invoice);

      }


    };
    const formattedDate = (unformatedDate) => {
      let date = new Date(unformatedDate);
      return (date.toLocaleDateString('default', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}));


    };
    const getCryptoPaymentTemplate = (invoice) => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      CryptoWalletsService.getCryptoPaymentTemplate(invoice.invoice_id, auth)
          .then(resp => {

            state.secondTemplate = resp.data;
            state.templateLoad = false;


          })
          .catch(() => {
            state.templateLoad = false;
          });
    };


    return {
      state,
      formattedDate,
      otpAuthCheck,
      formState


    };
  }
});
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
  height: 100%;
  border-radius: 0;

}

.capitalize {
  text-transform: capitalize;
}
</style>