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
        label="Amount"
        name="withdrawAmount"
        :rules="[{ required: true, message: 'Please input withdraw amount' }]"
    >
      <a-input-number
          style="width: 100%;"
          disabled="true"
          v-model:value="formState.withdrawAmount"
          :min="state.maxAmount"
          :max="state.maxAmount"
          @change="handleAmountChange"
      />
    </a-form-item>
    <a-form-item
        label="Bank Account"
        name="pickedAccount"
        :rules="[{ required: true, message: 'Please select Bank Account' }]"
    >
      <div v-if="accountsLoading">
        <a-spin />
      </div>
      <div v-else>
        <div v-if="accounts.length>0">

          <a-select
              v-model="formState.pickedAccount"
              placeholder="Select Bank Account to withdraw to"
              style="width: 100%"
              :options="accounts"
              @change="handleAccountChange"

          ></a-select>


        </div>
        <div v-else>
          You dont have a {{wallet.currency}} account to cash out to
        </div>
      </div>



    </a-form-item>


    <a-form-item>


        <a-button type="primary" :loading="state.saving" :disabled="disabled" html-type="submit">Withdraw</a-button>


<!--      <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>-->
    </a-form-item>
  </a-form>
</template>
<script>
import {computed, defineComponent, reactive, ref, watch} from 'vue';
import {useStore} from "vuex";
import WalletService from "../../../../services/WalletService";
import { notification } from 'ant-design-vue';
export default defineComponent({
  props: ['wallet', 'accounts','accountsLoading'],
  emits: ['onEnterAmount', 'onPickAccount','onCreateWithdraw','onReset'],
  setup(props, ctx) {
    const store = useStore();
    const formRef = ref();
    const formState = reactive({
      withdrawAmount: undefined,
      pickedAccount: undefined

    });
    const state = reactive({
      maxAmount:props.wallet.balance,
      saving:false,
      accounts:props.accounts
    });
    formState.withdrawAmount = state.maxAmount
    const disabled = computed(() => {
      return !(
          formState.withdrawAmount
          && formState.pickedAccount
          && props.wallet.balance>0




      );
    });

    const onFinish = values => {
      state.saving = true


      let withdrawObj = {

        amount:values.withdrawAmount,
        bank_id:values.pickedAccount,
        wallet_id:props.wallet.wallet_id,
        currency:props.wallet.currency
      }
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      WalletService.createUsdWithdrawRequest(store.state.auth.profile['profile_slug'],withdrawObj, auth)
          .then(()=>{
            resetForm()



            ctx.emit('onCreateWithdraw', props.wallet.balance -values.withdrawAmount);
            openNotificationWithIcon('success')

            state.saving = false
          })
          .catch(()=>{
            state.saving = false

          })

    };
    const openNotificationWithIcon = type => {
      notification[type]({
        message: 'Withdraw request created',
        description:
            'Request will be processed and amount disbursed within the next 2 working days.',
      });
    };
    const onFinishFailed = errorInfo => {
      return errorInfo

    };
    const handleAccountChange = value => {
      formState.pickedAccount = value;
      ctx.emit('onPickAccount', value);

    };
    const handleAmountChange = value => {
      ctx.emit('onEnterAmount', value);

    };
    const resetForm = () => {
      formRef.value.resetFields();
      formState.pickedAccount =undefined
      ctx.emit('onPickAccount', undefined);
      ctx.emit('onEnterAmount', 0);





    };

    return {
      state,
      formState,
      disabled,
      onFinish,
      onFinishFailed,
      handleAccountChange,
      handleAmountChange,
      formRef,
      resetForm
    };
  },
});
</script>