<template>

  <a-form
      :model="formState"
      name="CreateEditEmployee"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      style="width: 100%"

  >



    <a-alert v-if="!employee"
             message="We will send an invitation to your employee for verification and their bank details."
             type="warning"
    />




    <a-row :gutter="[16,16]">
      <a-col span="12">
        <!--- first name--->
        <a-form-item
            :label-col="{span:24}"
            :wrapper-col="{ span: 24 }"
            has-feedback label="First Name"
            name="firstname"
            :rules="[{ required: true, message: 'Please input Employee first name!' }]"
        >
          <a-input v-model:value="formState.firstname" placeholder="First Name"/>
        </a-form-item>
      </a-col>
      <a-col span="12">
        <!--- last name--->
        <a-form-item
            :label-col="{span:24}"
            :wrapper-col="{ span: 24 }"
            has-feedback label="Last Name"
            name="lastname"
            :rules="[{ required: true, message: 'Please input Employee last name!' }]"
        >
          <a-input v-model:value="formState.lastname" placeholder="Last Name"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item
        :label-col="{span:24}"
        :wrapper-col="{ span: 24 }"
        has-feedback label="Email"
        name="email"
        validate-trigger="blur"
        :rules="[{ required: true, message: 'Please input employee email!' },{type:'email',message:'Input a valid email!'}]"
    >
      <a-input v-model:value="formState.email" placeholder="Email"/>
    </a-form-item>
    <a-form-item
        :label-col="{span:24}"
        :wrapper-col="{ span: 24 }"
        label="Salary Currency"
        name="currency"
        :rules="[{ required: true, message: 'Please pick currency !' }]"
    >
      <a-select v-model:value="formState.currency">
        <a-select-option value="USD">USD</a-select-option>
        <a-select-option value="EUR">EURO</a-select-option>
        <a-select-option value="GBP">GBP</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
        :label-col="{span:24}"
        :wrapper-col="{ span: 24 }"
        label="Amount (min 100, max 10000)"
        name="amount"
        :rules="[{ required: true, message: 'Please input salary!' }]"

    >
      <a-input-number style="width: 100%" v-model:value="formState.amount" min="100"
                      max="10000"/>


    </a-form-item>


    <a-form-item>
      <a-button type="primary" html-type="submit" :loading="state.saving">Save</a-button>

    </a-form-item>
  </a-form>
</template>

<script>
import {defineComponent, onMounted, reactive, watch, ref} from 'vue';
import EmployersService from "../../../../../services/EmployersService";
import {useStore} from 'vuex';

export default defineComponent({
  props: ['employee'],
  emits: ['newEmployee', 'employeeEdit', 'cancelForm'],
  setup(props, ctx) {
    const formRef = ref();
    const store = useStore();
    const state = reactive({
      saving: false

    });
    let formState = reactive({
      firstname: '',
      lastname: '',
      email: '',
      amount: '',
      currency: 'USD'

    });
    onMounted(() => {
      if (props.employee) {
        formState = Object.assign(formState, props.employee);

      }

    });


    const onFinish = (values) => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      state.saving = true


      if (props.employee) {
        let employeeObj = {
          ...values
        };

        EmployersService.patchEmployee(store.state.auth.profile['profile_slug'],props.employee.id, employeeObj, auth)
            .then(resp => {
              state.employees = resp.data;
              ctx.emit('employeeEdit', resp.data);
              state.saving = false
            })
            .catch(()=>{
              state.saving =false
            })

      } else {

        let employeeObj = {
          ...values
        };

        EmployersService.createEmployee(store.state.auth.profile['profile_slug'], employeeObj, auth)
            .then(resp => {
              state.employees = resp.data;
              ctx.emit('newEmployee', resp.data);
              state.saving = false
            })
            .catch(()=>{
              state.saving =false
            })


      }

    };
    const onFinishFailed = (errorInfo) => {

      return errorInfo;
    };
    watch(() => (props.employee), (newValues) => {
      if (newValues !== null) {
        formState = Object.assign(formState, newValues);
      } else {
        let initial = {
          firstname: '',
          lastname: '',
          email: '',
          amount:'',
          currency:'USD'
        };
        formState = Object.assign(formState, initial);

      }
    });

    return {
      state,
      formState,
      formRef,
      onFinish,
      onFinishFailed,

    };
  }
});
</script>

<style scoped>

</style>