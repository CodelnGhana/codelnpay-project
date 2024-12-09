<template>



  <a-table :columns="columns" :data-source="state.filteredData" :loading="state.loading" size="small" :scroll="{ x: 'max-content' }" >

    <template #bodyCell="{ column, record }">

      <template v-if="column.key === 'company'">

        <span class="capitalize">{{ record.employer.name }}</span>

      </template>


      <template v-else-if="column.key === 'status'">
        <!---sent triggered-->
        <a-tooltip v-if="record.status ==='sent'">
          <template #title>
            We have sent the money to your bank, you should receive it in 2 - 3 business days.
          </template>
          <a-tag color="success">{{ record.status }}</a-tag>
        </a-tooltip>
        <!---money should have to account-->
        <a-tooltip v-if="record.status ==='received'">
          <template #title>
            You ought to have received the money in your account. If not, please contact our customer service.
          </template>
          <a-tag color="blue">{{ record.status }}</a-tag>
        </a-tooltip>
        <!---issue with payment-->
        <a-tooltip v-if="record.status ==='failed'">
          <template #title>
            There is an issue with the transaction. Support should be in contact with you to resolve
          </template>
          <a-tag color="error">{{ record.status }}</a-tag>
        </a-tooltip>
        <!---start of invoice-->

        <a-tooltip v-if="record.status ==='created'">
          <template #title>Your Invoice has been sent to your employer, once we receive the payment you will be
            notified
          </template>
          <a-tag color="cyan">{{ record.status }}</a-tag>
        </a-tooltip>


      </template>
      <template v-if="column.key === 'amount'">

        <span class="capitalize">{{ record.currency }} {{ record.amount }}</span>

      </template>
      <template v-else-if="column.key === 'payout'">
        <span v-if="record.bank_account">
          <a-tag color="#288753">
            Fiat
          </a-tag>


        </span>
        <span v-else-if="record.crypto_account">
          <a-tag color="#FFCF12">
            Crypto
          </a-tag>

        </span>

      </template>
      <template v-else-if="column.key === 'date'">
        {{ formattedDate(record.created_date) }}
      </template>
      <template v-else-if="column.key === 'updated'">
        {{ formattedDate(record.modified_date) }}
      </template>

      <template v-else-if="column.key === 'Invoice'">
        <a-space>

          <a @click="showModal(record)">more</a>
<!--                    <a-button @click="deleteInvoice(record)"> delete</a-button>-->
        </a-space>


      </template>
    </template>
  </a-table>

  <a-drawer
      v-model:open="state.visible"
      class="custom-class"
      :size="isMobile"
      placement="right"

  >
    <a-card >
      <InvoicePreview :invoice="state.currentInvoice"/>


      <!------status--->
      <div>
        <p class="ant-descriptions-title">
          Status
        </p>
        <p v-if="state.currentInvoice.status==='created'">
          Your Invoice has been sent to your employer, once we receive the payment you will be notified.
        </p>
        <p v-if="state.currentInvoice.status==='sent'">
          We have sent the money to your bank, you should receive it in 2 - 3 business days.
        </p>
        <p v-if="state.currentInvoice.status==='received'">
          You ought to have received the money in your account. If not, please contact our customer service.
        </p>
      </div>

      <div>
        <p class="ant-descriptions-title">
          Invoice link
        </p>



        <p>We have sent this Invoice Link to your employer but you can also send it for a remainder.</p>
        <div v-if="state.currentInvoice.bank_account">
          <a :href="`${state.baseUrl}/Invoice/${state.currentInvoice.invoice_id}`" target="_blank">Invoice Link</a>
        </div>
        <div v-else-if="state.currentInvoice.crypto_account">
          <a-spin v-if="state.templateLoad"/>
          <div v-else>
            <!--          <a :href="state.templateUrl.eukapay_inv_url" target="_blank">Invoice Link</a>-->

            <a :href="state.secondTemplate.eukapay_template_url" target="_blank">Invoice Link</a>


          </div>
        </div>

      </div>
    </a-card>

  </a-drawer>


</template>

<script>

import {reactive, watch, onMounted, onUnmounted, computed} from 'vue';
import InvoiceService from "../../../services/InvoiceService";
import {useStore} from 'vuex';
import {DownloadOutlined} from '@ant-design/icons-vue';
import InvoicePreview from "./InvoicePreview.vue";
import CryptoWalletsService from "../../../services/CryptoWalletsService";

const columns = [
  {
    title: 'Company',
    dataIndex: 'company',
    key: 'company',
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
    title: 'Payout',
    dataIndex: 'payout',
    key: 'payout',
  },
  {
    title: 'Issue Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Updated ',
    dataIndex: 'updated',
    key: 'updated',
  },

  {
    title: 'Invoice',
    key: 'Invoice',
    fixed: 'right'
  }
];

export default {
  props: ['company', 'account'],
  components: {DownloadOutlined, InvoicePreview},

  emits: ['companiesList'],


  setup(props, ctx) {
    const store = useStore();

    const state = reactive({
      visible: false,
      currentInvoice: null,
      data: [],
      filteredData: [],
      companyNames: [],
      size: window.innerWidth,
      baseUrl: import.meta.env.VITE_APP_BASE_URL,
      loading: false,
      templateLoad: false,
      templateUrl: '',
      secondTemplate:''

    });
    onMounted(() => {
      state.loading = true;
      window.addEventListener("resize", devicewidth);
      getMyInvoices();


    });
    onUnmounted(() => {
      window.removeEventListener("resize", devicewidth);
    });
    const devicewidth = (e) => {
      state.size = e.srcElement.innerWidth;
    };
    const isMobile = computed(() => {
      if (state.size <= 425) {
        return ('default');

      } else {
        return ('large');
      }

    });
    const getMyInvoices = () => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      InvoiceService.getMyInvoices(store.state.auth.profile['profile_slug'], auth)
          .then(resp => {
            state.data = resp.data;
            state.loading = false;
            state.data.sort(function(a,b){

              return new Date(b.created_date) - new Date(a.created_date);
            });
            initialSetup();
          })
          .catch(() => {
            state.loading = false;
          });

    };
    const initialSetup = () => {
      let allcompaniesNoUnique = [];

      state.data.forEach(invoice => {

        allcompaniesNoUnique.push(invoice.employer.name);
      });


      let uniqueNames = [...new Set(allcompaniesNoUnique)];

      uniqueNames.forEach(companyName => {
        let searchObj = {
          value: '',
          label: ''
        };
        searchObj.value = companyName;
        searchObj.label = companyName;
        state.companyNames.push(searchObj);

      });

      ctx.emit('companiesList', state.companyNames);
      if (props.company) {

        filteredCompanyDataFunction(props.company);
      } else if (props.account) {
        filteredAccountsDataFunction(props.account);
      } else {
        state.filteredData = state.data;
      }

    };


    watch(() => (props.company), (newValues) => {

      if (newValues) {
        filteredCompanyDataFunction(newValues);
      } else {
        state.filteredData = state.data;
      }


    });
    watch(() => (props.account), (newValues) => {

      if (newValues) {
        filteredAccountsDataFunction(newValues);
      } else {
        state.filteredData = state.data;
      }


    });

    const filteredCompanyDataFunction = ((value) => {
      state.filteredData = [];

      state.data.forEach(invoice => {
        if (invoice.employer.name === value) {
          state.filteredData.push(invoice);

        }
      });


    });
    const filteredAccountsDataFunction = ((value) => {

      state.filteredData = [];

      state.data.forEach(invoice => {
        if (invoice.bank_account.account_number === value) {
          state.filteredData.push(invoice);

        }
      });


    });

    const showModal = (invoice) => {
      state.visible = true;
      state.currentInvoice = invoice;
      if (invoice.crypto_account) {
        state.templateLoad = true;
        getCryptoPaymentTemplate(invoice)

      }
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
    const deleteInvoice = (invoice) => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      InvoiceService.deleteInvoice(store.state.auth.profile['profile_slug'], invoice.id, auth)
          .then(() => {
            const index = state.filteredData.indexOf(invoice);
            if (index > -1) {
              state.filteredData.splice(index, 1);
            }

          });
    };
    const formattedDate = (unformatedDate) => {
      let date = new Date(unformatedDate);
      return (date.toLocaleDateString('default', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}));


    };


    return {
      state,
      showModal,
      isMobile,
      columns,
      deleteInvoice,
      formattedDate


    };
  }
};
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}
</style>