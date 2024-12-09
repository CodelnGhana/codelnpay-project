<template>
<HomeBaseLayout>
  <section class="heroSection">
    <a-row style="padding: 3%" type="flex" justify="space-around" align="middle">
      <a-col :xs="22" :sm="22" :md="20" :lg="20" :xl="20" class="textColor">
        <section>
          <p class="herotitle">Who we are</p>
          <p>
            CodeLnPay is a product of CodeLn Technologies Limited (“we”, “our”, “us”) and operate under the name
            of Codeln Pay. We’re committed to protecting and respecting your privacy.
            If you have any questions about your personal information please send us a message
            on our chat app, or email us at info@codeln.com
          </p>
        </section>
        <section>
        <p class="herotitle">
          The information we hold about you.
        </p>

          <p>Information submitted through our app</p>
          <p>When you sign up on Codeln Pay, you are asked to input information such as your first, last name and your email address. This information is then used to create your account, identify you when you login and send you the latest updates and notifications. For users accepting payments on Codeln Pay, we will need to verify your identity for compliance. You will be required to share your ID card and selfie photo, this service is managed by our partner Trust Swiftly.</p>
          <p>Information from your browser</p>
          <p>This information includes your IP address, browser type, browser version, the pages of our app that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data your internet browser sends when you use our service or access our website.</p>
          <p>Tracking and Cookies Data</p>
          <p>Cookies are small bits of data stored as text files on a browser. We use those small bits of data to personalize our user’s experience on Codeln Pay.</p>

        </section>
        <section>
          <p class="herotitle">How we use your information</p>

          <p>To provide our services, we use your personal information to:</p>
          <ul>
            <li>Create your account</li>
            <li>Verify your identity when you sign into the app</li>
            <li>Communicate new features and recent changes in the app to you</li>
            <li>Carry out technical analysis in order to improve our services</li>
            <li>Provide traffic reports and feedback on the app</li>
            <li>Maintain a smooth relationship with you, by acknowledging your queries and feedbacks</li>
            <li>Provide you with information and to notify you of services relating to our product</li>
            <li> Monitor and manage your usage of our product.</li>
          </ul>
        </section>
        <section>
          <p class="herotitle">Who we share it with</p>

         <p>
           We don’t share any personally identifying information publicly, we may share it with;
         </p>
          <ul>
            <li>Anyone who works with us when they need it to carry out tasks,</li>
            <li>
              Any third-party organization that support any of our services you use, when they need to provide those services,
              <ol>
                <li>Fullstory: records user journey on our apps so we can make it the best possible version of itself. It literally tracks and records our page traffic.</li>
                <li>Trust Swiftly: We use this third-party service for Identity Verification.</li>
                <li>MailJet: We use this service to send users email updates and notifications.</li>
                <li>Crisp chat: We use this service to power the Codeln Pay engagement, where users questions are answered</li>
              </ol>
            </li>
            <li> Certain Authorities that prevent and detect terrorism and fraud, only when an official request is made.</li>
            <li> Anyone who you give us explicit permission to share your data.</li>
          </ul>







        </section>
        <section>
          <p class="herotitle">
            How secure is your information
          </p>
          <p>
            You are very important to us that is the reason we take the security of your information and our third-party service providers very seriously. We store personal
            information in our secured server managed by us and our service providers. The security measures include firewalls, data encryption, and information access authorization controls.
          </p>
        </section>
        <section>
          <p class="herotitle">
            Can children use our services
          </p>

          <p>
            Our sites and services are not aimed at children under the age of 18. We do not knowingly collect information,
            including Personal Data, from children or other individuals who are not legally able to use our site and services.
          </p>
        </section>
        <section>
          <p class="herotitle">
            Licensing
          </p>

          <p>
            Codeln Pay is not a bank, we do not process money directly. We are duly registered in the United States and
            we operate through regulated institutions in all the geographies in which we are available. Our banking products are offered
            by our licensed partners in the US by Cross River Bank (member, FDIC) and Community Federal Savings Bank. In Canada by DC Bank, Royal Bank of
            Canada, and Peoples Trust Bank. And in other regions by licensed Money Services Businesses in the respective geographies
          </p>
        </section>
        <section>
          <p class="herotitle">What else you should know</p>
          <p>
            We may need to revise this policy from time to time to reflect changes to our sites or our services.
            When we do change the policy, we will make sure to notify you about such changes,
            these changes would be passed across to you via email. The revised policy will be effective as of the published effective date.
          </p>
        </section>
        <section>
          <p class="herotitle">
            Contact us
          </p>
          <p>
            You may contact us if you have general questions about our policy and practices or questions about your profile or personal information.
            Please contact us by email – info@codeln.com
          </p>
        </section>
        <p>
          Last revised: 3rd July, 2023
        </p>

      </a-col>
    </a-row>

  </section>

</HomeBaseLayout>
</template>

<script>
import HomeBaseLayout from "../../components/HomeLayout/HomeBaseLayout.vue";
import {useStore} from "vuex";
import {computed, inject, onMounted, reactive, watch} from "vue";
export default {
  name: "Privacy",
  components:{
    HomeBaseLayout
  },
  setup() {
    const state = reactive({
      currentTheme: localStorage.getItem("theme"),
      themeVars : {},
      defaultVars:inject('defaultVars'),
      darkModeVars:inject('darkModeVars')
    })
    onMounted(()=>{
      window.addEventListener('themeChanged', (event) => {
        state.currentTheme = event.detail.storage;
        if(state.currentTheme === 'dark'){
          state.themeVars = state.darkModeVars
        }else {
          state.themeVars = state.defaultVars
        }
      });
    })
    if(state.currentTheme === 'dark'){
      state.themeVars = state.darkModeVars
    }else {
      state.themeVars = state.defaultVars
    }

    return {
      state,


    }
  },
};
</script>

<style scoped>
.textColor{
  color: v-bind(state['themeVars']['color']);
}
.herotitle {
  font-size: 1.8rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.heroSection {
  padding: 0 15%;
  background-color: v-bind(state['themeVars']['backgroundColor']);

}


/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {


}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {


  .heroSection {
    padding: 0 10%;

  }

}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {




  .heroSection {
    padding: 0 10%;

  }

}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {



  .heroSection {
    padding: 0 8%;

  }

}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {



  .heroSection {
    padding: 0 5%;

  }

}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {


  .herotitle {
    font-size: 1.5rem;

  }

  .heroSection {
    padding: 0 5%;

  }


}

/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {
  .herotitle {
    font-size: 1.2rem;


  }
  .heroSection {
    padding: 0 5%;


  }


}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {


  .herotitle {
    font-size: 1.2rem;



  }
  .heroSection {
    padding: 0 5%;


  }



}
</style>