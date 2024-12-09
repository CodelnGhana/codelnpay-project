<template>


  <a-table
      :loading="state.loading"
      class="ant-table-striped"
      :columns="columns"
      :data-source="state.allWithdrawals"
      size="small"
      :scroll="{ x: 'max-content' }"
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :pagination="state.pagination"
  >

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

          <a-tag color="#2db7f5">
            <template #icon>
              <sync-outlined :spin="true"/>
            </template>
            processing
          </a-tag>
        </span>

      </template>

      <template v-if="column.key === 'amount'">
        <span class="capitalize">
        <span v-if="record.forex !== null">

          {{ record.forex.currency_from }}{{ record.forex.amount }} :: Rate : {{ record.forex.rate }} ::

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
import {defineComponent, onMounted, reactive, computed} from 'vue';
import {useStore} from "vuex";
import {SyncOutlined,} from '@ant-design/icons-vue';

const columns = [
  {
    title: 'Transaction Code',
    dataIndex: 'request_id',
    key: 'request_id',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },

  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
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
  components: {
    SyncOutlined
  },
  setup() {

    const store = useStore();
    const state = reactive({
      globalWithdrawals: [],
      localWithdrawals: [],
      allWithdrawals: [],
      loading: false,
      pagination: {
        pageSize: 5
      }
    });
    onMounted(() => {
      state.loading = true;


      getGlobalWalletWithdrawals();
      // getLocalWalletWithdrawals()


    });
    const getGlobalWalletWithdrawals = () => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      WalletService.getWithdrawals(store.state.auth.profile['profile_slug'], auth)
          .then(resp => {
            state.globalWithdrawals = resp.data;
            getLocalWalletWithdrawals();


          })
          .catch(() => {
            state.loading = false
          })

    };
    const getLocalWalletWithdrawals = () => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      WalletService.getLocalWithdrawals(store.state.auth.profile['profile_slug'], auth)
          .then(resp => {
            state.localWithdrawals = resp.data;
            state.loading = false
            combine();


          })
          .catch(() => {
            state.loading = false
          })

    };
    const combine = () => {
      let currentIndex = 1;
      state.allWithdrawals = [...state.globalWithdrawals, ...state.localWithdrawals];
      state.allWithdrawals.forEach(withdrawal => {
        withdrawal.key = currentIndex;
        currentIndex++;
      });
      state.allWithdrawals.sort(function (a, b) {

        return new Date(b.created_date) - new Date(a.created_date);
      });

    };
    const formattedAmount = (amount) => {
      return Math.floor(amount)
    }
    const formattedDate = (unformatedDate) => {
      let date = new Date(unformatedDate)
      return (date.toLocaleDateString('default', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}))


    }

    return {
      state,
      columns,
      formattedAmount,
      formattedDate

    };
  }

});
</script>

<style scoped>
[data-doc-theme='light'] .ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}

[data-doc-theme='dark'] .ant-table-striped :deep(.table-striped) td {
  background-color: rgb(29, 29, 29);
}
</style>