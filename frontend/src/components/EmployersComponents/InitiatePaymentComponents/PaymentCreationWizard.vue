<template>
  <a-card style="width: 100%;border-radius: 0" >
    <template #title>
      Initiate Payment
    </template>
    <section>
      <a-steps :current="current" size="small" progress-dot>
        <a-step v-for="item in steps" :key="item.title" :title="item.title"/>
      </a-steps>
      <section>

        <div v-if="current===0" class="steps-content">
          <p class="ant-form-item-explain-error" v-if="state.pickedEmployeeError">Pick atleast one receiving recipient
            to proceed</p>
          <NewEmployeeManager :pickedEmployees="state.pickedEmployees" @onpickEmployee="onPickEmployee"/>


        </div>
        <div v-if="current===1" class="steps-content" >
          <section>
            <!---table title--->
            <a-row>
              <a-col span="8">
                <a-card size="small" class="cardTitle">
                  Name
                </a-card>

              </a-col>

              <a-col span="8">
                <a-card size="small" class="cardTitle">
                  Amount
                </a-card>

              </a-col>
              <a-col span="8">
                <a-card size="small" class="cardTitle">
                  Charges
                </a-card>

              </a-col>
            </a-row>

            <!---table data--->
            <div v-for="employee in state.pickedEmployees" v-bind:key="employee.id">
              <a-row>
                <a-col span="8">
                  <a-card size="small" class="cardTitle2">

                    <span class="capitalize">{{ employee.firstname }} {{ employee.lastname }}</span>
                  </a-card>

                </a-col>

                <a-col span="8">
                  <a-card size="small" class="cardTitle2">
                    {{ employee.currency }} {{ employee.amount }}
                  </a-card>

                </a-col>
                <a-col span="8">
                  <a-card size="small" class="cardTitle2">
                    {{ Number(employee.amount) / 100 }}

                  </a-card>

                </a-col>
              </a-row>
            </div>
            <!---table total--->
            <a-row>
              <a-col :span="8" :offset="16">
                <a-card size="small" class="cardTitle">
                  Total: {{ state.pickedEmployees[0].currency }}
                  {{ invoiceTotal }}

                </a-card>
              </a-col>
            </a-row>

          </section>
          <section>
            <p>Which Currency will your employees be cashed out in?</p>
            <a-select
                ref="select"
                v-model:value="state.provider"
                style="width: 50%"
                @change="handleChange"
            >
              <a-select-option value="verto">Not sure</a-select-option>
              <a-select-option value="verto">In their local currencies</a-select-option>
              <a-select-option value="truly">Foreign currency({{ state.pickedEmployees[0].currency }})</a-select-option>


            </a-select>
            <br/>
            <span class="error" v-if="state.providerEntryError">Pick cash out option</span>
          </section>
          <section class="hideMobile">

            <p>Please note.</p>
            <ul>
              <li style="font-weight: bold">
                By clicking Submit, you will be provided our banking details and instructions on how to make payment.

              </li>
              <li style="font-weight: bold">
                The receiving party will be requested to pass KYC and provide their banking details.
                You can track these updates under the "All Payments" tab

              </li>
              <li>
                Please follow the instructions closely for your payment,
                you will be notified within 24 hours after we receive your payment

              </li>
              <li>
                For newly added employee, please notify them to accept your invite and get verified on the platform
                inorder to accept their money.


              </li>
              <li>
                Your employee will get their payment within 2 - 3 business days after we receive the money.

              </li>
              <li>
                By clicking "submit" you are acknowledging that you understand the above requirements and that you are
                ok with our terms.


              </li>

            </ul>
          </section>
          <a-collapse class="showMobile">
            <a-collapse-panel key="1" header="Payment Instructions">
              <section>

                <p>Please note.</p>
                <ul>
                  <li style="font-weight: bold">
                    By clicking Submit, you will be provided our banking details and instructions on how to make payment.

                  </li>
                  <li style="font-weight: bold">
                    The receiving party will be requested to pass KYC and provide their banking details.
                    You can track these updates under the "All Payments" tab

                  </li>
                  <li>
                    Please follow the instructions closely for your payment,
                    you will be notified within 24 hours after we receive your payment

                  </li>
                  <li>
                    For newly added employee, please notify them to accept your invite and get verified on the platform
                    inorder to accept their money.


                  </li>
                  <li>
                    Your employee will get their payment within 2 - 3 business days after we receive the money.

                  </li>
                  <li>
                    By clicking "submit" you are acknowledging that you understand the above requirements and that you are
                    ok with our terms.


                  </li>

                </ul>
              </section>
            </a-collapse-panel>

          </a-collapse>



        </div>


      </section>
      <div class="steps-action">
        <a-button v-if="current > 0" @click="prev">Previous</a-button>
        <a-button v-if="current < steps.length - 1" style="margin-left: 8px" type="primary" @click="next">Next
        </a-button>
        <a-button @click="saveType" style="margin-left: 8px" :loading="state.loading"
                  v-if="current === 1"
                  type="primary">
          Submit
        </a-button>

      </div>
    </section>
  </a-card>
</template>

<script>
import {defineComponent, reactive, ref, computed, inject, onMounted} from 'vue';
import NewEmployeeManager from "../EmployeeManager/NewEmployeeManager/NewEmployeeManager.vue";
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import {Form} from 'ant-design-vue';
import PaymentService from "../../../services/PaymentService";

const useForm = Form.useForm;
export default defineComponent({
  components: {
    NewEmployeeManager,

  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const current = ref(0);
    const state = reactive({
      pickedEmployees: [],
      pickedEmployeeError: false,
      loading: false,
      paymentIds: [],
      provider: null,
      providerEntryError: false,
      currentTheme: localStorage.getItem("theme"),
      themeVars : {},
      defaultVars:inject('defaultVars'),
      darkModeVars:inject('darkModeVars'),
    });
    onMounted(()=>{
      window.addEventListener('themeChanged', (event) => {
        state.currentTheme = event.detail.storage;
        if(state.currentTheme === 'dark'){
          state.themeVars = state.darkModeVars
        }else {
          state.themeVars = state.defaultVars
        }
      });
    })
    if(state.currentTheme === 'dark'){
      state.themeVars = state.darkModeVars
    }else {
      state.themeVars = state.defaultVars
    }
    const handleChange = value => {
      state.provider = value;
      state.providerEntryError =false;

    };

    const next = () => {


      if (current.value === 0) {
        if (state.pickedEmployees.length > 0) {
          current.value++;
        } else {
          state.pickedEmployeeError = true;
        }

      } else {
        current.value++;
      }
    };
    const saveType = () => {

      if (state.provider) {
        state.loading = true;
        if (state.pickedEmployees.length > 1) {
          saveBulkPaymentRecords();

        } else {
          savePayment(state.pickedEmployees[0]);
        }
      } else {
        state.providerEntryError = true;
      }


    };
    const saveBulkPaymentRecords = () => {
      state.paymentIds = [];
      let counter = state.pickedEmployees.length;
      state.loading = true;
      state.pickedEmployees.forEach(employee => {
        const auth = {
          headers: {Authorization: 'Bearer ' + store.state.auth.token}

        };
        let paymentObj = {
          amount: employee.amount,
          reason: 'Payroll',
          currency: employee.currency,
          emp_id: employee.id,
          status: 'payment_pending',
          'pay_date': new Date(),
          provider:state.provider

        };
        PaymentService.createPayment(store.state.auth.profile['profile_slug'], paymentObj, auth)
            .then(resp => {
              state.data = resp.data;
              state.paymentIds.push(resp.data.payment_id);
              counter -= 1;

              if (counter === 0) {
                createBulkPaymentRecord();
              }

            })
            .catch(() => {
              state.loading = false;
            });
      });


    };
    const createBulkPaymentRecord = () => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };

      let bulkPaymentObj = {
        amount: invoiceTotal.value,
        reason: 'Payroll',
        currency: state.pickedEmployees[0].currency,
        payments: state.paymentIds,
        status: 'bulk_payment_pending',
        'bulk_pay_date': new Date()

      };

      PaymentService.createBulkPayment(store.state.auth.profile['profile_slug'], bulkPaymentObj, auth)
          .then((resp) => {

            const routeData = router.resolve({name: 'BulkInvoiceView', params: {invoiceId: resp.data.payment_id}});
            window.open(routeData.href, '_blank');
            router.push({name: 'RecentPayouts',});
            state.loading = false;


          })
          .catch(() => {
            state.loading = false;
          });


    };
    const savePayment = (employee) => {


      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      let paymentObj = {
        amount: employee.amount,
        reason: 'Payroll',
        currency: employee.currency,
        emp_id: employee.id,
        status: 'payment_pending',
        'pay_date': new Date(),
        provider:state.provider

      };

      PaymentService.createPayment(store.state.auth.profile['profile_slug'], paymentObj, auth)
          .then(resp => {
            state.data = resp.data;


            router.push({name: 'PaymentReview', params: {invoiceId: resp.data.payment_id}});
            state.loading = false;

          })
          .catch(() => {
            state.loading = false;
          });

    };
    const prev = () => {
      current.value--;
    };
    const onPickEmployee = (values) => {
      state.pickedEmployees = values;
      state.pickedEmployeeError = false;
    };
    const invoiceTotal = computed(() => {
      if (state.pickedEmployees.length > 0) {
        let total = 0;
        state.pickedEmployees.forEach(employee => {

          total = Number(employee.amount) + total;


        });
        total = total * 101 / 100
        return total;
      } else {
        return (100);
      }

    });

    return {
      state,
      current,
      steps: [
        {
          title: 'Pick Recipient',

        },
        {
          title: 'Instructions',

        }
      ],
      next,
      prev,
      onPickEmployee,
      saveType,
      savePayment,
      invoiceTotal,
      handleChange
    };
  },

});
</script>

<style scoped>
.error {
  color: #ff4d4f;

}

.steps-content {
  margin-top: 1%;



  min-height: 200px;

  padding: 1%;
}

.steps-action {
  margin-top: 24px;
}

[data-theme='dark'] .steps-content {
  background-color: #2f2f2f;
  border: 1px dashed #404040;
}

.cardTitle {
  background-color: v-bind(state['themeVars']['invoiceStripColor']);
  border-radius: 0;
  border: none;
}

.cardTitle2 {
  height: 100%;
  border-radius: 0;

}

.capitalize {
  text-transform: capitalize;
}
</style>