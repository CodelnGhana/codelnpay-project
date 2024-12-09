<template>
  <HomeBaseLayout>
    <a-row style="margin-top: 2%">

      <a-col :xs="{ span: 24, offset: 0 }" :sm="{ span: 24, offset: 0 }" :md="{ span: 18, offset: 3 }" :lg="{ span: 16, offset: 4 }" :xl="{ span: 12, offset: 6 } ">
        <BulkInvoice/>
      </a-col>
    </a-row>

  </HomeBaseLayout>

</template>

<script>
import HomeBaseLayout from "../../components/HomeLayout/HomeBaseLayout.vue";
import BulkInvoice from "../../components/EmployersComponents/InitiatePaymentComponents/BulkInvoice.vue";
export default {
  name: "BulkInvoiceView",
  components:{
    HomeBaseLayout,
    BulkInvoice
  }
};
</script>

<style scoped>

</style>