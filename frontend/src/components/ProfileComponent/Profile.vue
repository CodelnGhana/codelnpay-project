<template>
  <a-card style="width: 100%;border-radius: 0"  :loading="state.loading">
    <template #title>
      Profile Manager
    </template>

    <section >
      <div v-if="state.profile">
        <div v-if="state.profile.profile_type">
          <a-button @click="resetVerification" style="display: none">Reset Verification</a-button>
          <a-alert message="We need some extra information to enable us to serve you better" type="warning" v-if="state.profile.profile_type ==='employee' &&(formState.identity_number === null || formState.identity_number === '')" />
          <a-form
              ref="formRef"
              name="custom-validation"
              :model="formState"
              v-bind="layout"
              @finish="profileFormUpdate"
              @validate="handleValidate"
              @finishFailed="handleFinishFailed"
          >


            <!---company name--->
            <a-form-item
                v-if="state.profile.profile_type ==='employer'"

                has-feedback label="Company Name"
                name="company"
                :rules="[{ required: true, message: 'Please input your company name!' }]"
            >
              <a-input v-model:value="formState.company" placeholder="Company Name"/>
            </a-form-item>

            <!---id number--->
            <a-form-item
                v-if="state.profile.profile_type ==='employee'"

                has-feedback label="Identification Number "
                name="identity_number"
                :rules="[{ required: true, message: 'Please input your identification number!' }]"
            >
              <a-input v-model:value="formState.identity_number" placeholder="ID number"/>
            </a-form-item>

            <!---country--->
            <a-form-item
                has-feedback label="Country"
                name="country"
                :rules="[{ required: true, message: 'Please pick your country!' }]"
            >
              <a-select
                  show-search
                  v-model:value="formState.country"
                  style="width: 100%"
                  placeholder="Country"
                  :options="state.countries"
                  :filter-option="filterCountries"

              ></a-select>



            </a-form-item>


            <a-form-item :wrapper-col="{ span: 14, offset: 0 }">
              <a-button type="primary" :loading="state.loading" html-type="submit">Submit</a-button>
            </a-form-item>
          </a-form>

        </div>
        <div v-else>
          <p class="Headertitle">Pick Your Profile type</p>
          <a-space direction="vertical" style="width: 100%">
            <a-popconfirm
                title="Are you sure about your pick?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="pickProfile('employer')"

            >
              <a-card hoverable>
                <a-card-meta title="Employer" description="I want to pay my employees">

                </a-card-meta>

              </a-card>
            </a-popconfirm>
            <a-popconfirm
                title="Are you sure about your pick?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="pickProfile('employee')"

            >
              <a-card hoverable>
                <a-card-meta title="Employee"
                             description="I want to receive my salary">

                </a-card-meta>

              </a-card>
            </a-popconfirm>

          </a-space>
        </div>
      </div>
    </section>


  </a-card>
</template>

<script>
import {defineComponent, onMounted, reactive, ref} from 'vue';
import {useStore} from 'vuex';
import {FormattedCountryData} from '@/utils/sharedDataFormatters/Countries'
import ProfileService from "../../services/ProfileService";
import { message } from 'ant-design-vue';
export default defineComponent({
  components: {},
  setup() {

    const store = useStore();
    const state = reactive({
      loading: false,
      profile: null,
      countries: FormattedCountryData,

    });
    const formRef = ref();
    const formState = reactive({

      country: '',
      company: null,
      identity_number:null

    });
    onMounted(() => {
      state.loading = true;

      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      let slug = store.state.auth.profile['profile_slug'];

      ProfileService.getProfile(slug, auth)
          .then(resp => {
            state.profile = resp.data;
            formState.company = state.profile.company;
            formState.country = state.profile.country;
            formState.identity_number = state.profile.identity_number
            state.loading = false;
          })
          .catch(() => {
            state.loading = false;
          });


    });
    const updateProfile = (patchObj) => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}
      };
      state.loading = true;
      let slug = store.state.auth.profile['profile_slug'];
      ProfileService.patchProfile(slug, patchObj, auth)
          .then(resp => {
            state.profile = resp.data;
            message.success('save success');
            state.loading = false;
          })
          .catch(() => {
            state.loading = false;
          });


    };
    const pickProfile = (profile_type => {
      state.profile.profile_type = profile_type;
      store.state.auth.profile.profile_type = profile_type;
      store.dispatch('auth/setProfileType', profile_type)
      let patchObj = {
        profile_type: profile_type
      };
      updateProfile(patchObj);

    });
    const profileFormUpdate = (values) => {
      updateProfile(values);

    };
    const resetVerification = () => {
      let patchObj = {
        verification: []
      };
      updateProfile(patchObj);
    };

    const layout = {
      labelCol: {
        span: 24,
      },
      wrapperCol: {
        span: 24,

      },
    };
    const handleFinishFailed = errors => {

      return (errors);
    };
    const handleValidate = (...args) => {

      return (args);
    };
    const filterCountries = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };


    return {
      state,
      layout,
      formState,
      formRef,
      updateProfile,
      pickProfile,
      handleFinishFailed,
      profileFormUpdate,
      handleValidate,
      resetVerification,
      filterCountries

    };

  }

});
</script>

<style scoped>
.Headertitle {

  font-family: 'Poppins', sans-serif;
  font-weight: 600;


}
</style>