<template>
  <a-layout style="min-height: 100vh;">
    <Header/>
    <a-layout-content :style="{ marginTop: '1rem' }">


      <a-row style="padding: 3%" type="flex" justify="space-around" >
        <a-col :xs="22" :sm="22" :md="12" :lg="12" :xl="6">

          <a-card title="Reset Password">

            <div>
              <a-alert v-if="state.error" :message="state.error" type="error" />

              <a-form
                  ref="formRef"
                  name="custom-validation"
                  :model="formState"
                  :rules="rules"
                  @finish="handleFinish"
                  @validate="handleValidate"
                  @finishFailed="handleFinishFailed"
              >
                <a-form-item has-feedback label="New Password" name="pass"
                             :label-col="{span:24}"
                             :wrapper-col="{ span: 24 }"
                >
                  <a-input v-model:value="formState.pass" type="password" autocomplete="off"/>
                </a-form-item>
                <a-form-item has-feedback label="Confirm Password" name="checkPass"
                             :label-col="{span:24}"
                             :wrapper-col="{ span: 24 }"
                >
                  <a-input v-model:value="formState.checkPass" type="password" autocomplete="off"/>
                </a-form-item>


                <a-form-item>
                  <a-button style="width: 100%"  :loading="state.loading" type="primary"
                            html-type="submit">Submit
                  </a-button>
                  <br/>
                </a-form-item>


              </a-form>
            </div>

          </a-card>

        </a-col>
      </a-row>

    </a-layout-content>
    <Footer/>
  </a-layout>
</template>

<script>
import {defineComponent, reactive, ref} from 'vue';
import Header from "../../../components/HomeLayout/Header.vue";
import Footer from "../../../components/HomeLayout/Footer.vue";
import AuthService from "../../../services/AuthService";
import {useRouter} from "vue-router/dist/vue-router";
import { message } from 'ant-design-vue';
export default defineComponent({
  components: {Header, Footer},
  setup() {
    const router = useRouter();
    const state = reactive({
      loading: false,
      error: null,
      uid: router.currentRoute.value.params.uid,
      token: router.currentRoute.value.params.token


    });
    const formRef = ref();
    const formState = reactive({
      pass: '',
      checkPass: '',
    });
    let validatePass = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('Please input the password');
      } else {
        if (formState.checkPass !== '') {
          formRef.value.validateFields('checkPass');
        }
        return Promise.resolve();
      }
    };
    let validatePass2 = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('Please input the password again');
      } else if (value !== formState.pass) {
        return Promise.reject("Two inputs don't match!");
      } else {
        return Promise.resolve();
      }
    };
    const rules = {
      pass: [
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
      checkPass: [{
        validator: validatePass2,
        trigger: 'change',
      }],

    };


    const handleFinishFailed = errors => {

      return errors
    };

    const handleValidate = (...args) => {
      return args

    };


    const handleFinish = (values)=>{
      state.loading = true

      let resetObject = {
        uid:state.uid,
        new_password1:values.pass,
        new_password2:values.checkPass,
        token:state.token

      }
      AuthService.reset(resetObject)
          .then((resp)=>{
            state.loading = false
            message.info(resp.data.detail);
            router.push({
              name: 'Login'
            })
          })
          .catch(err=>{
            if(err.response.status === 400){
              state.error = 'Reset link has expired .Do request a new one under forgot password'
            }
            state.loading = false

          })
    }


    return {
      state,
      formState,
      formRef,
      rules,
      handleFinishFailed,
      handleFinish,
      handleValidate,

    };

  }
});
</script>

<style scoped>

</style>