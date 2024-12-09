<template>
  <a-card title="Payment Invitations"  class="mobileMargin">



    <div >
      <a-alert
          message="Payout will only be made when you are verified and have inputed your bank."
          type="warning" style="margin-bottom: 1rem"/>
      <a-table :columns="columns" :data-source="state.invitations" size="small" :scroll="{ x: 'max-content' }" :loading="state.loading">


        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'company'">

            <span class="capitalize">{{ record.employer.company }}</span>

          </template>
          <template v-if="column.key === 'amount'">

            <span>{{ record.currency }} {{ record.amount }}</span>

          </template>
          <template v-if="column.key === 'reason'">

            <span>{{ record.reason }}</span>

          </template>

          <template v-else-if="column.key === 'status'">

            <!---sent triggered-->
            <a-tooltip v-if=" record.status && record.status ==='sent'">
              <template #title>
                We have sent the money to your bank, you should receive it in 2 - 3 business days.
              </template>
              <a-tag color="success">{{ record.status }}</a-tag>
            </a-tooltip>
            <!---money should have to account-->
            <a-tooltip v-if=" record.status && record.status ==='received'">
              <template #title>
                You ought to have received the money in your account. If not, please contact our customer service.
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
            <a-tooltip v-if=" record.status && record.status ==='created'">
              <template #title>Awaiting Sender to deposit</template>
              <a-tag color="cyan">{{ record.status }}</a-tag>
            </a-tooltip>

          </template>
          <template v-if="column.key === 'kyc'">

          <span v-if="state.profile.verification.length>0">
                <span v-if="state.profile.verification[0].status === 'verification.completed'">
                <a-tag color="#87d068">
                Verified
              </a-tag>

              </span>
                 <span v-if="state.profile.verification[0].status !== 'verification.completed'">
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
          <template v-if="column.key === 'account'">
          <span v-if="record.employee_bank_account">
             <a-tag color="#87d068">
                Provided
              </a-tag>

          </span>
            <span v-else>
            <a-tag color="#f50">
                  Required
            </a-tag>

          </span>
          </template>

          <template v-else-if="column.key === 'manage'">
            <a-button type="primary" @click="showDrawer(record)">Manage</a-button>

          </template>
        </template>
      </a-table>
    </div>
    <a-drawer
        v-model:open="state.visible"
        class="custom-class"
        :size="isMobile"
        placement="right"
        title="Manage Invite"

    >
      <section>
        <div>
          <p>Company wanting to remit to you</p>

          <p>Company: {{ state.currentInvite.employer.company }}</p>
          <p>Email: {{ state.currentInvite.employer.user.email }}</p>
          <p>Date issued: {{ formattedDate(state.currentInvite.created_date )}}</p>
        </div>

        <!---table title--->
        <a-row>

          <a-col span="12">
            <a-card size="small" class="cardTitle">
              Reason
            </a-card>

          </a-col>
          <a-col span="12">
            <a-card size="small" class="cardTitle">
              Amount
            </a-card>

          </a-col>

        </a-row>
        <!---table data--->
        <a-row style="margin-bottom: 1rem">

          <a-col span="12">
            <a-card size="small" class="cardTitle2">
              {{ state.currentInvite.reason }}
            </a-card>

          </a-col>
          <a-col span="12">
            <a-card size="small" class="cardTitle2">
              {{ state.currentInvite.currency }} {{ state.currentInvite.amount }}
            </a-card>

          </a-col>

        </a-row>
      </section>
      <a-divider/>


      <div>

        <h3 style="font-weight: bold">Requirement to fulfil</h3>
        <section v-if="!state.currentInvite.employee_ref.employee_ref">

          <p>First You have to accept the payment Invitation from this sender to continue</p>
          <a-button type="primary" @click="AcceptInvite(state.currentInvite.employee_ref)" :loading="state.saving">
            Accept Invite
          </a-button>
        </section>
        <section v-else>
          <section>
            <p>
              KYC Status
            </p>
            <p>
              <router-link to="/getVerified">

            <span v-if="state.profile">
              <span v-if="state.profile.verification.length>0">
                <span v-if="state.profile.verification[0].status === 'verification.completed'">
                <a-tag color="#87d068">
                Verified
              </a-tag>

              </span>
                 <span v-if="state.profile.verification[0].status !== 'verification.completed'">
                <a-tag color="#f50">
                  Unverified
                </a-tag>
                Get verified
              </span>
              </span>
              <span v-else>

                <a-tag color="#f50">
                  Unverified
                </a-tag>
                Get verified

              </span>

            </span>
              </router-link>
            </p>

          </section>

          <section>
            <p style="font-weight: bold">Recieving Bank Account</p>
            <div v-if="state.currentInvite.employee_bank_account">
              <p>Currency: {{ state.currentInvite.employee_bank_account.currency }}</p>
              <p>Account Holder Name: {{ state.currentInvite.employee_bank_account.account_name }}</p>
              <p>Account Holder Number: {{ state.currentInvite.employee_bank_account.account_number }}</p>
              <p>Bank Name: {{ state.currentInvite.employee_bank_account.bank_name }}</p>
            </div>
            <div v-else>
              <p>Pick Bank Account where Money will be deposited</p>

              <div v-if="state.currentAccounts.length>0">
                <a-list size="small"
                        :data-source="state.currentAccounts" :pagination="pagination"
                >
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-card size="small" :title="item.bank_name"
                              style="width: 100%"
                      >
                        <template #extra>
                          <a-popconfirm
                              title="Are you sure pick this account?"
                              ok-text="Yes"
                              cancel-text="No"
                              @confirm="confirmAccount(item)"

                          >
                            <a-button type="primary">Pick</a-button>
                          </a-popconfirm>


                        </template>


                        Account: {{ item.account_number }}
                        <br/>
                        Currency: {{ item.currency }}


                      </a-card>
                    </a-list-item>
                  </template>
                  <template #header>
                    <router-link to="/AccountsManager">
                      <a-button type="primary">
                        <template #icon>
                          <PlusOutlined/>
                        </template>
                        New Account
                      </a-button>
                    </router-link>
                  </template>
                </a-list>


              </div>
              <div v-else>
                <a-empty style="text-align: start"
                         image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                         :image-style="{ height: '60px',}"
                >
                  <template #description>
                    <router-link to="/AccountsManager">
                      <a-button type="primary">
                        <template #icon>
                          <PlusOutlined/>
                        </template>
                        New Account
                      </a-button>
                    </router-link>
                  </template>

                </a-empty>


              </div>
            </div>
          </section>
        </section>


      </div>


    </a-drawer>


  </a-card>
</template>

<script>
import {defineComponent, reactive, onMounted, onUnmounted, computed} from 'vue';
import {useStore} from 'vuex';
import PaymentService from "../../../services/PaymentService";
import ProfileService from "../../../services/ProfileService";
import EmployersService from "../../../services/EmployersService";
import AccountsService from "../../../services/AccountsService";
import {PlusOutlined} from '@ant-design/icons-vue';

const columns = [
  {
    title: 'Company',
    dataIndex: 'company',
    key: 'company',
  },

  {
    title: 'Amount ',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Reason',
    dataIndex: 'reason',
    key: 'reason',
  },
  {
    title: 'Payment Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'KYC Verification ',
    dataIndex: 'kyc',
    key: 'kyc',
  },
  {
    title: 'Bank Account ',
    dataIndex: 'account',
    key: 'account',
  },

  {
    title: 'Manage Invite',
    key: 'manage',
    fixed: 'right'
  }
];
export default defineComponent({
  components: {
    PlusOutlined
  },
  setup() {

    const store = useStore();
    const state = reactive({
      invitations: [],
      loading: false,
      profile: null,
      size: window.innerWidth,
      visible: false,
      currentInvite: null,
      saving: false,
      accounts: [],
      currentAccounts:[]

    });
    onMounted(() => {
      state.loading = true;
      window.addEventListener("resize", devicewidth);
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      ProfileService.getProfile(store.state.auth.profile['profile_slug'], auth)
          .then(resp => {
            state.profile = resp.data;
            getMyInvitations();
          })
          .catch(() => {
            state.loading = false;
          });


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
    const getMyInvitations = () => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };

      PaymentService.getMyInvitations(state.profile.user.email, auth)
          .then(resp => {

            state.invitations = resp.data.payments;
            state.loading = false;
            getMyAccounts();

          })
          .catch(() => {
            state.loading = false;
          });

    };
    const getMyAccounts = () => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      AccountsService.getMyAccounts(store.state.auth.profile['profile_slug'], auth)
          .then(resp => {
            state.accounts = resp.data;



          })
          .catch(() => {


          });
    };
    const showDrawer = (invite) => {
      state.visible = true;
      state.currentAccounts = [];

      state.currentInvite = invite;
      if(state.currentInvite.provider ==='truly'){
        state.accounts.forEach(account=>{
          if(account.currency ==='USD' || account.currency ==='EUR' || account.currency ==='GBP'){
            state.currentAccounts.push(account)
          }
        })
      }else if(state.currentInvite.provider ==='verto'){
        state.accounts.forEach(account=>{
          if(account.currency !=='USD' && account.currency !=='EUR' && account.currency !=='GBP'){
            state.currentAccounts.push(account)
          }
        })

      }
    };
    const AcceptInvite = (employee) => {
      state.saving = true;
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}
      };




      EmployersService.patchEmployee(state.currentInvite.employer.profile_slug, state.currentInvite.employee_ref.id, {employee_ref: state.profile.profile_slug}, auth)
          .then(() => {
            employee.employee_ref = state.profile;

            state.saving = false;
          })
          .catch(() => {

            state.saving = false;
          });


    };
    const confirmAccount = account => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}
      };


      PaymentService.patchPayment(state.currentInvite.employer.profile_slug,state.currentInvite.payment_id,{bank_id:account.id},auth)
          .then(() => {
            state.currentInvite.employee_bank_account = account;
            state.saving = false
          })
          .catch(()=>{
            state.saving =false
          })

    };
    const formattedDate = (unformatedDate)=>{
      let date = new Date(unformatedDate)
      return (date.toLocaleDateString('default', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}))


    }
    const pagination = {
      pageSize: 5,
    };
    return {
      store,
      state,
      columns,
      pagination,
      showDrawer,
      isMobile,
      AcceptInvite,
      confirmAccount,
      formattedDate
    };

  }

});
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}

.cardTitle {
  background: #D3D9EB;
  border-radius: 0;
  border: none;
}

.cardTitle2 {

  border-radius: 0;
  height: 100%;

}
</style>