<template>
  <EmployeeBaseLayout>
    <a-card style="border-radius: 0">
      <template #title>
        All Withdrawals
      </template>
    <AllWalletTransactions/>
    </a-card>
  </EmployeeBaseLayout>

</template>

<script>
import EmployeeBaseLayout from "../../components/EmployeesComponents/layout/EmployeeBaseLayout.vue";
import AllWalletTransactions from "../../components/EmployeesComponents/WalletComponents/AllWalletTransactions.vue";
export default {
  name: "AllWithdrawals",
  components:{
    EmployeeBaseLayout,
    AllWalletTransactions
  }
};
</script>

<style scoped>

</style>