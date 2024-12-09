<template>
<EmployerBaseLayout>
  <a-card style="width: 100%;border-radius: 0" >
    <template #title>
      Payments
    </template>

  <RecentPayouts/>
  </a-card>
</EmployerBaseLayout>
</template>

<script>

import EmployerBaseLayout from "../../components/EmployersComponents/layout/EmployersBaseLayout.vue";
import RecentPayouts from "../../components/EmployersComponents/RecentPayouts/RecentPayouts.vue";
export default {
  name: "RecentPayoutsView",
  components:{
    EmployerBaseLayout,
    RecentPayouts
  }
};
</script>

<style scoped>
.welcomeTitle {
  font-size: 1.5rem;
  font-family: 'Poppins', sans-serif;
  color: #15161A;
  font-weight: 600;
}
</style>