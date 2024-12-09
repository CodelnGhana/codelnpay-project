<template>
  <EmployeeBaseLayout>
    <PaymentInvitations/>

  </EmployeeBaseLayout>
</template>

<script>
import EmployeeBaseLayout from "../../components/EmployeesComponents/layout/EmployeeBaseLayout.vue";
import PaymentInvitations from "../../components/EmployeesComponents/PaymentInvitationsComponent/PaymentInvitations.vue";
export default {
  name: "InvitationsView",
  components:{
    EmployeeBaseLayout,
    PaymentInvitations
  }
};
</script>

<style scoped>

</style>