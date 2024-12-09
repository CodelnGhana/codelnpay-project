<template>



  <a-skeleton active  v-if="state.loading"/>

  <a-table :columns="state.columns" :data-source="currencyEmployees"
           :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
           size="small" :scroll="{ x: 'max-content' }" v-else>


    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'employee'">
        <a-space>
          <span class="capitalize">{{ record.firstname }}</span>
          <span class="capitalize">{{ record.lastname }}</span>
        </a-space>

      </template>
      <template v-if="column.key === 'salary'">
        <a-space>
          <span class="capitalize">{{ record.currency }}</span>
          <span class="capitalize">{{ record.amount }}</span>
        </a-space>

      </template>



      <template v-else-if="column.key === 'kyc_status'">

        <span v-if=" record.employee_ref">
          <span v-if="record.employee_ref.verification.length>0">
          <span v-if="record.employee_ref.verification[0].status === 'verification.completed'">
             <a-tag color="#87d068">
                Verified
              </a-tag>
          </span>
          <span v-else>
            <a-tag color="#f50">
                  Unverified
                </a-tag>
          </span>
        </span>
          <span v-else>
            <a-tag color="#f50">
                  Unverified
                </a-tag>
          </span>
        </span>
        <a-tag color="warning" v-else>unverified</a-tag>


      </template>

      <template v-else-if="column.key === 'edit'">

          <a-button @click="getEmployee(record)" type="primary" size="small">
            <template #icon>
              <EditOutlined />
            </template>
            Edit

          </a-button>
<!--        <a-button @click="deleteEmployee(record)">delete</a-button>-->

      </template>


    </template>
    <template #title>

      <a-space>
        <a-select v-model:value="state.currency">
          <a-select-option value="USD">USD</a-select-option>
          <a-select-option value="EUR">EURO</a-select-option>
          <a-select-option value="GBP">GBP</a-select-option>
        </a-select>


        <a-button type="primary"  v-if="state.makingPayment"  @click="showModal" >
          <template #icon>
            <PlusOutlined  />
          </template>
          New Employee
        </a-button>
      </a-space>
    </template>
  </a-table>





  <a-modal v-model:open="state.visible" title="Employee On-boarding" :footer="null"  style="top: 20px" >
    <CreateEditEmployee @newEmployee="newEmployee" :employee="state.employee" @employeeEdit="saveEmployeeEdit"/>
  </a-modal>

</template>

<script>
import { defineComponent, onMounted, reactive, ref, watch,computed} from 'vue';
import CreateEditEmployee from "./CreateEditEmployee/CreateEditEmployee.vue";
import { EditOutlined,PlusOutlined } from '@ant-design/icons-vue';
import {useRouter} from "vue-router/dist/vue-router";
import {useStore} from 'vuex';
import EmployersService from "../../../../services/EmployersService";

export default defineComponent( {
  components:{
    EditOutlined,
    CreateEditEmployee,
    PlusOutlined
  },
  props:['showNew','pickedEmployees'],

  emits: ['getEmployee','closeModal','onpickEmployee'],
  setup(props,ctx){
    const store = useStore();
    const router = useRouter()
    const state = reactive({
      employees: [],
      employee: null,
      visible:false,
      columns: [
        {
          title: 'Employee Name',
          dataIndex: 'employee',
          key: 'employee',
        },
        {
          title: 'Salary',
          dataIndex: 'salary',
          key: 'salary',
        },

        {
          title: 'Kyc status',
          dataIndex: 'kyc_status',
          key: 'kyc_status',
        },

        {
          title: 'Edit',
          key: 'edit',
        },


      ],
      makingPayment:false,
      loading:false,
      selectedRowKeys: [],
      currency:'USD',



    })

    onMounted(() => {
      state.loading = true
      if(router.currentRoute.value.name ==='InitiatePayment'){
        state.makingPayment= true

      }
      getMyEmployees()

    });
    const getMyEmployees = ()=>{

      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      EmployersService.getMyEmployees(store.state.auth.profile['profile_slug'], auth)
          .then(resp=>{
            state.employees = resp.data
            state.employees.forEach(employee=>{
              employee.key = employee.id
            })
            if(props.pickedEmployees.length){
              props.pickedEmployees.forEach(employee=>{
                state.selectedRowKeys.push(employee.id)
              })
              if(props.pickedEmployees[0].currency ==='USD'){
                state.currency ='USD'
              }else if(props.pickedEmployees[0].currency ==='EUR'){
                state.currency ='EUR'
              }
              else if(props.pickedEmployees[0].currency ==='GBP'){
                state.currency ='GBP'
              }
            }
            state.loading = false
          })
          .catch(()=>{
            state.loading = false
          })


    }




    watch(() => (props.showNew), (newValues,oldValue) => {
      state.employee = null
      showModal()
    });
    const showModal = () => {
      if(state.employee){
        state.employee = null
        state.visible = true;
      }else {
        state.visible = true;
      }

    };
    const newEmployee = (values) => {
      state.visible = false;
      values.key = values.id
      state.employees.push(values);


    };
    const getEmployee = (values) => {
      state.employee = values;
      state.visible = true;
    };
    const saveEmployeeEdit = (values) => {
      state.visible = false;
      let index = state.employees.indexOf(state.employee);
      state.employees[index] = values;
      state.employees[index].key = values.id
      state.employee = null


    };
    const deleteEmployee = (employee)=>{
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      EmployersService.deletetEmployee(store.state.auth.profile['profile_slug'],employee.id, auth)
          .then(resp=>{
            let index = state.employees.indexOf(employee);
            if (index > -1) {
              state.employees.splice(index, 1);
            }
          })
    }

    const onSelectChange = (selectedRowKeys, selectedRows) => {
      state.selectedRowKeys = selectedRowKeys;
      ctx.emit('onpickEmployee', selectedRows);
    };
    const currencyEmployees = computed(() => {
      if(state.employees.length>0){

        let employees = []
        if(state.currency ==='USD'){
          state.employees.forEach(employee=>{
            if(employee.currency ==='USD'){
              employees.push(employee)
            }
          })
        }else if(state.currency === 'EUR'){
          state.employees.forEach(employee=>{
            if(employee.currency ==='EUR'){
              employees.push(employee)
            }
          })
        }
        else if(state.currency === 'GBP'){
          state.employees.forEach(employee=>{
            if(employee.currency ==='GBP'){
              employees.push(employee)
            }
          })
        }
        return employees


      }else {

        return []
      }

    })



    return{
      showModal,
      state,
      newEmployee,
      getEmployee,
      saveEmployeeEdit,
      deleteEmployee,
      onSelectChange,
      currencyEmployees





    }
  }

});
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}
.welcomeTitle {
  font-size: 1.5rem;
  font-family: 'Poppins', sans-serif;
  color: #15161A;
  font-weight: 600;
}
</style>