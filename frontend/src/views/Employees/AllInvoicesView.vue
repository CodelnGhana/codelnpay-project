<template>
  <EmployeeBaseLayout>
    <a-card style="border-radius: 0">
      <template #title>
        Filter by Company
        <a-select
            :allowClear="true"
            show-search
            placeholder="Select company"
            style="width: 200px"
            :options="state.data"
            :filter-option="filterOption"
            @change="handleChange"
        ></a-select>
      </template>
      <Invoices :company="state.searchTermCompanyName" @companiesList="companyList"/>
    </a-card>


  </EmployeeBaseLayout>
</template>

<script>
import {defineComponent, reactive} from 'vue';
import EmployeeBaseLayout from "../../components/EmployeesComponents/layout/EmployeeBaseLayout.vue";
import Invoices from "../../components/EmployeesComponents/Invoices/Invoices.vue";
import {useRouter} from 'vue-router';

export default defineComponent({
  components: {
    EmployeeBaseLayout,
    Invoices

  },
  setup() {
    const state = reactive({
      data: [],
      searchTermCompanyName: ''


    });
    const companyList = (values) => {
      state.data = values;

    };
    const router = useRouter();
    const handleClick = (e) => {
      router.push({
        name: e
      });

    };


    const handleChange = value => {
      state.searchTermCompanyName = value;

    };

    const filterOption = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };


    return {
      handleClick,
      state,
      filterOption,
      handleChange,
      companyList

    };

  }

});
</script>

<style scoped>

</style>