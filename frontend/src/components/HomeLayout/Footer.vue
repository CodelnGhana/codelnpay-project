<template>
  <a-layout-footer class="footerSection">
    <section  >
      <p class="logotitle">CodeLn Pay</p>

      <a href="mailto:info@codeln.com" target="_top" style="color:white;">
       Email us. info@codeln.com
      </a>
      <p>
        <router-link to="PrivacyPolicy" style="color:white;">
          Privacy Policy
        </router-link>

      </p>
<!--      <p>-->
<!--        <router-link to="Attributions" style="color:white;">-->
<!--         Attributions-->
<!--        </router-link>-->

<!--      </p>-->
      <span>
        Banking services in the U.S. are provided by Community Federal Savings Bank (CFSB).
        <br/>
International payment services are provided by licensed Money Services Businesses in their respective geographies.
        <br/>
        Crypto payments are processed on the Stellar network.


      </span>

    </section>
  </a-layout-footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped>
.footerSection{
  color: white;
  padding: 3rem 10% 5rem 10%;
  min-height: 20vh;
  background-color: #030852;
}
.logotitle {
  margin-top: 3%;
  font-size: 1.5rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;



}
/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {
  .footerSection{

    padding: 3rem 15% 5rem 15%;
  }

}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {
  .footerSection{

    padding: 3rem 10% 5rem 10%;
  }

}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {
  .footerSection{

    padding: 3rem 10% 5rem 10%;
  }

}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {
  .footerSection{

    padding: 3rem 8%;
  }

}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {
  .footerSection{

    padding: 3rem 5% 5rem 5%;
  }

}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {
  .footerSection{

    padding: 3rem 5% 5rem 5%;
  }

}
/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {
  .footerSection{

    padding: 3rem 5% 5rem 5%;
  }




}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {
  .footerSection{

    padding: 3rem 5% 5rem 5%;
  }

}
</style>
