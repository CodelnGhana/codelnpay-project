<template>
  <section>

    <!------ wallets ----->
    <a-button type="primary" size="small" @click="showModal" style="margin-bottom: 8px">
      <template #icon>
        <PlusOutlined/>
      </template>
      New Wallet
    </a-button>

    <a-table :columns="columns" :data-source="state.wallets" :loading="state.loading" size="small"
             :scroll="{ x: 'max-content' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'coin'">

          <span class="capitalize">{{ record.coin }}</span>

        </template>
        <template v-if="column.key === 'address'">

          <span class="capitalize">{{ record.wallet_address }}</span>

        </template>
        <template v-if="column.key === 'actions'">

          <a-space>
            <div v-if="pickedWallet">
              <div v-if="pickedWallet.id ===record.id">
                <a-tag color="#87d068">picked</a-tag>
              </div>
              <div v-else>
                <a-button v-if="showPickWallet" @click="$emit('onPickWallet',record)"
                          type="primary">
                  Pick
                  Wallet
                </a-button>
              </div>

            </div>
            <div v-else>
              <a-button v-if="showPickWallet" @click="$emit('onPickWallet',record)" type="primary">
                Pick
                Wallet
              </a-button>
            </div>
            <a-button @click="EditWallet(record)">
              <template #icon>
                <EditOutlined/>
              </template>

            </a-button>


          </a-space>

        </template>
      </template>
    </a-table>


  </section>
  <!--------form modal---->
  <section>
    <a-modal v-model:open="visible" title="Crypto Account" :footer="null">

      <a-form

          :model="formState"
          name="wallet"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
      >
        <a-form-item
            label="Coin"
            name="coin"
            :rules="[{ required: true, message: 'Please pick wallet coin!' }]"
            :label-col="{span:24}"
            :wrapper-col="{ span: 24 }"
        >
          <a-select v-model:value="formState.coin">
            <a-select-option value="USDC">USDC</a-select-option>
            <a-select-option value="Tether-USDT">Tether-USDT</a-select-option>
          </a-select>

        </a-form-item>

        <a-form-item
            label="Wallet Address"
            name="wallet_address"
            :rules="[{ required: true, message: 'Please input  wallet address for the coin!' }]"
            :label-col="{span:24}"
            :wrapper-col="{ span: 24 }"
        >

          <a-input v-model:value="formState.wallet_address"/>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :disabled="disabled" :loading="state.saving">Submit</a-button>
        </a-form-item>
      </a-form>
    </a-modal>

  </section>
</template>

<script>
const columns = [
  {
    title: 'Coin',
    dataIndex: 'coin',
    key: 'coin',
  },

  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    fixed: 'right'
  },

];
import {defineComponent, reactive, computed, ref, onMounted, onUnmounted} from 'vue';
import {Empty, message} from 'ant-design-vue';
import {PlusOutlined, EditOutlined, ArrowLeftOutlined} from '@ant-design/icons-vue';
import {useStore} from 'vuex';
import CryptoWalletsService from "../../../services/CryptoWalletsService";

export default defineComponent({
  props: ['showPickWallet', 'pickedWallet'],
  emits: ['onPickWallet'],
  components: {
    PlusOutlined,
    EditOutlined
  },
  setup(props, ctx) {

    const store = useStore();
    const state = reactive({
      showForm: false,
      saving: false,
      loading: true,
      wallets: [],
      walletEdit: false,
      currentEditWallet: null,


    });
    let formState = reactive({
      coin: undefined,
      wallet_address: undefined,


    });
    onMounted(() => {


      state.loading = true;
      getMyWallets();

    });
    const getMyWallets = () => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      CryptoWalletsService.getMyCryptoWallet(store.state.auth.profile['profile_slug'], auth)
          .then(resp => {
            state.wallets = resp.data;
            state.loading = false;


          })
          .catch(() => {
            state.loading = false;
          });
    };


    const visible = ref(false);
    const showModal = () => {
      formState.coin = undefined;
      formState.wallet_address = undefined;
      state.currentEditWallet = null;
      state.walletEdit = false;
      visible.value = true;
    };
    const onFinish = values => {
      state.saving = true;
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      if (state.walletEdit) {
        CryptoWalletsService.updateCryptoWallet(store.state.auth.profile['profile_slug'], state.currentEditWallet.id, values, auth)
            .then((resp) => {
              message.success('Wallet details saved');
              state.currentEditWallet.coin = resp.data.coin;
              state.currentEditWallet.wallet_address = resp.data.wallet_address;
              state.saving = false;
              visible.value = false;
              state.currentEditWallet = null;
              state.walletEdit = false;
            })
            .catch(() => {
              state.saving = false;
              visible.value = false;
              state.currentEditWallet = null;
              state.walletEdit = false;
            });
      } else {
        CryptoWalletsService.createCryptoWallet(store.state.auth.profile['profile_slug'], values, auth)
            .then(resp => {
              message.success('New wallet created');
              state.wallets.push(resp.data);
              state.saving = false;
              visible.value = false;
            })
            .catch(() => {
              state.saving = false;
              visible.value = false;
            });
      }

    };
    const onFinishFailed = errorInfo => {
      return errorInfo;
    };
    const pagination = {
      pageSize: 5,
    };
    const EditWallet = (wallet) => {
      visible.value = true;
      state.walletEdit = true;
      state.currentEditWallet = wallet;
      formState = Object.assign(formState, wallet);
    };
    const disabled = computed(() => {
      return !(
          formState.coin
          && formState.wallet_address


      );
    });

    return {
      state,
      formState,
      disabled,
      visible,
      showModal,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      onFinish,
      onFinishFailed,
      pagination,
      EditWallet,
      columns
    };
  }
});
</script>

<style scoped>

</style>