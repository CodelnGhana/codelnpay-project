<template>
  <div>



    <a-spin v-if="state.loading" :indicator="indicator" />
    <div v-if="state.user">
      Verification status
      <a-tag >
        {{state.user.verifications[0].status.friendly}}
      </a-tag>

    </div>
    <div v-if="state.verified">
      Verification status:
      <a-tag color="#87d068">
        Complete
      </a-tag>

    </div>
    <div v-else>
      <p>What will be required</p>
      <p>Documents (one of these):</p>
      <ul>
        <li>National ID card</li>
        <li>International passport </li>
        <li>Drivers license</li>
        <li>Voter’s card</li>

      </ul>
      <p>User</p>
      <ul>
        <li>Selfie comparison </li>
      </ul>
      <a target="_blank" :href="state.magicLink" v-if="state.magicLink">
        <a-button @click="getMagicLink" type="primary">
          <template #icon><CheckOutlined /></template>
          Get Verified
        </a-button>
      </a>
    </div>


  </div>
</template>

<script>
import {defineComponent, reactive,onMounted,h} from 'vue';
import KycService from "../../services/KycService";
import {useStore} from "vuex";
import ProfileService from "../../services/ProfileService";
import { CheckOutlined,LoadingOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  name: "KycBoard",
  components:{
    CheckOutlined
  },
  setup() {
    const store = useStore()
    const state = reactive({
      users: '',
      user: null,
      magicLink: '',
      profile:null,
      verified:false,
      loading:false

    });
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: '24px',
      },
      spin: true,
    });
    onMounted(()=>{

      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      state.loading = true
      let slug = store.state.auth.profile['profile_slug']

      ProfileService.getProfile(slug,auth)
          .then(resp=>{
            state.profile = resp.data
            if(state.profile.verification.length>0){

              if(state.profile.verification[0].id){


                if(state.profile.verification[0].status === 'verification.completed'){

                  state.verified = true
                  state.loading = false

                }else {


                  getUser()
                }
              }
            } else {

              createUser()
            }
          })

    })


    const getUser = () => {

      const auth = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + import.meta.env.VITE_APP_TRUST_API_KEY,
        }

      };

      KycService.getUser(state.profile.verification[0].id, auth)
          .then(resp => {
            state.user = resp.data.data;
            if(state.user.verifications[0].status.friendly ==='Pending'){
              getMagicLink()
            }
          })
          .catch(() => {
            state.loading = false

          });
    };
    const createUser = () => {
      const auth = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + import.meta.env.VITE_APP_TRUST_API_KEY,
        }

      };
      let userObj = {
        "reference_id": state.profile.profile_slug,
        "first_name": state.profile.user.first_name,
        "last_name": state.profile.user.last_name,
        "email": state.profile.user.email,
        'template_id': 'tmpl_MQ'

      };
      KycService.createUser(userObj, auth)
          .then(resp => {

            state.magicLink = resp.data.magic_link
            saveKycData(resp.data)
          });

    };
    const saveKycData = (trulyData)=>{
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };

      let slug = state.profile.profile_slug
      let patchData =[{
        'id':trulyData.id,
        'provider':'trust_swiftly',
        'status':'created'

      }]
      ProfileService.patchProfile(slug,{'verification':patchData},auth)
          .then(resp=>{
            state.profile = resp.data
            state.loading = false

          })

    }
    const getMagicLink = () => {
      const auth = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + import.meta.env.VITE_APP_TRUST_API_KEY,
        }
      };
      let data = {
        'expiration_hours': 24
      };
      KycService.getMagicLink(state.profile.verification[0].id, data, auth)
          .then(resp => {
            state.loading = false

            state.magicLink = resp.data.short_url;

          });

    };

    return {
      state,
      getUser,
      createUser,
      getMagicLink,
      indicator

    };
  }

});
</script>

<style scoped>

</style>