<template>
  <a-layout style="min-height: 100vh;">
    <Header/>
    <a-layout-content :style="{ marginTop: '1rem' }">
      <div>
        <a-row style="padding: 3%" type="flex" justify="space-around" >
          <a-col :xs="22" :sm="22" :md="12" :lg="12" :xl="6">

            <br/>
            <a-card >
              <div style="text-align: center;margin-bottom: 1rem">
                <img alt="logo"  src="@/assets/images/logobg.svg" style="width: 25%;">
              </div>


              <a-alert v-if="state.error" :message="state.error" type="error"/>

              <a-form
                  :model="formState"
                  name="Login"
                  autocomplete="off"
                  @finish="onFinish"
                  @finishFailed="onFinishFailed"
              >
                <a-form-item
                    :label-col="{span:24}"
                    :wrapper-col="{ span: 24 }"
                    has-feedback label="Email"
                    name="email"
                    validate-trigger="blur"
                    :rules="[{ required: true, message: 'Please input your email!' },{type:'email',message:'Input a valid email!'}]"
                >
                  <a-input v-model:value="formState.email" placeholder="Email"/>
                </a-form-item>

                <a-form-item
                    :label-col="{span:24}"
                    :wrapper-col="{ span: 24 }"
                    has-feedback label="Password"
                    name="password"
                    :rules="[{ required: true, message: 'Please input your password!' }]"
                >
                  <a-input-password v-model:value="formState.password" placeholder="Password" autocomplete="off"/>
                </a-form-item>


                <a-form-item>
                  <a-button style="width: 100%" :disabled="buttonDisabled" :loading="state.loading" type="primary"
                            html-type="submit">Submit
                  </a-button>
                  <br/>
                </a-form-item>


                <p>
                  Or
                  <a>
                    <router-link to="/Register"> Register on CodelnPay afresh!</router-link>
                  </a>
                </p>
                <p>

                  <a href="https://www.codeln.com/forgot">
                     Forgot Codeln Password?
                  </a>
                </p>
              </a-form>
            </a-card>
          </a-col>
        </a-row>


      </div>
    </a-layout-content>
    <Footer/>
  </a-layout>
</template>

<script>
import {defineComponent, reactive, computed} from 'vue';
import Footer from "../../../components/HomeLayout/Footer.vue";
import Header from "../../../components/HomeLayout/Header.vue";
import {useRouter} from "vue-router/dist/vue-router";
import {useStore} from 'vuex';
import AuthService from "../../../services/AuthService";
import CodelnAuth from "../../../services/CodelnAuth";
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

export default defineComponent({
  components: {Header, Footer},
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      loading: false,
      error: null,
      profile: null,


    });
    const formState = reactive({
      email: '',
      password: '',

    });
    const buttonDisabled = computed(() => {
      return !(formState.email && formState.password);

    });
    const onFinish = (values) => {
      state.loading = true;
      CodelnAuth.login(values)
          .then(resp => {

            state.profile = resp.data;
            formatRegistrationData();

          })
          .catch(err => {
            if (err.response.status === 400) {
              state.error = err.response.data.non_field_errors;
            }
            state.loading = false;

          });
    };
    const formatRegistrationData = () => {
      let phone = '+254 790 000000';
      let profile_type = 'employee';
      let company = 'employee';
      if (state.profile.user_type) {
        if (state.profile.user_type === 'recruiter') {
          profile_type = 'employer';
        }
      }
      if (state.profile.company) {
        company = state.profile.company;
      }
      if (formState.profile_type === 'employee') {
        formState.company = 'employee';
      }
      if (state.profile.phone_number.length > 15) {
        phone = JSON.parse(state.profile.phone_number).formatInternational;

      }
      let country = 'GH'
      if(state.profile.country){
        country = state.profile.country
      }

      let registrationObj = {
        first_name: state.profile.user.first_name,
        last_name: state.profile.user.last_name,
        email: state.profile.user.email,
        password1: formState.password,
        password2: formState.password,
        country: country,
        phone: phone,
        profile_type: profile_type,
        company: company,

      };


      registerUser(registrationObj)
    };
    const registerUser = (data)=>{
      AuthService.register(data)
          .then(() => {
            login();
          })
          .catch(err => {


            if (err.response.status === 400) {
              state.loading = false;
              if(err.response.data.email){
                state.error = err.response.data.email
              }
              else if(err.response.data['non_field_errors']){
                state.error ='The password is too similar to some of your user data.Create a fresh account on Codeln pay with stronger password or Change your password on Codeln'

              }else {
                state.error =err.response.data['non_field_errors']
              }
              addDoc(collection(db, "codelnsignupIssues"), {
                email: formState.email,
                backend: err.response.data,

              })

            }else {
              state.loading = false;
              state.error = 'Please refresh page'
              addDoc(collection(db, "codelnsignupIssues"), {
                email: formState.email,
                backend: err.response.data,

              })
            }
            state.loading = false;
            throw new Error(err.response);
          });
    }
    const login = () => {
      let values = {
        email: formState.email,
        password: formState.password

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

    const onFinishFailed = (errorInfo) => {
      return errorInfo;
    };
    const formatNumber = (phone) => {
      return JSON.parse(phone);
    };
    return {
      state,
      formState,
      buttonDisabled,
      onFinish,
      onFinishFailed,
      formatNumber

    };
  }
});
</script>

<style scoped>

</style>