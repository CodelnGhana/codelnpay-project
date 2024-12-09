<template>
  <a-card title="Create Invoice"  class="mobileMargin">
    <section>
      <a-steps :current="current" size="small" progress-dot v-if="!isMobile">
        <a-step v-for="item in steps" :key="item.title" :title="item.title"/>
      </a-steps>


      <section class="steps-content">
        <div v-if="current===0">
          <section>
            <a-row>
              <a-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
                <a-form
                    :model="formState"
                    name="basic"
                    :label-col="{ span: 24 }"
                    :wrapper-col="{ span: 24 }"
                    autocomplete="off"
                    @finish="onFinish"
                    @finishFailed="onFinishFailed"
                >
                  <a-form-item
                      label="Amount (min 500, max 10000)"
                      name="amount"
                      v-bind="validateInfos.amount"

                  >
                    <a-input-group compact>
                      <a-select v-model:value="formState.currency">
                        <a-select-option value="USD">USD</a-select-option>
                        <a-select-option value="EURO">EURO</a-select-option>
                        <a-select-option value="GBP">GBP</a-select-option>
                      </a-select>
                      <a-input-number style="width: 70%" v-model:value="formState.amount" min="500"
                                      max="10000"/>
                    </a-input-group>




                  </a-form-item>
                  <a-form-item
                      label="Who will you cover the transaction fee? You or the Employer?"
                      name="reason"
                      v-bind="validateInfos.fee"
                  >
                    <a-form-item name="remember" no-style>
                      <a-select v-model:value="formState.fee">
                        <a-select-option value="employer">Employer will pay for it</a-select-option>
                        <a-select-option value="employee">I will - Deduct fee from my final amount</a-select-option>

                      </a-select>
                    </a-form-item>

                  </a-form-item>

                  <a-form-item
                      label="Reason for fund request  (we only process salary payments)"
                      name="reason"
                      v-bind="validateInfos.reason"

                  >
                    <a-select v-model:value="formState.reason">
                      <a-select-option value="payroll">Payroll</a-select-option>
                      <a-select-option value="freelancer">Freelancer payment</a-select-option>
                      <a-select-option value="allowances">Allowances</a-select-option>
                    </a-select>


                  </a-form-item>
                  <a-form-item
                      label="How do want to cash out your money"
                      name="cashOutOption"
                      v-bind="validateInfos.cashOutOption"

                  >
                    <a-select v-model:value="formState.cashOutOption">
                      <a-select-option value="fiat">Fiat</a-select-option>
                      <a-select-option value="crypto">Crypto - I have a crypto wallet.</a-select-option>
                    </a-select>


                  </a-form-item>


                </a-form>


              </a-col>
            </a-row>
          </section>


        </div>
        <div v-if="current===1">


          <p v-if="state.companyError" style="color:red;">Please pick employer or create one</p>

          <CreateEditPick :showPick="true" :pickedCompany="state.company" @onpickCompany="onPickCompany"/>

        </div>
        <div v-if="current===2 ">

          <div v-if="formState.cashOutOption==='fiat'">

            <p v-if="state.bankError" style="color:red;">Please pick Account or create one</p>
            <CreateEditAccount :showPickAccount="true" :pickedAccount="state.bankAccount"
                               @onpickAccount="onPickBankAccount"/>
          </div>
          <div v-else-if="formState.cashOutOption==='crypto'">

            <p v-if="state.walletError" style="color:red;">Please pick Wallet or create one</p>
            <CryptoAccountsManager :showPickWallet="true" :pickedWallet="state.wallet"
                                   @onPickWallet="onPickWallet"/>

          </div>


        </div>
        <div v-if="current===3">
          <section>


            <div>
              <p class="ant-descriptions-title">
                Invoice To
              </p>
              <p>Company: {{ state.company.name }}</p>
              <p>Email: {{ state.company.company_email }}</p>

            </div>

            <!---table title--->
            <a-row>
              <a-col span="10">
                <a-card size="small" class="cardTitle">
                  Recipient
                </a-card>

              </a-col>

              <a-col span="7">
                <a-card size="small" class="cardTitle">
                  Amount
                </a-card>

              </a-col>
              <a-col span="7">
                <a-card size="small" class="cardTitle">
                  Charges :
                  <span v-if="formState.fee ==='employee'">
                    Deduct fee from my final amount
                  </span>
                  <span v-else>
                    Employer will pay for it
                  </span>

                </a-card>

              </a-col>
            </a-row>
            <!---table data--->
            <a-row>
              <a-col span="10">
                <a-card size="small" class="cardTitle2">
                  <span class="capitalize">{{ state.profile.user.first_name }} {{ state.profile.user.last_name }}</span>
                </a-card>

              </a-col>

              <a-col span="7">
                <a-card size="small" class="cardTitle2">
                  {{ formState.currency }}{{ formState.amount }}
                </a-card>

              </a-col>
              <a-col span="7">
                <a-card size="small" class="cardTitle2">

                  {{ formState.currency }}
                  {{ Number(formState.amount) / 100 }}

                </a-card>

              </a-col>
            </a-row>
            <!---table total--->
            <a-row>
              <a-col :span="7" :offset="17">
                <a-card size="small" class="cardTitle">
                  Total: {{ formState.currency }}
                  <span v-if="formState.fee ==='employee'">
                    {{ Number(formState.amount) * 99 / 100 }}
                  </span>
                  <span v-else>
                    {{ Number(formState.amount) * 101 / 100 }}
                  </span>


                </a-card>
              </a-col>
            </a-row>
            <div v-if="formState.cashOutOption==='fiat' && state.bankAccount">
              <p class="ant-descriptions-title">
                Receiving Account
              </p>

              <p>Account Name: {{ state.bankAccount.account_name }}</p>
              <p>Account Number: {{ state.bankAccount.account_number }}</p>
              <p>Bank Name: {{ state.bankAccount.bank_name }} </p>
              <p>Country: {{ state.bankAccount.country }}</p>
              <p>BIC/Swift Code: {{ state.bankAccount.swift_code }}</p>
            </div>
            <div v-else-if="formState.cashOutOption==='crypto' && state.wallet">
              <p class="ant-descriptions-title">
                Receiving Wallet
              </p>
              <p>Coin: {{ state.wallet.coin }}</p>
              <p>Wallet Address: {{ state.wallet.wallet_address }}</p>

            </div>

            <div>
              <p>Please note the following before you send the invoice.</p>
              <ul>
                <li>
                  The invoice is immediately sent to the employer once you click submit,
                  please ensure all details are correct.

                </li>
                <li>
                  You will receive your payments within 2 - 3 business days AFTER we receive the money
                  from your employer. You can track the status from your dashboard.


                </li>
                <li>
                  We only charge a fixed fee 1%  on the amount you want to receive.
                  Our charges do not cover offshore charges or SWIFT charges, your bank might have other charges
                  attached.

                </li>
                <li>
                  In accordance with federal compliance, you must be verified before you can send an invoice,
                  you only have to do this once. When you click Submit Invoice you will be redirected for verification
                  if you are unverified.


                </li>
                <li>
                  By clicking "submit invoice" you are acknowledging that you understand our requirements and that the
                  details you entered are correct.
                </li>
              </ul>
            </div>

          </section>


        </div>
      </section>
      <div class="steps-action">
        <div v-if="state.saving">
          <a-spin/>


        </div>
        <div v-else>
          <a-button v-if="current > 0" @click="prev">Previous</a-button>
          <a-button style="margin-left: 8px" v-if="current < steps.length - 1" type="primary" @click.prevent="next">
            Next
          </a-button>
          <a-button style="margin-left: 8px"
                    v-if="current === steps.length - 1"
                    type="primary"
                    @click="done"
          >
            Submit Invoice
          </a-button>

        </div>

      </div>
    </section>
  </a-card>
</template>

<script>
import {defineComponent, ref, reactive, onMounted, inject, onUnmounted, computed} from 'vue';
import {message, notification} from 'ant-design-vue';
import {Form} from 'ant-design-vue';
const useForm = Form.useForm;
import CreateEditPick from "../EmployersComponents/CreateEditPickManageEmployers.vue";
import CreateEditAccount from "../AccountsComponents/CreateEditAccount.vue";
import CryptoAccountsManager from "../CryptoAccountsComponents/CryptoAccountsManager.vue";
import InvoiceService from "../../../services/InvoiceService";
import ProfileService from "../../../services/ProfileService";
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';


export default defineComponent({
  components: {
    CreateEditPick,
    CreateEditAccount,
    CryptoAccountsManager
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const formState = reactive({
      amount: '500',
      reason: 'payroll',
      currency: 'USD',
      cashOutOption: undefined,
      fee:undefined

    });
    const state = reactive({
      profile: null,
      company: null,
      bankAccount: null,
      wallet: null,
      companyError: false,
      bankError: false,
      walletError: false,
      saving: false,
      currentTheme: localStorage.getItem("theme"),
      themeVars : {},
      defaultVars:inject('defaultVars'),
      darkModeVars:inject('darkModeVars'),
      size: window.innerWidth,
    });
    if(state.currentTheme === 'dark'){
      state.themeVars = state.darkModeVars
    }else {
      state.themeVars = state.defaultVars
    }
    onMounted(() => {
      window.addEventListener("resize", deviceWidth);
      window.addEventListener('themeChanged', (event) => {
        state.currentTheme = event.detail.storage;
        if(state.currentTheme === 'dark'){
          state.themeVars = state.darkModeVars
        }else {
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
          });

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

    const onFinish = values => {
      return (values);

    };
    const onFinishFailed = errorInfo => {
      return (errorInfo);

    };
    const current = ref(0);
    const rulesRef = reactive({
      amount: [
        {
          required: true,
          message: 'Please input amount!',
        }
      ],
      reason: [{
        required: true,
        message: 'Please input reason of invoice!',
      }],
      cashOutOption: [{
        required: true,
        message: 'Please select how you want to cash out!',
      }],
      fee: [{
        required: true,
        message: 'Please select who will cover the fee!',
      }],

    });
    const {
      validateInfos,
      validate,
    } = useForm(formState, rulesRef, {
      onValidate: () => console.log('.'),
    });
    const next = () => {
      if (current.value === 0) {

        validate()

            .then(() => {
              current.value++;

            })
            .catch(err => {
              return (err);

            });

      } else if (current.value === 1) {
        if (state.company) {

          current.value++;

        } else {

          state.companyError = true;
        }

      } else if (current.value === 2) {
        if (formState.cashOutOption === 'fiat') {
          if (state.bankAccount) {

            current.value++;

          } else {

            state.bankError = true;
          }

        } else if (formState.cashOutOption === 'crypto') {
          if (state.wallet) {

            current.value++;

          } else {

            state.walletError = true;
          }

        }


      } else {
        current.value++;

      }


    };

    const prev = () => {
      current.value--;
    };
    const done = () => {
      let fee = true;
      if(formState.fee === 'employee'){
        fee = false
      }

      let invoiceObj = {
        'currency': formState.currency,
        'amount': formState.amount,
        'reason': formState.reason,
        'recruiter_charged': fee,
        'emp_id': state.company.id,
        'status': 'created',

      };

      if (formState.cashOutOption === 'fiat') {
        invoiceObj['bank_id'] = state.bankAccount.id;
        if(state.bankAccount.currency ==='USD' || state.bankAccount.currency ==='EUR' || state.bankAccount.currency ==='GBP'){
          invoiceObj['provider'] = 'truly';
          // if(formState.amount <state.minimumTruly){
          //   invoiceObj['provider'] = 'truly';
          // }else {
          //   invoiceObj['provider'] = 'revolut';
          // }

        }else {
          invoiceObj['provider'] = 'verto';
        }


      } else if (formState.cashOutOption === 'crypto') {
        invoiceObj['crypto_id'] = state.wallet.id;
        invoiceObj.amount = formState.amount * 101 / 100
      }


      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      state.saving = true;
      InvoiceService.createInvoice(store.state.auth.profile['profile_slug'], invoiceObj, auth)
          .then(() => {
            state.saving = false;
            openNotificationWithIcon('success')

            if (state.profile.verification.length > 0) {
              if (state.profile.verification[0].status === 'verification.completed') {
                router.push({
                  name: 'AllInvoices'
                });
              } else {
                router.push({
                  name: 'kycView'
                });
              }
            } else {
              router.push({
                name: 'kycView'
              });
            }

          })
          .catch(() => {
            state.saving = false;
          });

    };
    const openNotificationWithIcon = type => {
      notification[type]({
        message: 'Invoice created',
        description:
            'Invoice will be emailed to employer who will act upon it.',
      });
    };
    const onPickCompany = (value) => {

      state.company = value;

      state.companyError = false;

    };
    const onPickBankAccount = (value) => {

      state.bankAccount = value;
      state.bankError = false;
    };
    const onPickWallet = (value) => {
      state.wallet = value;
      state.walletError = false;
    };
    return {
      state,
      message,
      current,
      steps: [
        {
          title: 'Invoice Amount',

        }, {
          title: 'Employer Details',

        }, {
          title: 'Receiving Account',

        }, {
          title: 'Invoice Review',

        }],
      next,
      prev,
      done,
      validateInfos,
      formState,
      onFinish,
      onFinishFailed,
      onPickCompany,
      onPickBankAccount,
      onPickWallet,
      isMobile
    };
  },
});
</script>

<style scoped>
.steps-content {
  min-height: 200px;
  padding: 1%;
}

.steps-action {
  margin-top: 24px;
}


.cardTitle {
  background-color: v-bind(state['themeVars']['invoiceStripColor']);
  border-radius: 0;
  border: none;
}

.cardTitle2 {

  border-radius: 0;

}


.capitalize {
  text-transform: capitalize;
}

/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {

  .capitalize {
    font-size: small;
  }

  .steps-content {
    padding: 1%;
  }



}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .capitalize {
    font-size: small;
  }

  .steps-content {

    padding: 1%;
  }



}
</style>