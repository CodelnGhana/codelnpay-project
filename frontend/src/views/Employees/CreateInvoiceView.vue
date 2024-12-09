<template>
  <EmployeeBaseLayout>



      <InvoiceCreateWizard/>


  </EmployeeBaseLayout>

</template>

<script>
import {defineComponent} from 'vue';
import EmployeeBaseLayout from "../../components/EmployeesComponents/layout/EmployeeBaseLayout.vue";
import InvoiceCreateWizard from "../../components/EmployeesComponents/Invoices/InvoiceCreateWizard.vue";
import { useRouter } from 'vue-router'
export default defineComponent({
  components:{
    EmployeeBaseLayout,
    InvoiceCreateWizard
  },
  setup(){
    const router = useRouter()
    const handleClick = (e)=>{
      router.push({
        name: e
      })

    }
    return{
      handleClick

    }

  }
});
</script>

<style scoped>

</style>