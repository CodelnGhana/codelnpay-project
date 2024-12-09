<template>
  <EmployeeBaseLayout>
    <a-card style="border-radius: 0" class="mobileMargin">
      <template #title>
        Manage Bank Accounts
      </template>
      <CreateEditAccount/>
    </a-card>




  </EmployeeBaseLayout>

</template>

<script>
import {defineComponent} from 'vue';
import EmployeeBaseLayout from "../../components/EmployeesComponents/layout/EmployeeBaseLayout.vue";
import CreateEditAccount from "../../components/EmployeesComponents/AccountsComponents/CreateEditAccount.vue";
import { useRouter } from 'vue-router'
export default defineComponent({
  components:{
    EmployeeBaseLayout,
    CreateEditAccount
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