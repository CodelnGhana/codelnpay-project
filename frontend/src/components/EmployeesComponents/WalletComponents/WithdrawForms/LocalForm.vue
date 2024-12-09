<template>


  <a-form
      ref="formRef"
      :model="formState"
      name="basic"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
  >





    <a-form-item
        label="Which currency do you want to withdraw in"
        name="forexCurrency"
        :rules="[{ required: true, message: 'Please select withdraw out currency' }]"
    >


      <a-select
          show-search
          v-model="formState.forexCurrency"
          placeholder="Select currency"
          style="width: 100%"
          :options="options"
          :filter-option="filterOption"
          @change="handleForexCurrencyChange"

      >

      </a-select>


    </a-form-item>
    <div v-if="state.currencyPicked && !state.fetchingRate">






      <a-form-item
          label="Withdraw Amount"
          name="withdrawAmount"
          :rules="[{ required: true, message: 'Please input withdraw amount' }]"
      >
        <a-input-number
            style="width: 100%;"
            v-model:value="formState.withdrawAmount"
            :min="state.maxAmount"
            :disabled="true"
            :max="state.maxAmount"
            @change="handleAmountChange"
            :step="1"
        />
      </a-form-item>
      <p>Exchange rate :1 {{wallet.currency}} = {{ state.exchangeRate }} {{formState.forexCurrency}}</p>
      <p style="font-weight: bold">Cash out Amount: {{formState.forexCurrency}} {{Math.floor(state.maxAmount * state.exchangeRate)}}</p>
<!--      <div v-if="state.renewForex">-->
<!--        Forex rate has expired. Click to refresh-->
<!--        <a-button type="primary"  @click="getForexRate">Refresh</a-button>-->
<!--      </div>-->

      <a-form-item
          style="display: none"
          label="Exchange Amount"
          name="changedAmount"
      >
        <a-input-number
            style="width: 100%;"
            v-model:value="formState.changedAmount"
            :min="100"
            :disabled="true"
            :max="state.maxAmount * state.exchangeRate"
            @change="handleForexAmountChange"

        />
      </a-form-item>
      <a-form-item
          label="Bank Account"
          name="pickedAccount"
          :rules="[{ required: true, message: 'Please select Bank Account' }]"
      >
        <div v-if="state.currencyAccounts.length>0">
          <a-select
              v-model="formState.pickedAccount"
              placeholder="Select Bank Account to withdraw to"
              style="width: 100%"
              :options="state.currencyAccounts"
              @change="handleAccountChange"

          ></a-select>


        </div>
        <div v-else>
          You dont have a {{ formState.forexCurrency }} account to cash out to
        </div>
      </a-form-item>
    </div>
    <div v-if="state.fetchingRate">
      <a-skeleton active />
    </div>



    <a-form-item>
      <a-button type="primary" html-type="submit" :loading="state.saving" :disabled="disabled">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import {defineComponent, onMounted, reactive, ref,computed} from 'vue';
import {useStore} from "vuex";
import moment from "moment/moment";
import Currencies from "@/assets/json/Africa.json";
import WalletService from "../../../../services/WalletService";
import { notification } from 'ant-design-vue';
export default defineComponent({
  props: ['wallet','accounts'],
  emits: ['onEnterAmount', 'onPickAccount','onForexAmountChange','onForexCurrencyChange','onCreateWithdrawLocal'],
  setup(props, ctx) {
    const store = useStore();
    const formRef = ref();
    const formState = reactive({
      withdrawAmount: undefined,
      pickedAccount: undefined,
      forexCurrency: undefined,
      changedAmount:undefined

    });
    const state = reactive({
      maxAmount: props.wallet.balance,
      exchangeRate: null,
      currencyPicked:false,
      currencyAccounts:[],
      fetchingRate:false,
      currencyOptions:[],
      forexVerto:null,
      currentDate:null,
      renewForex:false,
      saving:false

    });
    formState.withdrawAmount =state.maxAmount
    onMounted(() => {
      setInterval(dateGet,1000)
    });

    const dateGet = () => {
      state.currentDate = moment(Date.now()).local()
      bemo()

    }

    const bemo = () => {
      if(state.forexVerto){
        let date = moment(state.forexVerto.expiry).local()
        let expired = moment(date).isAfter(Date.now())
        if(!expired){
          state.renewForex = true

        }
      }

    }




    let opt = [];
    for (const key in Currencies) {

      let currencyObj = {
        value: key,
        label: Currencies[key].name,
      };
      opt.push(currencyObj);

    }
    const options = ref([...opt]);





    const getForexCurrencies = ()=>{
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      WalletService.getforexCurrencies(auth)
          .then(resp => {

            resp.data.forEach(currency=>{
              let currencyObj = {
                value: currency.currencyName,
                label: currency.currencyName,
              };

              state.currencyOptions.push(currencyObj);
            })



          });

    }

    const onFinish = () => {
      createForexTrade()
      // createLocalWithdraw()
      // resetForm()
    };
    const onFinishFailed = errorInfo => {
      return errorInfo;

    };
    const handleAccountChange = value => {
      formState.pickedAccount = value;
      ctx.emit('onPickAccount', value);

    };
    const handleAmountChange = value => {
      ctx.emit('onEnterAmount', value);
      formState.changedAmount = formState.withdrawAmount * state.exchangeRate
      ctx.emit('onForexAmountChange',formState.changedAmount)


    };
    const handleForexCurrencyChange = value =>{
      state.fetchingRate = true

      formState.forexCurrency =value
      ctx.emit('onForexCurrencyChange',value)
      state.currencyPicked = true
      getForexRate()

    }
    const filterCurrencyAccounts = ()=>{
      state.currencyAccounts = []
      props.accounts.forEach(account=>{
        if(account.currency === formState.forexCurrency){
          let accountTemplate = {
            value: account.id,
            label: `${account.bank_name} : ${account.account_number}`,
          };
          state.currencyAccounts.push(accountTemplate);

        }
      })
    }
    const handleForexAmountChange = value => {
      ctx.emit('onForexAmountChange',value)
      formState.withdrawAmount = formState.changedAmount / state.exchangeRate;
      ctx.emit('onEnterAmount', formState.withdrawAmount);

    };
    const filterOption = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };
    const getForexRate = ()=>{
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      state.renewForex = false
      state.forexVerto = null
      state.exchangeRate =null
      WalletService.getforexRate(props.wallet.currency,formState.forexCurrency, auth)
          .then(resp => {

            state.forexVerto = resp.data
            state.fetchingRate = false
            state.exchangeRate = resp.data.rate

            filterCurrencyAccounts()

          });

    }
    const createForexTrade = ()=>{
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      state.saving = true
      let forexTradeObj = {
        amount:formState.withdrawAmount,
        currency_from:props.wallet.currency,
        currency_to:formState.forexCurrency,
        rate:state.exchangeRate,
        expected_amount:formState.withdrawAmount*state.exchangeRate
      }
      WalletService.createForexTrade(store.state.auth.profile['profile_slug'],forexTradeObj, auth)
          .then(resp => {
            createLocalWithdraw(resp.data)


          });

    }
    const createLocalWithdraw = (forex)=>{
      let withdrawObj = {

        amount: formState.withdrawAmount,
        bank_id: formState.pickedAccount,
        wallet_from: props.wallet.wallet_id,
        currency: formState.forexCurrency,
        forex_id:forex.id

      };

      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      WalletService.createLocalWithdrawRequest(store.state.auth.profile['profile_slug'],withdrawObj, auth)
          .then(() => {


            resetForm()



          });

    }

    const disabled = computed(() => {
      return !(
          formState.withdrawAmount
          && formState.pickedAccount
          && formState.forexCurrency
          && state.forexVerto
          && props.wallet.balance>0



      );
    });
    const resetForm = () => {
      ctx.emit('onCreateWithdrawLocal',props.wallet.balance - formState.withdrawAmount)
      openNotificationWithIcon('success')
      formState.withdrawAmount = undefined
      formState.changedAmount = undefined
      formState.pickedAccount = undefined
      ctx.emit('onEnterAmount', 0);
      ctx.emit('onForexAmountChange',0)
      formRef.value.resetFields();
      state.saving = false
    };
    const openNotificationWithIcon = type => {
      notification[type]({
        message: 'Withdraw request created',
        description:
            'Request will be processed and amount disbursed within the next 2 working days.',
      });
    };

    return {
      state,
      filterOption,
      formState,
      options,
      onFinish,
      onFinishFailed,
      handleAccountChange,
      handleAmountChange,
      handleForexAmountChange,
      handleForexCurrencyChange,
      getForexRate,
      disabled





    };
  },
});
</script>