<template>

    <a-form
        :model="formState"
        name="Login"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        style="width: 100%"
    >

      <!--- account name--->
      <a-form-item
          :label-col="{span:24}"
          :wrapper-col="{ span: 24 }"
          has-feedback label="Your Account Name"
          name="account_name"
          :rules="[{ required: true, message: 'Please input Account name!' }]"
      >
        <a-input v-model:value="formState.account_name" placeholder="Account Name"/>
      </a-form-item>
      <!---account and currency type-->
      <a-row :gutter="[16,16]">
        <a-col span="12">
          <!--- Account Number--->
          <a-form-item
              :label-col="{span:24}"
              :wrapper-col="{ span: 24 }"
              has-feedback label="Your Account Number"
              name="account_number"
              :rules="[{ required: true, message: 'Please input your account number!' }]"
          >
            <a-input v-model:value="formState.account_number" placeholder="Account Number"/>
          </a-form-item>
        </a-col>
        <a-col span="12">
          <!--- Currency type--->
          <a-form-item
              :label-col="{span:24}"
              :wrapper-col="{ span: 24 }"
              has-feedback label="Account Currency "
              name="currency"
              :rules="[{ required: true, message: 'Please select account currency ' }]"
          >

            <a-select
                show-search
                v-model:value="formState.currency"
                placeholder="Select currency"
                :options="options"
                :filter-option="filterOption"



            ></a-select>

          </a-form-item>

        </a-col>
      </a-row>

      <!--- Bank Name--->
      <a-form-item
          :label-col="{span:24}"
          :wrapper-col="{ span: 24 }"
          has-feedback label="Bank Name"
          name="bank_name"
          :rules="[{ required: true, message: 'Please input your bank name!' }]"
      >
        <a-input v-model:value="formState.bank_name"/>
      </a-form-item>
      <!---swift and branch--->
      <a-row :gutter="[16,16]">
        <a-col :span="12">
          <!--- Swift/Bic code--->
          <a-form-item
              :label-col="{span:24}"
              :wrapper-col="{ span: 24 }"
              has-feedback label="SWIFT/BIC code"
              name="swift_code"
              :rules="[{ required: true, message: 'Please input swift code!' }]"
          >
            <a-input v-model:value="formState.swift_code"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <!--- Bank Branch--->
          <a-form-item
              :label-col="{span:24}"
              :wrapper-col="{ span: 24 }"
              has-feedback label="Bank Branch address"
              name="branch_address"
              :rules="[{ required: true, message: 'Please input bank branch!' }]"
          >
            <a-input v-model:value="formState.branch_address"/>
          </a-form-item>
        </a-col>
      </a-row>

      <!---country and city--->
      <a-row :gutter="[16,16]">
        <a-col :span="12">

          <!---country--->
          <a-form-item
              :label-col="{span:24}"
              :wrapper-col="{ span: 24 }"
              has-feedback label="Country"
              name="country"
              :rules="[{ required: true, message: 'Please pick your country!' }]"
          >
            <a-select
                v-model:value="formState.country"
                style="width: 100%"
                placeholder="Country"
                :options="state.countries"

            ></a-select>

<!--            <country-select class="ant-input" v-model="formState.country" :country="formState.country" @change="handleChangeCountries"  />-->


          </a-form-item>
        </a-col>
        <a-col :span="12" style="display:none;">
          <!--- City--->
          <a-form-item
              :label-col="{span:24}"
              :wrapper-col="{ span: 24 }"
              has-feedback label="City"
              name="city"
              :rules="[{ required: true, message: 'Please input your country to get city!' }]"
          >
            <a-input v-model:value="formState.city" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <!--- State--->
          <a-form-item
              :label-col="{span:24}"
              :wrapper-col="{ span: 24 }"
              has-feedback label="State/Province"
              name="state_province"
              :rules="[{ required: true, message: 'Please input your state/province!' }]"
          >
            <a-input v-model:value="formState.state_province"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="[16,16]">
        <a-col :span="12">
          <!--- Street Address--->
          <a-form-item
              :label-col="{span:24}"
              :wrapper-col="{ span: 24 }"
              has-feedback label="Street Address"
              name="street_address"
              :rules="[{ required: true, message: 'Please input your Street Address!' }]"
          >
            <a-input v-model:value="formState.street_address"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <!--- Postal code--->
          <a-form-item
              :label-col="{span:24}"
              :wrapper-col="{ span: 24 }"
              has-feedback label="Postal Code"
              name="postal_code"
              :rules="[{ required: true, message: 'Please input your postal code!' }]"
          >
            <a-input v-model:value="formState.postal_code"/>
          </a-form-item>
        </a-col>
      </a-row>


      <a-form-item>
        <a-button type="primary" html-type="submit" :disabled="disabled" :loading="state.saving">Save</a-button>

      </a-form-item>
    </a-form>




</template>

<script>
import {FormattedCountryData} from '@/utils/sharedDataFormatters/Countries'
import {defineComponent, reactive, ref, watch, onMounted, computed} from 'vue';
import AccountsService from "../../../services/AccountsService";
import Cities from "@/assets/json/cities.json";
import Currencies from "@/assets/json/currency.json";
import {useStore} from 'vuex';
import {message} from "ant-design-vue";
export default defineComponent({
  props: ['account'],
  emits: ['accountAdd', 'accountEdit', 'cancelForm'],

  setup(props, ctx) {
    const store = useStore();
    const state = reactive({
      currentAccount: null,
      city: '',
      saving: false,
      countries: FormattedCountryData,


    });
    let initialForm = {
      account_name: '',
      account_number: '',
      currency:'',
      bank_name: '',
      branch_address: '',
      swift_code: '',
      country: '',
      street_address: '',
      city: '',
      state_province: '',
      postal_code: '',


    };
    let formState = reactive({
      account_number: '',
      currency:'',
      account_name: '',
      bank_name: '',
      branch_address: '',
      swift_code: '',
      country: '',
      street_address: '',
      city: '',
      state_province: '',
      postal_code: '',


    });
    onMounted(() => {

      if (props.account) {


        formState = Object.assign(formState, props.account);


      }


    });
    const onFinish = (values) => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };


      state.saving = true;
      if (props.account) {

        AccountsService.patchAccount(store.state.auth.profile['profile_slug'], props.account.id, values, auth)
            .then(resp => {

              ctx.emit('accountEdit', resp.data);
              message.success('Account details saved');
              state.saving = false;
            })
            .catch(() => {
              state.saving = false;
            });

      } else {

        AccountsService.createAccount(store.state.auth.profile['profile_slug'], values, auth)
            .then(resp => {

              ctx.emit('accountAdd', resp.data);
              message.success('New account created');
              state.saving = false;
            })
            .catch(() => {
              state.saving = false;
            });

      }


    };
    const onFinishFailed = (errorInfo) => {
      return  errorInfo
    };
    let opt = [];
    for (const key in Currencies) {

      let currencyObj = {
        value: key,
        label: Currencies[key].code,
      };
      opt.push(currencyObj);

    }
    const options = ref([...opt]);
    const filterOption = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    const handleChangeCountries = () => {
      formState.city = '';
      state.stateOptions = [];

      let tempcity = Cities.filter(city => city.code === formState.country);
      formState.city = tempcity[0].capital;


    };
    watch(() => (props.account), (newValues) => {
      if (newValues !== null) {
        formState = Object.assign(formState, newValues);

      } else {
        formState = Object.assign(formState, initialForm);

      }
    });
    const cancelForm = () => {
      ctx.emit('cancelForm');

    };
    const disabled = computed(() => {
      return !(
          formState.account_number
          && formState.currency
          && formState.account_name
          && formState.bank_name
          && formState.branch_address
          && formState.swift_code
          && formState.country
          && formState.street_address
          && formState.city
          && formState.state_province
          && formState.postal_code


      );
    });


    return {
      state,
      formState,
      options,
      filterOption,
      onFinish,
      onFinishFailed,
      handleChangeCountries,
      cancelForm,
      disabled

    };
  },


});
</script>

<style scoped>

</style>