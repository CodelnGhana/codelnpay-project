<template>
  <EmployerBaseLayout>
    <PayoutReview/>
  </EmployerBaseLayout>
</template>

<script>
import EmployerBaseLayout from "../../components/EmployersComponents/layout/EmployersBaseLayout.vue";
import PayoutReview from "../../components/EmployersComponents/RecentPayouts/PayoutReview.vue";
export default {
  name: "PaymentInvoiceView",
  components:{
    EmployerBaseLayout,
    PayoutReview
  }
};
</script>

<style scoped>

</style>