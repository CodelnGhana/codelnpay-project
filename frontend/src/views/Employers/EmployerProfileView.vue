<template>
  <EmployersBaseLayout>
    <Profile/>
  </EmployersBaseLayout>

</template>

<script>
import EmployersBaseLayout from "../../components/EmployersComponents/layout/EmployersBaseLayout.vue";
import Profile from "../../components/ProfileComponent/Profile.vue";
export default {
  name: "EmployerProfileView",
  components:{
    EmployersBaseLayout,
    Profile
  }
};
</script>

<style scoped>

</style>