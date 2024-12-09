<template>
  <a-card style="width: 100%;border-radius: 0" >
    <template #title>
      Employee Manager
    </template>
    <template #extra>
      <a-button type="primary" @click="closeOpenModal">
        <template #icon>
          <PlusOutlined/>
        </template>
        New Employee
      </a-button>
    </template>
    <NewEmployeeManager :showNew="state.createNew"/>

  </a-card>

</template>

<script>
import {defineComponent, onMounted, reactive} from 'vue';

import {AuditOutlined, SolutionOutlined, PlusOutlined} from '@ant-design/icons-vue';
import NewEmployeeManager from "./NewEmployeeManager/NewEmployeeManager.vue";

export default defineComponent({

  emits: ['getEmployee'],
  components: { AuditOutlined, SolutionOutlined, PlusOutlined, NewEmployeeManager},
  setup(props, ctx) {
    const state = reactive({

      createNew: false
    });
    onMounted(() => {

    });
    const getEmployee = (values) => {
      ctx.emit('getEmployee', values);
    };
    const closeOpenModal = () => {
      state.createNew = !state.createNew;
    };
    return {
      state,
      getEmployee,
      closeOpenModal
    };
  }

});
</script>

<style scoped>
.welcomeTitle {
  font-size: 1.3rem;
  font-family: 'Poppins', sans-serif;
  color: #15161A;
  font-weight: 600;
}
</style>