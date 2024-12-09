<template>
  <a-skeleton active v-if="state.loading"/>
  <a-tabs v-model:activeKey="state.activeKey" v-else>
    <a-tab-pane key="1" tab="Bulk Employee Payments" v-if="state.bulkPaymentRecords.length>0" >
       <span v-for="bulkEntry in state.bulkPaymentRecords" v-bind:key="bulkEntry">


        <a-collapse v-model:activeKey="state.collapseActiveKey" accordion ghost style="margin-bottom: 1%">
           <template #expandIcon="{ isActive }">
                <caret-right-outlined :rotate="isActive ? 90 : 0" />
              </template>

            <a-collapse-panel :key="bulkEntry.payment_id">

              <template #header>

                <a-row style="width: 100%">
                  <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" >
                    <b>Invoice: </b> {{ bulkEntry.payment_id }}
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                   <b>Status: </b>
                     <!---sent triggered-->
            <a-tooltip v-if=" bulkEntry.status && bulkEntry.status ==='bulk_payment_received'">
              <template #title>
                We have received your payment, your employee will receive it in 2 - 3 business days.
              </template>
              <a-tag color="success">payment received</a-tag>
            </a-tooltip>
                    <!---money should have to account-->
            <a-tooltip v-if=" bulkEntry.status && bulkEntry.status ==='bulk_payment_disbursed'">
              <template #title>
                We have sent the money to your employee.


              </template>
              <a-tag color="blue">disbursed</a-tag>
            </a-tooltip>
                    <!---issue with payment-->
            <a-tooltip v-if=" bulkEntry.status && bulkEntry.status ==='failed'">
              <template #title>
                There is an issue with the transaction. Support should be in contact with you to resolve
              </template>
              <a-tag color="error">{{ bulkEntry.status }}</a-tag>
            </a-tooltip>
                    <!---start of invoice-->
            <a-tooltip v-if=" bulkEntry.status && bulkEntry.status ==='bulk_payment_pending'">
              <template #title>
                You have initiated a payment, once we receive the money in our bank you will be notified within 24 hours.
              </template>
              <a-tag color="cyan">payment_pending</a-tag>
            </a-tooltip>

                  </a-col>
                  <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                    <b>Amount: </b> {{bulkEntry.currency}}{{bulkEntry.amount}}
                  </a-col>

                  <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                   <b>Employees: </b>  {{ bulkEntry.payments.length }}
                  </a-col>




                </a-row>

              </template>
              <template #extra>
                <a-button type="primary" @click="handleClick(bulkEntry)">View Invoice</a-button>
              </template>
<!--              <a-button @click="deleteBulkEntry(bulkEntry)">delete</a-button>-->




              <a-table :columns="columnsSmall" :data-source="bulkEntry.payments" size="small"
                       :scroll="{ x: 'max-content' }">
                <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'employee'">

            <span class="capitalize">{{ record.employee_ref.firstname }} {{ record.employee_ref.lastname }}</span>

          </template>
          <template v-if="column.key === 'amount'">

            <span>{{ record.currency }} {{ record.amount }}</span>

          </template>

          <template v-else-if="column.key === 'status'">

            <!---sent triggered-->
            <a-tooltip v-if=" record.status && record.status ==='payment_received'">
              <template #title>
                We have received your payment, your employee will receive it in 2 - 3 business days.
              </template>
              <a-tag color="success">{{ record.status }}</a-tag>
            </a-tooltip>
            <!---money should have to account-->
            <a-tooltip v-if=" record.status && record.status ==='payment_disbursed'">
              <template #title>
                We have sent the money to your employee.


              </template>
              <a-tag color="blue">{{ record.status }}</a-tag>
            </a-tooltip>
            <!---issue with payment-->
            <a-tooltip v-if=" record.status && record.status ==='failed'">
              <template #title>
                There is an issue with the transaction. Support should be in contact with you to resolve
              </template>
              <a-tag color="error">{{ record.status }}</a-tag>
            </a-tooltip>
            <!---start of invoice-->
            <a-tooltip v-if=" record.status && record.status ==='payment_pending'">
              <template #title>
                You have initiated a payment, once we receive the money in our bank you will be notified within 24
                hours.
              </template>
              <a-tag color="cyan">{{ record.status }}</a-tag>
            </a-tooltip>

          </template>
          <template v-else-if="column.key === 'kyc'">
        <span v-if="record.employee_ref.employee_ref">
          <span v-if="record.employee_ref.employee_ref.verification.length>0">
          <span v-if="record.employee_ref.employee_ref.verification[0].status === 'verification.completed'">
            <a-tag color="#87d068">
              Verified
            </a-tag>
          </span>
          <span v-if="record.employee_ref.employee_ref.verification[0].status !== 'verification.completed'">
            <a-tag color="#f50">
              Unverified
            </a-tag>
          </span>
        </span>
        <span v-else>
          <a-tag color="#f50">
            Unverified
          </a-tag>
        </span>
        </span>
            <span v-else>
          <a-tag color="#f50">
            Unverified
          </a-tag>
        </span>


          </template>
          <template v-else-if="column.key === 'account'">
        <span v-if="record.employee_bank_account">
             <a-tag color="#87d068">
                Provided
              </a-tag>

          </span>
            <span v-else>
            <a-tag color="#f50">
                  pending
                </a-tag>

          </span>


          </template>


        </template></a-table>

            </a-collapse-panel>

        </a-collapse>


       </span>


    </a-tab-pane>
    <a-tab-pane key="2" tab="Single Employee payments">
      <a-table :columns="columns" :data-source="state.paymentRecords" size="small" :scroll="{ x: 'max-content' }">


        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'employee'">

            <span class="capitalize">{{ record.employee_ref.firstname }} {{ record.employee_ref.lastname }}</span>

          </template>
          <template v-if="column.key === 'amount'">

            <span>{{ record.currency }} {{ record.amount }}</span>

          </template>

          <template v-else-if="column.key === 'status'">

            <!---sent triggered-->
            <a-tooltip v-if=" record.status && record.status ==='payment_received'">
              <template #title>
                We have received your payment, your employee will receive it in 2 - 3 business days.
              </template>
              <a-tag color="success">{{ record.status }}</a-tag>
            </a-tooltip>
            <!---money should have to account-->
            <a-tooltip v-if=" record.status && record.status ==='payment_disbursed'">
              <template #title>
                We have sent the money to your employee.


              </template>
              <a-tag color="blue">{{ record.status }}</a-tag>
            </a-tooltip>
            <!---issue with payment-->
            <a-tooltip v-if=" record.status && record.status ==='failed'">
              <template #title>
                There is an issue with the transaction. Support should be in contact with you to resolve
              </template>
              <a-tag color="error">{{ record.status }}</a-tag>
            </a-tooltip>
            <!---start of invoice-->
            <a-tooltip v-if=" record.status && record.status ==='payment_pending'">
              <template #title>
                You have initiated a payment, once we receive the money in our bank you will be notified within 24
                hours.
              </template>
              <a-tag color="cyan">{{ record.status }}</a-tag>
            </a-tooltip>

          </template>
          <template v-else-if="column.key === 'kyc'">
        <span v-if="record.employee_ref.employee_ref">
          <span v-if="record.employee_ref.employee_ref.verification.length>0">
          <span v-if="record.employee_ref.employee_ref.verification[0].status === 'verification.completed'">
            <a-tag color="#87d068">
              Verified
            </a-tag>
          </span>
          <span v-if="record.employee_ref.employee_ref.verification[0].status !== 'verification.completed'">
            <a-tag color="#f50">
              Unverified
            </a-tag>
          </span>
        </span>
        <span v-else>
          <a-tag color="#f50">
            Unverified
          </a-tag>
        </span>
        </span>
            <span v-else>
          <a-tag color="#f50">
            Unverified
          </a-tag>
        </span>


          </template>
          <template v-else-if="column.key === 'account'">
        <span v-if="record.employee_bank_account">
             <a-tag color="#87d068">
                Provided
              </a-tag>

          </span>
            <span v-else>
            <a-tag color="#f50">
                  pending
                </a-tag>

          </span>


          </template>

          <template v-else-if="column.key === 'invoice'">
            <a-space>
              <a @click="payoutPreview(record)">Review</a>


<!--              <a-button @click="deleteEntry(record)">delete</a-button>-->

            </a-space>


          </template>
        </template>
      </a-table>

    </a-tab-pane>

  </a-tabs>


</template>

<script>

import {defineComponent, reactive, onMounted, ref} from 'vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import PaymentService from "../../../services/PaymentService";
import { CaretRightOutlined } from '@ant-design/icons-vue';
const columns = [
  {
    title: 'Employee Name',
    dataIndex: 'employee',
    key: 'employee',
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
    title: 'KYC Status',
    dataIndex: 'kyc',
    key: 'kyc',
  },
  {
    title: 'Bank Account',
    dataIndex: 'account',
    key: 'account',
  },

  {
    title: 'Invoice',
    key: 'invoice',
  }
];
const columnsSmall = [
  {
    title: 'Employee Name',
    dataIndex: 'employee',
    key: 'employee',
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
    title: 'KYC Status',
    dataIndex: 'kyc',
    key: 'kyc',
  },
  {
    title: 'Bank Account',
    dataIndex: 'account',
    key: 'account',
  },


];

export default defineComponent({
  props: ['company', 'account'],
  components:{CaretRightOutlined},


  emits: ['companiesList'],


  setup(props, ctx) {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      paymentRecords: [],
      bulkPaymentRecords: [],
      loading: false,
      activeKey: '1',
      collapseActiveKey:[]


    });

    onMounted(() => {
      state.loading = true;
      getMyInvoices();
    });
    const getMyInvoices = () => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      PaymentService.getMyPayments(store.state.auth.profile['profile_slug'], auth)
          .then(resp => {
            state.paymentRecords = resp.data;

            getBulkPayments();

          })
          .catch(() => {
            state.loading = false;
          });

    };
    const getBulkPayments = () => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      PaymentService.getMyBulkPayments(store.state.auth.profile['profile_slug'], auth)
          .then(resp => {
            state.bulkPaymentRecords = resp.data;



            siftPayments();

          })
          .catch(() => {
            state.loading = false;
          });
    };
    const payoutPreview = (invoice) => {
      router.push({name: 'PaymentReview', params: {invoiceId: invoice.payment_id}});

    };
    const deleteEntry = (record) => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };

      PaymentService.deletePayout(store.state.auth.profile['profile_slug'], record.payment_id, auth)
          .then(() => {

            let index = state.paymentRecords.indexOf(record);
            if (index > -1) {
              state.paymentRecords.splice(index, 1);
            }


          })
          .catch(() => {

          });
    };
    const deleteBulkEntry = (record) => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      let paymentRecords = record.payments

      PaymentService.deleteBulkPayout(store.state.auth.profile['profile_slug'], record.payment_id, auth)
          .then(() => {

            let index = state.bulkPaymentRecords.indexOf(record);
            if (index > -1) {
              state.bulkPaymentRecords.splice(index, 1);
            }
            paymentRecords.forEach(record=>{
              deleteEntry(record)
            })


          })
          .catch(() => {

          });
    };
    const siftPayments = () => {
      if (state.bulkPaymentRecords.length === 0) {
        state.activeKey = '2';
      }else {
        state.collapseActiveKey.push(state.bulkPaymentRecords[0].payment_id)
      }
      state.loading = false;
      let bulkRecords = [];
      state.bulkPaymentRecords.forEach(record => {
        record.payments.forEach(record => {
          bulkRecords.push(record.payment_id);
        });
      });

      bulkRecords.forEach(bulkrecord => {
        state.paymentRecords.forEach(record => {
          if (bulkrecord === record.payment_id) {

            let index = state.paymentRecords.indexOf(record);
            if (index > -1) {
              state.paymentRecords.splice(index, 1);
            }

          }
        });

      });


    };

    const formattedDate = (unformatedDate)=>{
      let date = new Date(unformatedDate)
      return (date.toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric'}))


    }
    const handleClick = (entry) => {
      const routeData = router.resolve({name: 'BulkInvoiceView', params: {invoiceId: entry.payment_id}});
      window.open(routeData.href, '_blank');


    };


    return {
      state,
      payoutPreview,
      deleteEntry,
      columns,
      columnsSmall,
      deleteBulkEntry,
      formattedDate,
      handleClick


    };
  }
});
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}
</style>