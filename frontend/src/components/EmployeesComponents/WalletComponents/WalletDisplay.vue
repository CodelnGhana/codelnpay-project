<template>
  <section class="walletSection LargeOnly">


    <a-row :gutter="[16,16]" v-if="state.loading">

      <a-col span="8">

        <a-card class="usdCard" size="small" :loading="state.loading">
          <span class="currencyLabel">
            USD
          </span>


        </a-card>
      </a-col>
      <a-col span="8">
        <a-card class="euroCard" size="small" :loading="state.loading">

          <span class="currencyLabel">
            EURO
          </span>


        </a-card>
      </a-col>
      <a-col span="8">
        <a-card class="poundCard" size="small" :loading="state.loading">

          <span class="currencyLabel">
            POUND
          </span>


        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="[16,16]" v-else>

      <a-col span="8" v-if="state.usdCombo>0">

        <a-card class="usdCard" size="small" :loading="state.loading">
          <span class="currencyLabel">
            USD
          </span>

          <WalletStatistic currency="$" :amount="state.usdCombo"/>


        </a-card>
      </a-col>
      <a-col span="8" v-if="state.euroCombo>0">
        <a-card class="euroCard" size="small" :loading="state.loading">

          <span class="currencyLabel">
            EURO
          </span>


          <WalletStatistic currency="€" :amount="state.euroCombo"/>


        </a-card>
      </a-col>
      <a-col span="8" v-if="state.poundCombo>0">
        <a-card class="poundCard" size="small" :loading="state.loading">

          <span class="currencyLabel">
            POUND
          </span>


          <WalletStatistic currency="£" :amount="state.poundCombo"/>


        </a-card>
      </a-col>
    </a-row>
  </section>
  <div class="showMobile" >
    <a-row v-if="state.poundCombo>0 || state.usdCombo>0 || state.euroCombo>0">
      <a-col :flex="2" v-if="state.usdCombo>0">
        <div>
          <a-card class="usdCard" size="small" :loading="state.loading">
          <span class="currencyLabel">
            USD
          </span>


            <WalletStatistic currency="$" :amount="state.usdCombo"/>
          </a-card>
        </div>
      </a-col>
      <a-col :flex="2" v-if="state.euroCombo>0">
        <div >
          <a-card class="euroCard" size="small" :loading="state.loading">

          <span class="currencyLabel">
            EURO
          </span>

            <WalletStatistic currency="€" :amount="state.euroCombo"/>
          </a-card>
        </div>
      </a-col>
      <a-col :flex="2" v-if="state.poundCombo>0">
        <div >
          <a-card class="poundCard" size="small" :loading="state.loading">

          <span class="currencyLabel">
            POUND
          </span>


            <WalletStatistic currency="£" :amount="state.poundCombo"/>
          </a-card>
        </div>
      </a-col>

    </a-row>


  </div>


</template>

<script>
import {defineComponent, onMounted, reactive, h} from 'vue';
import WalletStatistic from "./WalletStatistic.vue";
import {useRouter} from 'vue-router';
import {useStore} from "vuex";
import WalletService from "../../../services/WalletService";
import {LoadingOutlined} from '@ant-design/icons-vue';

export default defineComponent({
  components: {WalletStatistic},
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      wallets: [],
      trulyUsd: null,
      vertoUsd: null,
      trulyEuro: null,
      vertoEuro: null,
      trulyPound: null,
      vertoPound: null,
      loading: false,
      usdCombo: null,
      euroCombo: 0,
      poundCombo: 0,


    });
    onMounted(() => {
      getMyWallets();
    });
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: '24px',
      },
      spin: true,
    });
    const getMyWallets = () => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      state.loading = true
      WalletService.getMyWallets(store.state.auth.profile['profile_slug'], auth)
          .then(resp => {
            state.wallets = resp.data;

            destructureWallets()

          });

    };
    const destructureWallets = () => {

      state.wallets.forEach(wallet => {
        if (wallet.currency === 'USD' && wallet.wallet_type === 'usd_global') {
          state.trulyUsd = wallet
          state.usdCombo += wallet.balance
        } else if (wallet.currency === 'USD' && wallet.wallet_type === 'usd_local') {
          state.vertoUsd = wallet
          state.usdCombo += wallet.balance

        } else if (wallet.currency === 'EUR' && wallet.wallet_type === 'eur_global') {
          state.trulyEuro = wallet
          state.euroCombo += wallet.balance

        } else if (wallet.currency === 'EUR' && wallet.wallet_type === 'eur_local') {
          state.vertoEuro = wallet
          state.euroCombo += wallet.balance

        } else if (wallet.currency === 'GBP' && wallet.wallet_type === 'gbp_global') {
          state.trulyPound = wallet
          state.poundCombo += wallet.balance

        } else if (wallet.currency === 'GBP' && wallet.wallet_type === 'gbp_local') {
          state.vertoPound = wallet
          state.poundCombo += wallet.balance

        }
      });
      state.loading = false

    };
    const handleClick = (path, type) => {
      router.push({
        name: path,
        params: {WalletType: type}
      });

    };
    const createWallet = () => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      let walletObj = {

        amount: 0,
        provider: 'verto',
        currency: 'GBP'

      };
      WalletService.createWallet(store.state.auth.profile['profile_slug'], walletObj, auth)
          .then();

    };

    return {
      state,
      store,
      handleClick,
      createWallet,
      indicator
    };

  }
});
</script>

<style scoped>
.walletSection {
  padding: 1%;

}

.currencyLabel {
  font-weight: bold;
}

.usdCard {
  color: white;
  background-color: #273273;
  border-radius: 4px;

}

.euroCard {
  color: white;
  background-color: #4E64A6;
  border-radius: 4px;
}

.poundCard {
  color: white;
  background-color: #829FD9;
  border-radius: 4px;
}

.showMobile {
  display: none;


}

.LargeOnly {
  display: block;
}

/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {
  .showMobile {
    display: block;
  }

  .LargeOnly {
    display: none;
  }


}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .showMobile {
    display: block;
  }

  .LargeOnly {
    display: none;
  }


}
</style>