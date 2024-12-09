<template>
  <EmployeeBaseLayout>



      <a-card style="border-radius: 0" title="Identity Verification">

        <KycBoard/>
      </a-card>






  </EmployeeBaseLayout>

</template>

<script>
import {defineComponent} from 'vue';
import EmployeeBaseLayout from "../../components/EmployeesComponents/layout/EmployeeBaseLayout.vue";
import KycBoard from "../../components/KycComponents/KycBoard.vue";
import {useRouter} from 'vue-router';
export default defineComponent( {
  components:{
    EmployeeBaseLayout,
    KycBoard
  },
  setup(){
    const router = useRouter();
    const handleClick = (e) => {
      router.push({
        name: e
      });

    };
    return{
      handleClick

    }
  }
})
</script>

<style scoped>

</style>