<template>
  <EmployeeBaseLayout>
    <a-card style="border-radius: 0">
      <template #title>
        Crypto Wallet Manager
      </template>
    <CryptoAccountsManager/>
    </a-card>
  </EmployeeBaseLayout>

</template>

<script>
import {defineComponent} from 'vue';
import EmployeeBaseLayout from "../../components/EmployeesComponents/layout/EmployeeBaseLayout.vue";
import CryptoAccountsManager from "../../components/EmployeesComponents/CryptoAccountsComponents/CryptoAccountsManager.vue";
export default defineComponent( {
  components:{
    EmployeeBaseLayout,
    CryptoAccountsManager
  }
})
</script>

<style scoped>

</style>