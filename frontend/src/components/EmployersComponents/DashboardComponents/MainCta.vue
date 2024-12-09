<template>


  <a-card style="width: 100%;border-radius: 0;" :body-style="{'padding':'0'}">
    <template #title>
      Hello
      <span v-if="state.profile" class="capitalize">
        {{ state.profile.user.first_name }}
      </span>
    </template>
    <template #extra>
      {{ state.day }}
    </template>

    <a-card class="ctaCard">

      <a-row :gutter="[8,8]">
        <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="margin-bottom: 1rem">
          <p class="ctaTitle" >Send Payment </p>
          <p>Manage employees and send payments </p>

          <a-button type="primary" class="buttonbar" :block="isMobile" @click="handleClick('InitiatePayment')">Initiate Payment</a-button>
        </a-col>
        <a-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
          <a-row :gutter="[16,16]">


            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
              <a-card @click="handleClick('PayrollManager')" hoverable>
                <img class="ctaimages" src="@/assets/images/props/workers.png"/>
                <p>Manage Employees</p>
              </a-card>


            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8" v-if="isMobile">
              <a-card @click="handleClick('RecentPayouts')" hoverable>
                <img class="ctaimages" src="@/assets/images/props/workers.png"/>
                <p>Recent Payments</p>
              </a-card>


            </a-col>

          </a-row>
        </a-col>
      </a-row>

    </a-card>

    <div style="padding: 24px" class="hideMobile">
      <p class="recentTitle">Recent Payments</p>

      <RecentPayouts/>
    </div>


  </a-card>


</template>

<script>
import {defineComponent, computed, onMounted, onUnmounted, reactive, inject} from 'vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {PlusOutlined} from '@ant-design/icons-vue';
import RecentPayouts from "../RecentPayouts/RecentPayouts.vue";
import CreateEditEmployee from "../EmployeeManager/NewEmployeeManager/CreateEditEmployee/CreateEditEmployee.vue";
import ProfileService from "../../../services/ProfileService";
import {AuditOutlined, SolutionOutlined, FileTextOutlined} from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    PlusOutlined,
    RecentPayouts,
    CreateEditEmployee,

    AuditOutlined,
    SolutionOutlined,
    FileTextOutlined
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      size: window.innerWidth,
      profile:null,
      day: new Date().toLocaleDateString('default', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}),
      currentTheme: localStorage.getItem("theme"),
      themeVars : {},
      defaultVars:inject('defaultVars'),
      darkModeVars:inject('darkModeVars')
    });
    if(state.currentTheme === 'dark'){
      state.themeVars = state.darkModeVars
    }else {
      state.themeVars = state.defaultVars
    }


    const handleClick = (e) => {
      router.push({
        name: e
      });

    };
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
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      let slug = store.state.auth.profile['profile_slug'];

      ProfileService.getProfile(slug, auth)
          .then(resp => {
            state.profile = resp.data;
          });


    });
    onUnmounted(() => {
      window.removeEventListener("resize", devicewidth);
    });


    const devicewidth = (e) => {
      state.size = e.srcElement.innerWidth;
    };
    const isMobile = computed(() => {
      return state.size <= 425;
    });


    return {
      state,
      handleClick,
      refreshToken: computed(() => store.state.auth.refresh),
      accessToken: computed(() => store.state.auth.token),
      isMobile,


    };

  }

});
</script>

<style scoped>
.buttonbar {
  height: 2.8rem;
  width: 12rem;
  font-size: 1rem;


}
.ctaCard{
  background-color: v-bind(state['themeVars']['dashBoard']);
  border-radius: 0
}
.ctaimages{
  width: 15%;
  filter: v-bind(state['themeVars']['filter']);
}


.ctaTitle {
  font-size: 1.5rem;
  font-family: 'Poppins', sans-serif;
  color: v-bind(state ['themeVars'] ['color']);
  font-weight: 600;
}

.recentTitle {
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  color: v-bind(state ['themeVars'] ['color']);
  font-weight: 600;
}
.capitalize {
  text-transform: capitalize;
}

/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {

}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {
  .ctaimages{
    width: 20%;
  }


}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {
  .ctaimages{
    width: 20%;
  }

}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {
  .ctaimages{
    width: 20%;
  }

}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {
  .ctaimages{
    width: 20%;
  }

}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {
  .ctaimages{
    width: 18%;
    display: block;
  }

}

/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {
  .ctaimages{
    display: none;
    width: 35%;
  }
  .buttonbar {
    width: 100%;
  }

}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .ctaimages{
    display: none;
    width: 35%;
  }
  .buttonbar {
    width: 100%;
  }

}
</style>