<template>
  <a-card title="Manage Balances" :body-style="{'padding':'0'}">
    <a-card style="background: #F1F4FF;width: 100%;">

      <a-row :gutter="[16,16]">
        <a-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">


          <a-card hoverable size="small"
                  v-bind:class="{'activeWallet':state.activeWallet === 'Global'}"
                  @click="changeWallet('Global')"
          >

            <p class="currencyLabel">
              Global
              <a-tag v-if="state.activeWallet === 'Global'" color="#87d068">Active</a-tag>
            </p>
            <span class="ant-statistic-content" style="font-size: 1rem"
                  v-bind:class="{'statColor':state.activeWallet === 'Global'}">
          Balance: {{ state.currency }} {{ state.global.balance }}
        </span>
            <br/>
            <span>
          {{ state.walletType }} to {{ state.walletType }} account
        </span>


          </a-card>

        </a-col>
        <a-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">

          <a-card hoverable size="small"
                  v-bind:class="{'activeWallet':state.activeWallet === 'Local'}"
                  @click="changeWallet('Local')"
          >

            <p class="currencyLabel">
              Local
              <a-tag v-if="state.activeWallet === 'Local'" color="#87d068">Active</a-tag>
            </p>
            <span class="ant-statistic-content" style="font-size: 1rem"
                  v-bind:class="{'statColor':state.activeWallet === 'Local'}">
          Balance: {{ state.currency }} {{ state.local.balance }}
        </span>
            <br/>
            {{ state.walletType }} to local account


          </a-card>
        </a-col>
      </a-row>
    </a-card>

    <a-card>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="Withdraw">


          <div v-if="state.activeWallet ==='Global'">
            <GlobalForm
                v-if="state.global.balance>0"
                :wallet="state.global"
                :accountsLoading="state.accountsLoading"
                :accounts="state.globalAccounts"
                @onEnterAmount="onChangeWithdrawAmount"
                @onPickAccount="onPickBankAccount"
                @onCreateWithdraw="onCreateWithdraw"

            />
            <a-empty v-else
                     image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                     :image-style="{ height: '60px',}">
              <template #description>
                <span>
                  No Available Balance
                </span>
              </template>

            </a-empty>


          </div>
          <div v-if="state.activeWallet ==='Local'">
            <LocalForm
                v-if="state.local.balance>0"
                :wallet="state.local"
                :accounts="state.localAccounts"
                @onEnterAmount="onChangeWithdrawAmount"
                @onPickAccount="onPickBankAccount"
                @onForexAmountChange="onChangeForexAmount"
                @onForexCurrencyChange="onForexCurrencyChange"
                @onCreateWithdrawLocal="onCreateWithdrawLocal"

            />
            <a-empty v-else
                image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                :image-style="{ height: '60px',}">
              <template #description>
                <span>
                  No Available Balance
                </span>
              </template>

            </a-empty>


          </div>


        </a-tab-pane>
        <a-tab-pane key="2" tab="Transactions" force-render>

          <WalletTransactions :wallet="state.activeWalletObj"/>
        </a-tab-pane>

      </a-tabs>


    </a-card>


  </a-card>
</template>

<script>


import {defineComponent, onMounted, reactive, ref} from 'vue';
import WalletStatistic from "./WalletStatistic.vue";
import {useRouter} from 'vue-router';
import AccountsService from "../../../services/AccountsService";
import {useStore} from "vuex";

import GlobalForm from "./WithdrawForms/GlobalForm.vue";
import LocalForm from "./WithdrawForms/LocalForm.vue";
import WalletService from "../../../services/WalletService";
import WalletTransactions from "./WalletTransactions.vue";

export default defineComponent({
  components: {

    WalletStatistic,
    GlobalForm,
    LocalForm,
    WalletTransactions
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      activeWallet: 'Global',
      activeWalletObj: undefined,
      currency: '',
      local: 0,
      global: 0,
      walletType: router.currentRoute.value.params.WalletType,
      accounts: [],
      globalAccounts: [],
      localAccounts: [],
      pickedAccount: undefined,
      withdrawAmount: 0,
      changedAmount: 0,
      forexCurrency: null,
      trulyUsd: null,
      vertoUsd: null,
      trulyEuro: null,
      vertoEuro: null,
      trulyPound: null,
      vertoPound: null,
      accountsLoading: false
    });


    onMounted(() => {
      state.accountsLoading = true;


      getMyWallets();


    });
    const getMyWallets = () => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      WalletService.getMyWallets(store.state.auth.profile['profile_slug'], auth)
          .then(resp => {
            state.wallets = resp.data;
            destructureWallets();

          });

    };
    const destructureWallets = () => {
      state.wallets.forEach(wallet => {
        if (wallet.currency === 'USD' && wallet.wallet_type === 'usd_global') {
          state.trulyUsd = wallet;
        } else if (wallet.currency === 'USD' && wallet.wallet_type === 'usd_local') {
          state.vertoUsd = wallet;

        } else if (wallet.currency === 'EUR' && wallet.wallet_type === 'eur_global') {
          state.trulyEuro = wallet;

        } else if (wallet.currency === 'EUR' && wallet.wallet_type === 'eur_local') {
          state.vertoEuro = wallet;

        } else if (wallet.currency === 'GBP' && wallet.wallet_type === 'gbp_global') {
          state.trulyPound = wallet;

        } else if (wallet.currency === 'GBP' && wallet.wallet_type === 'gbp_local') {
          state.vertoPound = wallet;

        }
      });
      localGlobalAssignment();


    };
    const localGlobalAssignment = () => {
      if (state.walletType === 'USD') {
        state.currency = '$';
        state.local = state.vertoUsd;
        state.global = state.trulyUsd;


      } else if (state.walletType === 'EURO') {
        state.currency = '€';
        state.local = state.vertoEuro;
        state.global = state.trulyEuro;

      } else if (state.walletType === 'POUND') {
        state.currency = '£';
        state.local = state.vertoPound;
        state.global = state.trulyPound;


      }
      state.activeWalletObj = state.global;
      getMyAccounts();

    };
    const getMyAccounts = () => {
      state.accountsLoading = true;
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      AccountsService.getMyAccounts(store.state.auth.profile['profile_slug'], auth)
          .then(resp => {
            state.accounts = resp.data;
            state.accountsLoading = false;
            state.loading = false;
            separateAccounts();


          })
          .catch(() => {
            state.loading = false;

          });
    };
    const separateAccounts = () => {


      state.accounts.forEach(account => {
        if (account.currency === 'USD' || account.currency === 'EURO' || account.currency === 'GBP') {

          if (account.currency === state.walletType) {
            let accountTemplate = {
              value: account.id,
              label: `${account.bank_name} : ${account.account_number}`,
            };
            state.globalAccounts.push(accountTemplate);


          }

        } else {

          state.localAccounts.push(account);
        }
      });
    };
    const changeWallet = (wallet) => {
      if (state.activeWallet !== wallet) {
        state.activeWallet = wallet;
        state.pickedAccount = undefined;
        state.withdrawAmount = null;
      }
      if (state.activeWallet === 'Global') {
        state.activeWalletObj = state.global;
      } else {
        state.activeWalletObj = state.local;
      }
    };
    const onPickBankAccount = value => {
      if (value) {
        state.accounts.forEach(account => {
          if (account.id === value) {
            state.pickedAccount = account;
          }
        });
      } else {

        state.pickedAccount = undefined;
        separateAccounts();
      }


    };
    const onChangeWithdrawAmount = value => {
      state.withdrawAmount = value;

    };
    const handleWithdrawAmountChange = () => {
      if (state.activeWallet === 'Local') {
        state.changedAmount = state.withdrawAmount * state.exchangeRate;
      }


    };
    const onChangeForexAmount = value => {
      state.changedAmount = value;

    };
    const onForexCurrencyChange = value => {
      state.forexCurrency = value;

    };
    const onCreateWithdraw = value => {
      state.global.balance = value;
      onReset();
    };
    const onCreateWithdrawLocal = value => {
      state.local.balance = value;
      onReset();
    };
    const onReset = () => {
      state.globalAccounts = [];
      state.localAccounts = [];
      getMyAccounts();

    };


    return {
      activeKey: ref('1'),
      state,
      changeWallet,
      onPickBankAccount,
      onChangeForexAmount,
      handleWithdrawAmountChange,
      onChangeWithdrawAmount,
      onForexCurrencyChange,
      onCreateWithdraw,
      onReset,
      onCreateWithdrawLocal
    };
  }
});
</script>

<style scoped>
.currencyLabel {
  font-weight: bold;
}

.activeWallet {

  background-color: #4E64A6;
  color: white;
}

.statColor {
  color: white;
}

.usdCard {
  color: white;
  background-color: #273273;
}

.euroCard {
  color: white;
  background-color: #4E64A6;
}

.poundCard {
  color: white;
  background-color: #829FD9;
}
</style>