<template>
  <EmployerBaseLayout>
    <PayrollManager/>
  </EmployerBaseLayout>

</template>

<script>
import EmployerBaseLayout from "../../components/EmployersComponents/layout/EmployersBaseLayout.vue";
import PayrollManager from "../../components/EmployersComponents/EmployeeManager/EmployeeManagerMask.vue";
export default {
  name: "PayrollManagerView",
  components:{
    EmployerBaseLayout,
    PayrollManager
  }
};
</script>

<style scoped>

</style>