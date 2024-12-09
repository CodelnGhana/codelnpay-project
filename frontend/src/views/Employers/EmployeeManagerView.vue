<template>
<EmployerBaseLayout>
  <NewEmployeeManager/>
</EmployerBaseLayout>
</template>

<script>
import EmployerBaseLayout from "../../components/EmployersComponents/layout/EmployersBaseLayout.vue";
import NewEmployeeManager from "../../components/EmployersComponents/EmployeeManager/NewEmployeeManager/NewEmployeeManager.vue";
export default {
  name: "EmployeeManagerView",
  components:{
    EmployerBaseLayout,
    NewEmployeeManager
  }
};
</script>

<style scoped>

</style>