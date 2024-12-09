<template>



  <a-skeleton active v-if="state.loading"/>




  <a-table
      class="ant-table-striped"
      :columns="columns"
      :data-source="state.withdrawals"
      size="small"
      :scroll="{ x: 'max-content' }"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :pagination="state.pagination"
      v-else>

    <template #bodyCell="{ column, record }">

      <template v-if="column.key === 'request_id'">

        <span class="capitalize">
          <span v-if="record.forex !== null">
            {{ record.local_request_id }}

          </span>
          <span v-else>
            {{ record.request_id }}
          </span>

        </span>

      </template>
      <template v-if="column.key === 'status'">

        <span class="capitalize">

          <a-tag  color="#2db7f5">
            <template #icon>
              <sync-outlined :spin="true" />
            </template>
            processing
          </a-tag>
        </span>

      </template>
      <template v-if="column.key === 'amount'">
        <span class="capitalize">
        <span v-if="record.forex !== null">

          {{record.forex.currency_from}}{{record.forex.amount}} :: Rate : {{record.forex.rate}} ::

          {{ record.forex.currency_to }} {{ formattedAmount(record.forex.expected_amount).toLocaleString() }}

          </span>
        <span v-else>
            {{ record.currency }} {{ record.amount.toLocaleString() }}
          </span>

        </span>

      </template>
      <template v-if="column.key === 'bank_name'">

        <span class="capitalize">
          {{ record.bank_account.bank_name }}
        </span>

      </template>
      <template v-if="column.key === 'bank_account'">

        <span class="capitalize">
          {{ record.bank_account.account_number }}
        </span>

      </template>
      <template v-if="column.key === 'updated'">

        <span class="capitalize">
          {{ formattedDate(record.modified_date) }}
        </span>

      </template>


    </template>
  </a-table>

</template>

<script>
import WalletService from "../../../services/WalletService";
import {defineComponent, onMounted, reactive, watch} from 'vue';
import {useStore} from "vuex";
import {SyncOutlined,} from '@ant-design/icons-vue';
const columns = [
  {
    title: 'Transaction Code',
    dataIndex: 'request_id',
    key: 'request_id',
  },

  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Bank',
    dataIndex: 'bank_name',
    key: 'bank_name',
  },
  {
    title: 'Account',
    dataIndex: 'bank_account',
    key: 'bank_account',
  },
  {
    title: 'Updated',
    dataIndex: 'updated',
    key: 'updated',
  },


];
export default defineComponent({
  components:{
    SyncOutlined
  },
  props: ['wallet'],
  setup(props){
    const store = useStore();
    const state = reactive({
      withdrawals:[],
      loading: false,
      wallet:undefined,
      pagination:{
        pageSize:5
      }
    })


    watch(() => props.wallet, (newWallet, oldWallet) => {
      state.wallet = newWallet
      getWithdrawals()

    });

    const getWithdrawals = ()=>{

      state.loading = true
      if(state.wallet){
        getGlobalWalletWithdrawals()
      }






    }
    const getGlobalWalletWithdrawals = ()=>{
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };

      WalletService.getGlobalWalletWithdrawals(state.wallet.wallet_id, auth)
          .then(resp => {


            if(state.wallet.wallet_type === 'usd_global' || state.wallet.wallet_type === 'eur_global' || state.wallet.wallet_type === 'gbp_global' ){
              state.withdrawals = resp.data['usd-usd_requests'];

            }else{
              state.withdrawals = resp.data['usd-local_withdrawal_requests'];
            }
            state.loading = false
            state.withdrawals.sort(function(a,b){

              return new Date(b.created_date) - new Date(a.created_date);
            });


          });

    }
    const getLocalWalletWithdrawals = ()=>{
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };

      WalletService.getLocalWalletWithdrawals(state.wallet.wallet_id, auth)
          .then(resp => {
            state.withdrawals = resp.data;
            state.loading = false


          });

    }
    const formattedAmount = (amount)=>{
      return Math.floor(amount)
    }
    const formattedDate = (unformatedDate)=>{
      let date = new Date(unformatedDate)
      return (date.toLocaleDateString('default', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}))


    }
    return{
      state,
      columns,
      formattedAmount,
      formattedDate
    }
  }

})
</script>

<style scoped>

</style>