<template>

    <div>
      <p class="ant-descriptions-title">
        Invoice To
      </p>
      <p>Company: {{ invoice.employer.name }}</p>
      <p>Email: {{ invoice.employer.company_email }}</p>
      <p>Date issued: {{ formattedDate(invoice.created_date) }}</p>
      <p>Invoice: {{ invoice.invoice_id }} </p>
    </div>

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
          Charge
        </a-card>

      </a-col>
    </a-row>
    <!---table data--->
    <a-row>
      <a-col span="6">
        <a-card size="small" class="cardTitle2">
          <span class="capitalize">{{ invoice.employee.user.first_name }} {{ invoice.employee.user.last_name }}</span>
        </a-card>

      </a-col>
      <a-col span="6">
        <a-card size="small" class="cardTitle2">
          {{ invoice.reason }}
        </a-card>

      </a-col>
      <a-col span="6">
        <a-card size="small" class="cardTitle2">
          {{ invoice.currency }}
          <span v-if="invoice.crypto_account">
            {{ Math.ceil((Number(invoice.amount) * 100) / 101) }}
          </span>
          <span v-else>
            {{ invoice.amount }}
          </span>
        </a-card>

      </a-col>
      <a-col span="6">
        <a-card size="small" class="cardTitle2">
           <span>
             {{ invoice.currency }}
           </span>
          <span v-if="invoice.crypto_account">
            {{ Math.ceil(((Number(invoice.amount) * 100) / 101) / 100) }}
          </span>
          <span v-else>
            {{ Number(invoice.amount) / 100 }}
          </span>


        </a-card>

      </a-col>
    </a-row>
    <!---table total--->
    <a-row>
      <a-col :span="6" :offset="18">
        <a-card size="small" class="cardTitle">
          Total: {{ invoice.currency }}

          <span v-if="invoice.crypto_account">
            {{ (((Number(invoice.amount) * 100) / 101) / 100) + ((Number(invoice.amount) * 100) / 101) }}
          </span>
          <span v-else>

             <span v-if="invoice.recruiter_charged === false">
                    {{ Number(invoice.amount) * 99 / 100 }}
                  </span>
                  <span v-else>
                    {{ Number(invoice.amount) * 101 / 100 }}
                  </span>
          </span>

        </a-card>
      </a-col>
    </a-row>
    <div v-if="invoice.bank_account">
      <p class="ant-descriptions-title">
        Receiving Account
      </p>

      <p>Account Name: {{ invoice.bank_account.account_name }}</p>
      <p>Account Number: {{ invoice.bank_account.account_number }}</p>
      <p>Bank Name: {{ invoice.bank_account.bank_name }} </p>
      <p>Country: {{ invoice.bank_account.country }}</p>
      <p>BIC/Swift Code: {{ invoice.bank_account.swift_code }}</p>
    </div>
    <div v-else-if="invoice.crypto_account">
      <p class="ant-descriptions-title">
        Receiving Wallet
      </p>
      <p>Coin: {{ invoice.crypto_account.coin }}</p>
      <p>Wallet Address: {{ invoice.crypto_account.wallet_address }}</p>

    </div>






</template>

<script>
import {defineComponent, inject, onMounted, reactive} from 'vue';

export default defineComponent({
  props: ['invoice'],
  setup() {
    const formattedDate = (unformatedDate) => {
      let date = new Date(unformatedDate)
      return (date.toLocaleDateString('default', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}))

    }
    const state = reactive({
      currentTheme: localStorage.getItem("theme"),
      themeVars : {},
      defaultVars:inject('defaultVars'),
      darkModeVars:inject('darkModeVars'),
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
      formattedDate
    }
  }
})
</script>

<style scoped>


.cardTitle {
  background-color: v-bind(state['themeVars']['invoiceStripColor']);
  border-radius: 0;
  border: none;
}

.cardTitle2 {

  border-radius: 0;
  height: 100%;

}

.capitalize {
  text-transform: capitalize;
}
</style>