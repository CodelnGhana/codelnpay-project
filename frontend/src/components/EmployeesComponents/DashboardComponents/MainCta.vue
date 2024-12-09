<template>
  <a-card style="width: 100%;border-radius: 0" :body-style="{'padding':'0'}">
    <template #title>
      <a-space>
        <b>Hello</b>
        <span v-if="state.profile" class="capitalize">
        {{ state.profile.user.first_name }}


      </span>
      </a-space>

    </template>
    <template #extra>

      <a>
        <router-link to="/getVerified">

            <span v-if="state.profile">
              <span v-if="state.profile.verification.length>0">
                <span v-if="state.profile.verification[0].status === 'verification.completed'">
                <a-tag color="#87d068">
                <IdcardOutlined/>
              </a-tag>

              </span>
                 <span v-if="state.profile.verification[0].status !== 'verification.completed'">
                <a-tag color="#f50">
                  <IdcardOutlined/>
                </a-tag>
                Get verified
              </span>
              </span>
              <span v-else>

                <a-tag color="#f50">
                  <IdcardOutlined/>
                </a-tag>
                Get verified

              </span>





            </span>


        </router-link>

      </a>
    </template>
    <WalletDisplay/>


    <a-card class="ctacardTheme" v-if="!isMobile">
      <a-row :gutter="[8,8]">
        <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="margin-bottom: 1rem">
          <p class="Ctatitle">Send Invoice</p>
          <p>Create and send a payment request to your employer</p>
          <a-button type="primary" class="buttonbar" :block="isMobile" @click="handleClick('CreateInvoice')">
            Create Invoice
          </a-button>

        </a-col>
        <a-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
          <a-row :gutter="[8,8]">

            <a-col :xs="8" :sm="8" :md="12" :lg="8" :xl="8">
              <a-card @click="handleClick('AccountsManager')" hoverable style="margin-bottom: 1rem">
                <img alt="accounts" class="ctaimages" src="@/assets/images/props/bank.png"/>
                <p>Manage Accounts</p>
              </a-card>


            </a-col>
            <a-col :xs="8" :sm="8" :md="12" :lg="8" :xl="8">
              <a-card @click="handleClick('ManageEmployers')" hoverable style="margin-bottom: 1rem">
                <img alt="employers" class="ctaimages" src="@/assets/images/props/workers.png"/>
                <p>Manage Employers</p>
              </a-card>


            </a-col>
            <a-col :xs="8" :sm="8" :md="12" :lg="8" :xl="8">
              <a-card @click="handleClick('PaymentInvitations')" hoverable>
                <img alt="invites" class="ctaimages" src="@/assets/images/props/reciever.png"/>
                <p class="cardTitle">Payment Invitations</p>
              </a-card>


            </a-col>
          </a-row>
        </a-col>


      </a-row>

    </a-card>

    <a-row :gutter="[8,8]" v-if="isMobile" class="ctacardTheme" style="padding: 1%">
      <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" >
        <a-card title="Send Invoice">
          <p style="padding-left: 20px">Create and send a payment request to your employer</p>
          <a-button type="primary"  :block="isMobile" @click="handleClick('CreateInvoice')">
            Create Invoice
          </a-button>
        </a-card>


      </a-col>
      <a-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <a-row :gutter="[8,8]">

          <a-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
            <a-card @click="handleClick('AccountsManager')" size="small" hoverable style="text-align: center">
              <WalletOutlined />
              <br/>
              Accounts
            </a-card>


          </a-col>
          <a-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
            <a-card @click="handleClick('ManageEmployers')" size="small" hoverable style=";text-align: center">
              <UsergroupAddOutlined />
              <br/>
              Employers
            </a-card>


          </a-col>
          <a-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
            <a-card @click="handleClick('PaymentInvitations')" size="small" hoverable style="margin-bottom: 1rem;text-align: center">
              <MailOutlined />
              <br/>
              Invitations
            </a-card>


          </a-col>
          <a-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
            <a-card @click="handleClick('AllInvoices')" size="small" hoverable style="margin-bottom: 1rem;text-align: center">
              <ProfileOutlined />
              <br/>
              Invoices
            </a-card>


          </a-col>

        </a-row>
      </a-col>


    </a-row>


  </a-card>


</template>

<script>
import {defineComponent, computed, onMounted, onUnmounted, reactive, inject} from 'vue';
import {useStore} from 'vuex'
import ProfileService from "../../../services/ProfileService";
import WalletDisplay from "../WalletComponents/WalletDisplay.vue";
import {useRouter} from 'vue-router'
import {WalletOutlined,UsergroupAddOutlined,ProfileOutlined,MailOutlined,IdcardOutlined} from '@ant-design/icons-vue';
export default defineComponent({
  components: {
    WalletDisplay,
    WalletOutlined,
    UsergroupAddOutlined,
    ProfileOutlined,
    MailOutlined,
    IdcardOutlined

  },

  setup() {
    const store = useStore()
    const router = useRouter()

    const state = reactive({
      size: window.innerWidth,
      profile: null,
      profileObj:null,
      currentTheme: localStorage.getItem("theme"),
      themeVars: {},
      defaultVars: inject('defaultVars'),
      darkModeVars: inject('darkModeVars')
    })
    if (state.currentTheme === 'dark') {
      state.themeVars = state.darkModeVars
    } else {
      state.themeVars = state.defaultVars
    }


    const handleClick = (e) => {
      router.push({
        name: e
      })

    }
    onMounted(() => {
      window.addEventListener("resize", deviceWidth);
      window.addEventListener('themeChanged', (event) => {
        state.currentTheme = event.detail.storage;
        if (state.currentTheme === 'dark') {
          state.themeVars = state.darkModeVars
        } else {
          state.themeVars = state.defaultVars
        }
      });
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      let slug = store.state.auth.profile['profile_slug'];



      ProfileService.getProfile(slug, auth)
          .then(resp => {
            state.profile = resp.data;
            store.dispatch('auth/setProfileType', resp.data)
          })


    });

    onUnmounted(() => {
      window.removeEventListener("resize", deviceWidth);
    });


    const deviceWidth = (e) => {
      state.size = e.srcElement.innerWidth;
    };
    const isMobile = computed(() => {
      return state.size <= 425;
    });


    return {
      state,
      handleClick,
      refreshToken: computed(() => store.state.auth.refresh),
      accessToken: computed(() => store.state.auth.token),
      isMobile


    }

  }

});
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}

.ctacardTheme {

  width: 100%;
  border: none;
  border-radius: 0;
  background-color: v-bind(state ['themeVars'] ['dashBoard']);


}

.buttonbar {
  height: 2.8rem;
  width: 12rem;
  font-size: 1rem;


}

.Ctatitle {
  font-size: 1.7rem;
  font-family: 'Poppins', sans-serif;
  color: v-bind(state ['themeVars'] ['color']);
  margin-bottom: 5%;
  font-weight: 600;


}

.ctaimages {
  width: 15%;
  filter: v-bind(state ['themeVars'] ['filter']);
}

/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {

}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {

  .ctaimages {
    width: 20%;
  }
}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {
  .ctaimages {
    width: 20%;
  }

}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {
  .ctaimages {
    width: 20%;
  }


}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {
  .ctaimages {
    width: 20%;
  }


}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {
  .ctaimages {
    width: 18%;
    display: block;
  }


}

/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {

  .ctaimages {
    display: none;
    width: 35%;
  }

  .Ctatitle {
    font-size: 1rem;
  }


}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .ctaimages {
    display: none;
    width: 30%;
  }

  .Ctatitle {
    font-size: 1rem;
  }


}

</style>