<template>
  <a-card style="margin-bottom: 3rem" >
    <template #actions>
      <p>Thank you. If you have any questions, please contact
        <br/>
        [codeln@codeLn.com]</p>

    </template>
    <section v-if="state.bulkRecord">
      <div>
        <p class="ant-descriptions-title">
          Invoice To
        </p>
        <p>Company: {{ state.bulkRecord.employer.company }}</p>
        <p>Date issued: {{formattedDate(state.bulkRecord.created_date)}}</p>
      </div>

      <a-divider/>
      <p >
        Recipients
      </p>

      <section>
        <!---table title--->
        <a-row>
          <a-col span="8">
            <a-card size="small" class="cardTitle">
              Name
            </a-card>

          </a-col>

          <a-col span="8">
            <a-card size="small" class="cardTitle">
              Amount
            </a-card>

          </a-col>
          <a-col span="8">
            <a-card size="small" class="cardTitle">
              Charges
            </a-card>

          </a-col>
        </a-row>

        <!---table data--->
        <div v-for="paymentRecord in state.bulkRecord.payments" v-bind:key="paymentRecord.id">
          <a-row>
            <a-col span="8">
              <a-card size="small" class="cardTitle2">

                <span class="capitalize">{{ paymentRecord.employee_ref.firstname }} {{ paymentRecord.employee_ref.lastname }}</span>
              </a-card>

            </a-col>

            <a-col span="8">
              <a-card size="small" class="cardTitle2">
                {{ paymentRecord.currency }} {{ paymentRecord.amount }}
              </a-card>

            </a-col>
            <a-col span="8">
              <a-card size="small" class="cardTitle2">
                {{ Number(paymentRecord.amount) / 100 }}

              </a-card>

            </a-col>
          </a-row>
        </div>
        <!---table total--->
        <a-row>
          <a-col :span="8" :offset="16">
            <a-card size="small" class="cardTitle">
              Total: {{ state.bulkRecord.currency }}

              {{ Number(state.bulkRecord.amount) * 101 / 100 }}

            </a-card>
          </a-col>
        </a-row>

      </section>

      <a-divider/>
      <p class="Title">How to Pay</p>

      <a-select
          v-model:value="state.country"
          :options="state.options"
          style="width: 100%;margin-bottom: 1rem"

      ></a-select>
      <p class="Title">
        Reference Number: {{ state.bulkRecord.payment_id }}

      </p>

      <p style="font-weight: bold">Don't forget to add the reference number above to the transfer notes. It will help us process your payment faster.</p>

      <div v-if="state.bulkRecord.currency ==='USD'">
        <div v-if="state.country==='USA'">

          <p class="Title">Account Name: CodeLn Technologies Limited</p>

          <p class="Title">Account Number: 8309241229 </p>

          <p class="Title">Bank Name: Community Federal Savings Bank</p>

          <p class="Title">Routing No.: 026073150</p>

          <p class="Title">Address: 810 Seventh Avenue, New York, NY 10019, US</p>

          <p class="Title">Country: United States of America</p>


        </div>
        <div v-else>

          <p class="Title">
            Account Name: CodeLn Technologies Limited
          </p>

          <p class="Title">IBAN: GB38TCCL04140420455829</p>

          <p class="Title">Bank Name: The Currency Cloud Limited</p>

          <p class="Title">BIC/Swift Code: TCCLGB3L</p>

          <p class="Title">Address: 12 Steward Street, The Steward Building, London, E1 6FQ, GB</p>

          <p class="Title">Country: United Kingdom of Great Britain and Northern Ireland</p>


        </div>
      </div>
      <div v-if="state.bulkRecord.currency ==='EUR'">
        <div v-if="state.country==='Euro'">


          <p class="Title">Account Name: CodeLn Technologies Limited</p>
          <p class="Title">Bank: The Currency Cloud Limited</p>
          <p class="Title">IBAN: GB60TCCL00997981656273</p>
          <p class="Title">BIC/Swift Code: TCCLGB31</p>
          <p class="Title">Address: 12 Steward Street, The Steward Building, London, E1 6FQ, GB</p>
          <p class="Title">Country: United Kingdom of Great Britain and Northern Ireland</p>


        </div>
        <div v-else>

          <p class="Title">
            Account Name: CodeLn Technologies Limited
          </p>

          <p class="Title">IBAN: GB38TCCL04140420455829</p>

          <p class="Title">Bank Name: The Currency Cloud Limited</p>

          <p class="Title">BIC/Swift Code: TCCLGB3L</p>

          <p class="Title">Address: 12 Steward Street, The Steward Building, London, E1 6FQ, GB</p>

          <p class="Title">Country: United Kingdom of Great Britain and Northern Ireland</p>


        </div>
      </div>
      <div v-if="state.bulkRecord.currency ==='GBP'">
        <div v-if="state.country==='UK'">
          <p class="Title">Account Name: CodeLn Technologies Limited</p>
          <p class="Title">Account Number: 20455829</p>
          <p class="Title">Bank Name: The Currency Cloud Limited</p>
          <p class="Title">Sort Code: 041404</p>
          <p class="Title">Address: 12 Steward Street, The Steward Building, London, E1 6FQ, GB</p>
          <p class="Title">Country: United Kingdom of Great Britain and Northern Ireland</p>
        </div>
        <div v-else>

          <p class="Title">
            Account Name: CodeLn Technologies Limited
          </p>

          <p class="Title">IBAN: GB38TCCL04140420455829</p>

          <p class="Title">Bank Name: The Currency Cloud Limited</p>

          <p class="Title">BIC/Swift Code: TCCLGB3L</p>

          <p class="Title">Address: 12 Steward Street, The Steward Building, London, E1 6FQ, GB</p>

          <p class="Title">Country: United Kingdom of Great Britain and Northern Ireland</p>


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
export default defineComponent({


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
      bulkRecord:null,
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

      getBulkInvoice()



    });
    if(state.currentTheme === 'dark'){
      state.themeVars = state.darkModeVars
    }else {
      state.themeVars = state.defaultVars
    }
    const getBulkInvoice  = ()=>{

      PaymentService.getMyBulkPayment(state.invoice_id)
          .then(resp=>{
            state.bulkRecord = resp.data
            state.loading=false
            selectOptions()
          })

    }


    const selectOptions = () => {

      if (state.bulkRecord.currency === 'USD') {
        state.options =state.usdOptions;
      } else if (state.bulkRecord.currency === 'EUR') {
        state.country = 'Euro';
        state.options = state.euroOptions;
      } else if (state.bulkRecord.currency === 'GBP') {
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
});
</script>

<style scoped>
.Title {

  font-family: 'Poppins', sans-serif;

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