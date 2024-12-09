<template>
<EmployeeBaseLayout>
  <WalletManager/>

</EmployeeBaseLayout>
</template>

<script>

import EmployeeBaseLayout from "../../components/EmployeesComponents/layout/EmployeeBaseLayout.vue";
import WalletManager from "../../components/EmployeesComponents/WalletComponents/WalletManager.vue";
export default {
  name: "WalletView",
  components:{
    EmployeeBaseLayout,
    WalletManager
  }
};
</script>

<style scoped>

</style>