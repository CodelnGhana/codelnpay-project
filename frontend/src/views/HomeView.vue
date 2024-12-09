<template>
  <HomeBaseLayout >

    <Hero  />
    <ClientPitch  />
    <DevPitch />
    <Location  />
    <Features  />
    <Faq  />
    <HomeCta  />
  </HomeBaseLayout>




</template>

<script>
import HomeBaseLayout from "../components/HomeLayout/HomeBaseLayout.vue";
import Hero from "../components/HomeComponents/Hero.vue";
import ClientPitch from "../components/HomeComponents/ClientPitch.vue";
import DevPitch from "../components/HomeComponents/DevPitch.vue";
import Location from "../components/HomeComponents/Location.vue";
import Features from "../components/HomeComponents/Features.vue";
import HomeCta from "../components/HomeComponents/HomeCta.vue";
import Faq from "../components/HomeComponents/Faq.vue";
import { defineComponent} from "vue";


export default defineComponent( {

  components:{
    HomeBaseLayout,Hero,ClientPitch,DevPitch,Location,Features,HomeCta,Faq
  },
  setup() {
    return {};
  }
});
</script>

<style scoped>

</style>