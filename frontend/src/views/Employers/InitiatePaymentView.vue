<template>
  <EmployerBaseLayout>
    <PaymentCreationWizard/>
  </EmployerBaseLayout>
</template>

<script>
import EmployerBaseLayout from "../../components/EmployersComponents/layout/EmployersBaseLayout.vue";
import PaymentCreationWizard from "../../components/EmployersComponents/InitiatePaymentComponents/PaymentCreationWizard.vue";
export default {
  components:{
    EmployerBaseLayout,
    PaymentCreationWizard
  }
};
</script>

<style scoped>

</style>