<template>
  <a-layout style="min-height: 100vh;">
    <Header/>
    <a-layout-content :style="{ marginTop: '1rem' }">


        <a-row style="padding: 3%" type="flex" justify="space-around">
          <a-col :xs="22" :sm="22" :md="12" :lg="12" :xl="6" >

            <a-card title="Forgot Password">
              <a-alert v-if="state.emailSent"
                       description="Password Reset email has been sent to the email."
                       type="info"
              />
              <div v-else>
                <a-alert v-if="state.error" :message="state.error" type="error" />
                <a-form
                    :model="formState"
                    name="Forgot Password"
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




                  <a-form-item>
                    <a-button style="width: 100%" :disabled="buttonDisabled" :loading="state.loading" type="primary" html-type="submit">Submit</a-button>
                    <br/>
                  </a-form-item>



                  <p>
                    Or
                    <a>
                      <router-link to="/Register"> Register now!</router-link>
                    </a>
                  </p>

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
import {defineComponent, reactive, computed} from 'vue';
import Header from "../../../components/HomeLayout/Header.vue";
import Footer from "../../../components/HomeLayout/Footer.vue";
import AuthService from "../../../services/AuthService";

export default defineComponent( {
  components: {Header,Footer},
  setup(){
    const state = reactive({
      loading: false,
      error:null,
      emailSent:false

    });
    const formState = reactive({
      email: '',
    });
    const buttonDisabled = computed(() => {
      return !(formState.email);

    });
    const onFinish = (values)=>{
      state.loading = true
      AuthService.forgot(values)
          .then(()=>{
            state.loading = false
            state.emailSent =true

          })
          .catch(err=>{

            if(err.response.status === 400){
              state.error = err.response.data.error
            }
            state.loading = false

          })
    }

    const onFinishFailed = (errorInfo)=>{
      return errorInfo;
    }
    return{
      state,
      formState,
      buttonDisabled,
      onFinish,
      onFinishFailed,

    }

  }
})
</script>

<style scoped>

</style>