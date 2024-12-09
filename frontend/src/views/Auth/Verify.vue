<template>
  <div class="verifyPage">

    <a-row type="flex" justify="space-around">
      <a-col :xs="22" :sm="22" :md="12" :lg="12" :xl="6">
        <div class="container">
          <p class="logotitle">CodeLn Pay</p>
          <a-card title="Verify your identity">
            <a-alert v-if="state.error" :message="state.error" type="error"/>

            <p>For Account security a 2fa code is required to continue</p>
            <p>Enter the code sent to your email</p>

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
                  has-feedback label="Code"
                  name="code"
                  :rules="[{ required: true, message: 'Please input  code!' }]"
              >
                <a-input v-model:value="formState.code"/>
              </a-form-item>


              <a-form-item>
                <a-button :disabled="buttonDisabled" :loading="state.loading" type="primary" html-type="submit">Submit
                </a-button>
                <a-button style="margin-left: 10px" @click="handleClick('Login')">Cancel</a-button>
              </a-form-item>
            </a-form>

          </a-card>
        </div>
      </a-col>

    </a-row>


  </div>

</template>

<script>
import {defineComponent, reactive, computed} from 'vue';
import {useRouter} from "vue-router/dist/vue-router";
import AuthService from "../../services/AuthService";
import {useStore} from 'vuex';
import {notification} from 'ant-design-vue';

export default defineComponent({
  setup() {
    const state = reactive({
      loading: false,
      error: null

    });
    const store = useStore();
    const token = computed(() => store.state.auth.ephemeral_token);


    const formState = reactive({
      code: '',
    });
    const buttonDisabled = computed(() => {
      return !(formState.code);

    });
    const onFinish = () => {
      verifyCode();
    };
    const onFinishFailed = (errorInfo) => {
      return errorInfo;

    };
    const router = useRouter();
    const handleClick = (e) => {
      router.push({
        name: e
      });

    };

    const verifyCode = () => {
      let credObj = {
        ephemeral_token: token.value,
        code: formState.code
      };
      state.loading = true;


      AuthService.verifyCode(credObj)
          .then((resp) => {

            let twentyMinutesLater = new Date();
            twentyMinutesLater.setMinutes(twentyMinutesLater.getMinutes() + Number(import.meta.env.VITE_APP_EXP));

            state.loading = false;
            store.dispatch('auth/setToken', resp.data.access);
            store.dispatch('auth/setRefresh', resp.data.refresh);
            store.dispatch('auth/setProfile',resp.data.profile)
            store.dispatch('auth/setExpiration',twentyMinutesLater)
            store.dispatch('auth/setProfileType', resp.data.profile.profile_type)

            if(resp.data.profile.profile_type === 'employer'){
              router.push({
                name: 'EmployerDashBoard'
              });
            }else {
              router.push({
                name: 'DashBoard'
              });


            }


          })
          .catch(err => {
            state.loading = false;

            if (err.response.status === 401) {
              state.error = err.response.data.error;

            }
            store.dispatch('auth/setEphToken', '');
            openNotification('warning');
            router.push({
              name: 'Login'
            });


          });

    };
    const openNotification = type => {
      notification[type]({
        message: 'Session Expired',
        description: 'Login to get a new code.',

      });
    };
    return {
      state,
      formState,
      buttonDisabled,
      onFinish,
      onFinishFailed,
      handleClick,


    };
  }
});
</script>

<style scoped>
.verifyPage {
  height: 100vh;
  background: #3E4878;

}

.logotitle {
  margin-top: 3%;
  font-size: 1.5rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  color: white;
  text-align: center;


}

.container {
  margin-top: 20%;
}
</style>