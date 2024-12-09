<template>
  <a-layout style="min-height: 100vh;" class="content">
    <Header/>
    <a-layout-content :style="{ marginTop: '1rem' }">

      <div>
        <a-row style="padding: 3%" type="flex" justify="space-around">
          <a-col :xs="22" :sm="22" :md="12" :lg="12" :xl="6">
            <a-card title="Login">
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
                    <router-link to="/Register"> Register now!</router-link>
                  </a>
                </p>
                <p>

                  <a>
                    <router-link to="/ForgotPassword"> Forgot Password?</router-link>
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
import {defineComponent, reactive, computed, inject, watch, onMounted} from 'vue';
import Header from "../../components/HomeLayout/Header.vue";
import Footer from "../../components/HomeLayout/Footer.vue";
import AuthService from '../../services/AuthService'
import {useRouter} from "vue-router/dist/vue-router";
import {useStore} from 'vuex'

export default defineComponent({
  components: {Header, Footer},
  setup() {
    const router = useRouter()
    const store = useStore()

    const state = reactive({
      loading: false,
      error: null,
      currentTheme: localStorage.getItem("theme"),
      themeVars: {},
      defaultVars: inject('defaultVars'),
      darkModeVars: inject('darkModeVars')

    });
    onMounted(() => {
      window.addEventListener('themeChanged', (event) => {
        state.currentTheme = event.detail.storage;
        if (state.currentTheme === 'dark') {
          state.themeVars = state.darkModeVars
        } else {
          state.themeVars = state.defaultVars
        }
      });
    })
    if (state.currentTheme === 'dark') {
      state.themeVars = state.darkModeVars
    } else {
      state.themeVars = state.defaultVars
    }


    const formState = reactive({
      email: '',
      password: '',

    });

    const buttonDisabled = computed(() => {
      return !(formState.email && formState.password);

    });
    const onFinish = (values) => {
      state.loading = true
      AuthService.login(values)
          .then(resp => {
            state.loading = false
            store.dispatch('auth/setEphToken', resp.data.ephemeral_token)
            router.push({
              name: 'Verify'
            })
          })
          .catch(err => {
            if (err.response.status === 400) {
              state.error = err.response.data.error
            } else {
              state.loading = false
            }
            state.loading = false


          })
    }

    const onFinishFailed = (errorInfo) => {
      return errorInfo;
    }
    const throwError = () => {

      throw new Error('Sentry Error');


    }

    return {
      state,
      formState,
      buttonDisabled,
      onFinish,
      onFinishFailed,
      throwError,

    }

  },


});
</script>

<style scoped>
.content {
  background-color: v-bind(state ['themeVars'] ['backgroundColor']);
}
</style>