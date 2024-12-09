<template>
  <EmployeeBaseLayout>
    <Profile/>

  </EmployeeBaseLayout>
</template>

<script>
import EmployeeBaseLayout from "../../components/EmployeesComponents/layout/EmployeeBaseLayout.vue";
import Profile from "../../components/ProfileComponent/Profile.vue";
export default {
  name: "ProfileView",
  components:{
    EmployeeBaseLayout,
    Profile
  }
};
</script>

<style scoped>

</style>