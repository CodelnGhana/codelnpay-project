<template>
  <a-layout style="min-height: 100vh;" class="content">
    <Header/>
    <a-layout-content class="signUpCardMarg">

      <div>
        <a-row style="padding: 2%" type="flex" justify="space-around" >
          <a-col :xs="22" :sm="22" :md="12" :lg="12" :xl="8">
            <a-card v-if="!store.state.auth.profile" >
              <template #title>
                <span v-if="state.isEmployer">
                Create Company Account
              </span>
                <span v-else>
                Sign Up as Employee/Freelancer
              </span>
              </template>
              <a-alert v-if="state.error" :message="state.error" type="error"/>

              <a-form
                  ref="formRef"
                  name="custom-validation"
                  :model="formState"
                  :rules="rules"
                  v-bind="layout"
                  @finish="handleFinish"
                  @validate="handleValidate"
                  @finishFailed="handleFinishFailed"
              >
                <a-row :gutter="[16,16]">
                  <a-col :span="12">
                    <!---first name--->
                    <a-form-item
                        has-feedback label="First Name"
                        name="first_name"
                        :rules="[{ required: true, message: 'Please input your first name!' }]"
                    >
                      <a-input v-model:value="formState.first_name" placeholder="First Name"/>
                    </a-form-item>

                  </a-col>
                  <a-col :span="12">
                    <!---last name--->
                    <a-form-item
                        has-feedback label="Last Name"
                        name="last_name"
                        :rules="[{ required: true, message: 'Please input your last name!' }]"
                    >
                      <a-input v-model:value="formState.last_name" placeholder="Last Name"/>
                    </a-form-item>

                  </a-col>

                </a-row>


                <!---email--->
                <a-form-item
                    has-feedback label="Email"
                    name="email"

                    :rules="[{ required: true, message: 'Please input your email!' },{type:'email',message:'Input a valid email!'}]"
                >
                  <a-input v-model:value="formState.email" placeholder="Email"/>
                </a-form-item>
                <!--- ID number--->
<!--                <a-form-item-->
<!--                    v-if="!state.isEmployer"-->

<!--                    has-feedback label="Govt provided Identity Number"-->
<!--                    name="identity_number"-->

<!--                >-->
<!--                  <a-input v-model:value="formState.identity_number" placeholder="Identity number"/>-->
<!--                </a-form-item>-->

                <!---company name--->
                <a-form-item
                    v-if="state.isEmployer"

                    has-feedback label="Company Name"
                    name="company"
                    :rules="[{ required: true, message: 'Please input your company name!' }]"
                >
                  <a-input v-model:value="formState.company" placeholder="Company Name"/>
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
                      :filter-option="filterOption"

                  ></a-select>



                </a-form-item>
                <!---phone--->
                <a-form-item
                    has-feedback
                    label="Phone number"
                    name="phone"
                    :rules="[{ required: true, message: 'Please enter your phone number!' }]"

                >
                  <a-input v-model:value="formState.phone" @change="validatePhone" type="number">
                    <template #addonBefore>
                      <a-select

                          v-model:value="state.code"
                          style="width: 120px"
                          placeholder="Code"
                          :options="state.codesTelephone"



                      ></a-select>
                    </template>

                  </a-input>
                  <span slot="extra" style="color: red" v-if="state.phoneValid">
                    phone not valid
                  </span>
                </a-form-item>
                <!---pass 1--->
                <a-form-item has-feedback label="Password" name="password1">
                  <a-input-password v-model:value="formState.password1" type="password" autocomplete="off"
                                    placeholder="Password"/>
                </a-form-item>
                <!---pass 2--->
                <a-form-item has-feedback label="Confirm" name="password2">
                  <a-input-password v-model:value="formState.password2" type="password" autocomplete="off"
                                    placeholder="Password, Again"/>
                </a-form-item>

                <a-form-item :wrapper-col="{ span: 14, offset: 0 }">
                  <a-button type="primary" :loading="state.loading" html-type="submit">Submit</a-button>
                </a-form-item>

              </a-form>

              <a-alert v-if="isMobile && state.error" :message="state.error" type="error"/>

              <div style="margin-top: 1.5rem">
                <p>
                  Already have an account?
                  <a>
                    <router-link to="/Login"> Sign in</router-link>
                  </a>
                </p>
                <p v-if="state.isEmployer">
                  Are you looking to Signup as an Employee/Freelancer
                  <a>
                    <router-link to="/Register"> Start here</router-link>
                  </a>
                </p>
                <p v-else>
                  Are you looking to Signup as an Employer
                  <a>
                    <router-link to="/Register"> Start here</router-link>
                  </a>
                </p>
              </div>


            </a-card>

          </a-col>
        </a-row>
      </div>
    </a-layout-content>
    <Footer/>

  </a-layout>
</template>
<script>
import {defineComponent, reactive, ref, computed, onUnmounted, onMounted, inject} from 'vue';
import Header from "../../components/HomeLayout/Header.vue";
import Footer from "../../components/HomeLayout/Footer.vue";

import {VueTelInput} from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';
import AuthService from '../../services/AuthService';

import {useStore} from 'vuex';
import {useRouter} from "vue-router/dist/vue-router";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSENGER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
import {FormattedCountryData,CountryCodeData} from '@/utils/sharedDataFormatters/Countries'
import {PhoneNumberUtil} from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();
export default defineComponent({
  components: {Header, VueTelInput, Footer},
  setup() {
    const store = useStore();
    const router = useRouter();


    const state = reactive({
      loading: false,
      error: null,
      phoneValid: false,
      phoneError: false,
      isEmployer: false,
      size: window.innerWidth,
      countries:FormattedCountryData,
      codesTelephone: CountryCodeData,
      code: '+234',
      currentTheme: localStorage.getItem("theme"),
      themeVars : {},
      defaultVars:inject('defaultVars'),
      darkModeVars:inject('darkModeVars')

    });
    if (store.state.auth.profile_type) {
      if (store.state.auth.profile_type === 'employer') {
        state.isEmployer = true;
      }
    } else {
      router.push({
        name: 'Register'
      });
    }
    const formRef = ref();
    const formState = reactive({
      first_name: '',
      last_name: '',
      email: '',
      password1: '',
      password2: '',
      country: '',
      phone: '',
      profile_type:store.state.auth.profile_type,
      company: null,



    });
    onMounted(() => {

      window.addEventListener("resize", devicewidth);
      window.addEventListener('themeChanged', (event) => {
        state.currentTheme = event.detail.storage;
        if(state.currentTheme === 'dark'){
          state.themeVars = state.darkModeVars
        }else {
          state.themeVars = state.defaultVars
        }
      });

    });
    if(state.currentTheme === 'dark'){
      state.themeVars = state.darkModeVars
    }else {
      state.themeVars = state.defaultVars
    }
    onUnmounted(() => {
      window.removeEventListener("resize", devicewidth);
    });
    const devicewidth = (e) => {
      state.size = e.srcElement.innerWidth;
    };
    const isMobile = computed(() => {
      return state.size <= 425;

    });



    let validatePhone =  () => {
      let phone = state.code + formState.phone

      if(formState.phone.length>2){
        state.phoneValid = !phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone))

      }
    };
    let validatePass = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('Please input the password');
      } else {
        if (formState.password2 !== '') {
          formRef.value.validateFields('password2');
        }
        return Promise.resolve();
      }
    };
    let validatePass2 = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('Please re confirm the password');
      } else if (value !== formState.password1) {
        return Promise.reject("Two inputs don't match!");
      } else {
        return Promise.resolve();
      }
    };
    const rules = {
      password1: [
        {
          required: true,
          validator: validatePass,
          trigger: 'change',
        },
        {
          pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})",
          message: 'The password must contain at least: 1 uppercase, 1 lowercase, 1 number,8 characters min',
          trigger: 'change',
        }
      ],
      password2: [
        {
          validator: validatePass2,
          trigger: 'change',
        }
      ],


    };


    const disabled = computed(() => {
      return !(formState.first_name && formState.last_name && formState.email && formState.pass && formState.checkPass);
    });
    const layout = {
      labelCol: {
        span: 24,
      },
      wrapperCol: {
        span: 24,

      },
    };
    const handleFinish = () => {
      if (state.phoneValid === false) {
        let phone = state.code + formState.phone
        let signUpObj ={
          "first_name": formState.first_name,
          "last_name": formState.last_name,
          "email": formState.email,
          "password1": formState.password1,
          "password2": formState.password2,
          "country": formState.country,
          "phone": phone,
          "profile_type": formState.profile_type,
          "company": formState.company
        }
        state.loading = true;
        if(!formState.profile_type || formState.profile_type ===''){
          signUpObj.profile_type ='employee'
        }
        if(formState.profile_type ==='employee'){
          signUpObj.company ='employee'
        }


        AuthService.register(signUpObj)
            .then(() => {
              login();
            })
            .catch(err => {


              if (err.response.status === 400) {
                if(err.response.data.email){
                  state.error = err.response.data.email
                }
                else if(err.response.data['non_field_errors'].includes('The password is too similar to the username.')){
                  state.error ='The password is too similar to some of your field entries.Try a new unique Password'

                }else {
                  state.error =err.response.data['non_field_errors']
                }
                addDoc(collection(db, "signupIssues"), {
                  email: formState.email,
                  backend: err.response.data,

                })

              }else {
                state.error = 'Please refresh page'
                addDoc(collection(db, "signupIssues"), {
                  email: formState.email,
                  backend: err.response.data,

                })
              }
              state.loading = false;
              throw new Error(err.response);
            });
      }

    };

    const handleFinishFailed = errors => {

      return (errors);
    };
    const handleValidate = (...args) => {

      return (args);
    };

    const login = () => {
      let values = {
        email: formState.email,
        password: formState.password1

      };
      AuthService.login(values)
          .then(resp => {
            store.dispatch('auth/setEphToken', resp.data.ephemeral_token);
            state.loading = false;
            router.push({
              name: 'Verify'
            });
          })
          .catch(err => {
            state.loading = false;
            if (err.response.status === 400) {
              state.error = err.response.data.error;
            }
            router.push({
              name: 'Login'
            });

          });

    };
    const CodelnLogin = ()=>{
      router.push({
        name: 'CodelnLogin'
      })
    }
    const filterOption = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };
    return {
      store,
      state,
      formState,
      formRef,
      rules,
      layout,
      handleFinishFailed,
      handleFinish,
      handleValidate,
      disabled,
      validatePhone,
      isMobile,
      CodelnLogin,
      filterOption


    };
  },

});
</script>


<style scoped>
.signUpCardMarg {

  width: 99vw;
}
.content{
  background-color: v-bind(state['themeVars']['backgroundColor']);
}


/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {

}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {


}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {


}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {



}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {




}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {


}

/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {


}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {



}
</style>