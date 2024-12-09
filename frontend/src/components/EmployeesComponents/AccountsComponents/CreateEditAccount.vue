<template>


    <a-button type="primary" size="small" @click="showModal" style="margin-bottom: 8px">
      <template #icon>
        <PlusOutlined/>
      </template>
      New Account
    </a-button>
    <a-table :columns="columns" :data-source="state.accounts" :loading="state.loading" size="small"
             :scroll="{ x: 'max-content' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">

          <span class="capitalize">{{ record.bank_name }}</span>

        </template>
        <template v-if="column.key === 'currency'">

          <span class="capitalize">{{ record.currency }}</span>

        </template>
        <template v-if="column.key === 'account'">

          <span class="capitalize">{{ record.account_number }}</span>

        </template>

        <template v-if="column.key === 'actions'">

          <a-space>
            <div v-if="pickedAccount">
              <div v-if="pickedAccount.id ===record.id">
                <a-tag color="#87d068">Picked</a-tag>
              </div>
              <div v-else>
                <a-button v-if="showPickAccount" @click="$emit('onpickAccount',record)"
                          type="primary">
                  Pick

                </a-button>
              </div>

            </div>
            <div v-else>
              <a-button v-if="showPickAccount" @click="$emit('onpickAccount',record)" type="primary">
                Pick
              </a-button>
            </div>
            <a-button @click="EditAccount(record)">
              <template #icon>
                <EditOutlined/>
              </template>

            </a-button>


          </a-space>

        </template>
      </template>
    </a-table>



  <!--------form modal---->
  <section>
    <a-modal v-model:open="visible" title="Bank Account" :footer="null">

  <CreateEditForm  :account="state.currentAccount" @accountAdd="accountAdd"
                  @accountEdit="accountEdit" />
    </a-modal>
  </section>

</template>

<script>
import { reactive, computed, ref, onMounted, onUnmounted} from 'vue';
import AccountsService from "../../../services/AccountsService";
import {PlusOutlined, EditOutlined, ArrowLeftOutlined} from '@ant-design/icons-vue';
import {Empty} from 'ant-design-vue';
import CreateEditForm from "./CreateEditForm.vue";

import {useStore} from 'vuex';
const columns = [
  {
    title: 'Bank name',
    dataIndex: 'name',
    key: 'name',
  },

  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
  },
  {
    title: 'Account',
    dataIndex: 'account',
    key: 'account',
  },

  {
    title: 'Edit',
    dataIndex: 'actions',
    key: 'actions',
    fixed: 'right'
  },

];
export default {

  props: ['showPickAccount', 'pickedAccount'],
  emits: ['onpickAccount'],
  components: {
    PlusOutlined,
    EditOutlined,
    ArrowLeftOutlined,
    CreateEditForm
  },
  setup(props, ctx) {
    const store = useStore();
    const state = reactive({
      accounts: [],
      currentAccount: null,
      currentAccountIndex: 0,
      showAccount: false,
      loading: false,
      showManageAccount: false,
      accountEdit:false



    });

    onMounted(() => {


      state.loading = true;
      getMyAccounts();

    });




    const getMyAccounts = () => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      AccountsService.getMyAccounts(store.state.auth.profile['profile_slug'], auth)
          .then(resp => {
            state.accounts = resp.data;
            state.loading = false;
            initialViewSetup();

          })
          .catch(() => {
            state.loading = false;
            initialViewSetup();
          });
    };
    const initialViewSetup = () => {
      if (props.pickedAccount) {
        state.currentAccount = props.pickedAccount;
        state.currentAccountIndex = state.accounts.indexOf(state.currentAccount);

      }


    };

    const pagination = {
      pageSize: 5,
    };



    const accountAdd = (values) => {
      state.accounts.push(values);
      visible.value = false

    };
    const accountEdit = (values) => {

      let index = state.accounts.indexOf(state.currentAccount);
      state.accounts[index] = values;
      state.currentAccount = values;
      visible.value = false
      if (props.pickedAccount) {
        if (props.pickedAccount.id === state.currentAccount.id) {

          ctx.emit('onpickAccount', values);
        }
      }
    };

    const visible = ref(false);
    const showModal = () => {
      state.currentAccount =null
      state.accountEdit =false
      visible.value = true;
    };
    const EditAccount = (account)=>{
      visible.value = true
      state.accountEdit = true
      state.currentAccount = account

    }
    return {
      state,
      pagination,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      accountAdd,
      accountEdit,
      visible,
      showModal,
      EditAccount,
      columns
    };
  }
};
</script>

<style scoped>
.picked {
  border-color: #030852 !important;
}

.capitalize {
  text-transform: capitalize;
}
</style>