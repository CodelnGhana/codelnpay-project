<template>
  <EmployeeBaseLayout>
    <MainCta/>
  </EmployeeBaseLayout>

</template>

<script>
import EmployeeBaseLayout from "../../components/EmployersComponents/layout/EmployersBaseLayout.vue";
import MainCta from "../../components/EmployersComponents/DashboardComponents/MainCta.vue";
import Invoices from "../../components/EmployeesComponents/Invoices/Invoices.vue";

export default {
  name: "EmployerDashBoard",

  components: {
    EmployeeBaseLayout,
    MainCta,
    Invoices
  }
};
</script>

<style scoped>


</style>