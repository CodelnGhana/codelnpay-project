<template>
  <EmployeeBaseLayout>
    <a-card style="border-radius: 0" class="mobileMargin">
      <template #title>
        Manage Employers
      </template>
      <CreateEditPick />
    </a-card>




  </EmployeeBaseLayout>

</template>

<script>
import {defineComponent, reactive, ref} from 'vue';
import EmployeeBaseLayout from "../../components/EmployeesComponents/layout/EmployeeBaseLayout.vue";
import CreateEditPick from "../../components/EmployeesComponents/EmployersComponents/CreateEditPickManageEmployers.vue";
import {useRouter} from 'vue-router';
import {PlusOutlined} from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    EmployeeBaseLayout,
    CreateEditPick,
    PlusOutlined

  },
  setup() {
    const state = reactive({

    });

    const router = useRouter();
    const handleClick = (e) => {
      router.push({
        name: e
      });

    };

    return {
      state,
      handleClick,


    };

  }

});
</script>

<style scoped>

</style>