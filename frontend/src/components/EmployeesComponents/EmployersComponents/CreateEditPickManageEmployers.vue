<template>
  <!--------employees display---->




    <a-button type="primary" size="small" @click="showModal" style="margin-bottom: 8px">
      <template #icon>
        <PlusOutlined/>
      </template>
      New Employer
    </a-button>
    <a-table :columns="columns" :data-source="state.companies" :loading="state.loading" size="small"
             :scroll="{ x: 'max-content' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">

          <span class="capitalize">{{ record.name }}</span>

        </template>
        <template v-if="column.key === 'email'">

          <span class="capitalize">{{ record.company_email }}</span>

        </template>
        <template v-if="column.key === 'location'">

          <span class="capitalize">{{ record.location }}</span>

        </template>
        <template v-if="column.key === 'actions'">

          <a-space>
            <div v-if="pickedCompany">
              <div v-if="pickedCompany.id ===record.id">
                <a-tag color="#87d068">Picked</a-tag>
              </div>
              <div v-else>
                <a-button v-if="showPick" @click="$emit('onpickCompany',record)" type="primary">Pick
                </a-button>
              </div>

            </div>
            <div v-else>
              <a-button v-if="showPick" @click="$emit('onpickCompany',record)" type="primary">Pick
              </a-button>
            </div>
            <a-button @click="EditEmployer(record)">
              <template #icon>
                <EditOutlined/>
              </template>

            </a-button>
            <!--                <a-button @click="deleteItem">-->

            <!--                  Delete-->
            <!--                </a-button>-->


          </a-space>

        </template>
      </template>
    </a-table>





  <!--------form modal---->
  <section>
    <a-modal v-model:open="visible" title="Employer Manager" :footer="null">
      <EmployersForm v-if="state.newEmployer"  @companyAdd="companyAdd" @cancelForm="cancelForm" />
      <EmployersForm v-if="state.employerEdit" :currentCompany="state.currentCompany" @companyEdit="companyEdit" @cancelForm="cancelForm"/>
    </a-modal>
  </section>

</template>

<script>
import {defineComponent, reactive, computed, ref, onMounted, onUnmounted} from 'vue';

import {PlusOutlined, EditOutlined,ArrowLeftOutlined} from '@ant-design/icons-vue';
import {Empty} from 'ant-design-vue';
import Invoices from "../Invoices/Invoices.vue";
import EmployersForm from "./EmployersForm.vue";
import EmployersService from "../../../services/EmployeesService";
import {useStore} from 'vuex';
const columns = [
  {
    title: 'Company ',
    dataIndex: 'name',
    key: 'name',
  },

  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'location',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: 'Edit',
    dataIndex: 'actions',
    key: 'actions',
    fixed: 'right'
  },

];
export default defineComponent({
  props:['showPick','pickedCompany'],
  emits: ['onpickCompany'],
  components: {
    EmployersForm,
    PlusOutlined,
    EditOutlined,
    ArrowLeftOutlined,
    Invoices
  },
  setup(props, ctx) {
    const store = useStore();
    const state = reactive({
      zeroState: true,
      showForm: false,
      showCompany: false,
      showFormEdit: false,
      currentCompany: null,
      currentCompanyIndex: 0,
      companyName: '',
      saving: false,
      companies: [],
      loading: false,
      mobile: false,
      size: window.innerWidth,
      showManageCompany:false,
      employerEdit:false,
      newEmployer:false
    });
    onMounted(() => {

      state.loading = true;
      getMyEmployers();


    });

    const getMyEmployers = () => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };
      EmployersService.getMyEmployers(store.state.auth.profile['profile_slug'], auth)
          .then(resp => {
            state.companies = resp.data;
            state.loading = false;
            initialViewSetup();

          })
          .catch(() => {
            state.loading = false

          });

    };
    const initialViewSetup = () => {
      if (props.pickedCompany) {
        state.currentCompany = props.pickedCompany;
        state.currentCompanyIndex = state.companies.indexOf(state.currentCompany);
        state.showCompany = true;
      } else {
        if (state.companies.length > 0) {
          state.currentCompany = state.companies[0];
          state.currentCompanyIndex = state.companies.indexOf(state.currentCompany);
          state.showCompany = true;
        }
      }


    };


    const manageCompany = (company) => {
      state.showForm = false;
      state.showFormEdit = false;
      state.currentCompany = company;
      state.currentCompanyIndex = state.companies.indexOf(company);
      state.showCompany = true;
      state.showManageCompany = true


    };
    const showEdit = () => {
      state.showFormEdit = true;
    };

    const showHideCreateForm = () => {

      state.showCompany = false
      state.showManageCompany = true
      if(state.currentCompany){
        state.currentCompany = null
        state.showForm = true
        state.showManageCompany = true

      }else {
        state.currentCompany = null
        state.showForm = true;

      }



    };


    const pagination = {
      pageSize: 5,
    };
    const companyEdit = (values) => {

      let index = state.companies.indexOf(state.currentCompany);
      state.companies[index] = values;
      state.currentCompany = values;
      visible.value = false
      if (props.pickedCompany) {
        if (props.pickedCompany.id === state.currentCompany.id) {
          ctx.emit('onpickCompany', values);
        }
      }


    };
    const companyAdd = (values) => {
      state.companies.push(values);
      state.currentCompany = values;
      state.showCompany = true;
      state.showForm = false;
      visible.value = false

    };
    const cancelForm = () => {
      state.showManageCompany = false
      if (state.currentCompany) {
        state.showFormEdit = false;
      } else {
        state.showForm = false;

      }
    };
    const deleteItem = () => {
      const auth = {
        headers: {Authorization: 'Bearer ' + store.state.auth.token}

      };

      EmployersService.deletetEmployer(store.state.auth.profile['profile_slug'], state.currentCompany.id, auth)
          .then(resp => {
            state.companies = resp.data;
            let index = state.companies.indexOf(state.currentCompany);
            if (index > -1) {
              state.companies.splice(index, 1);
            }

            initialViewSetup();


          });

    };
    const visible = ref(false);
    const showModal = () => {
      state.currentCompany =null
      state.newEmployer =true
      state.employerEdit = false
      visible.value = true;
    };
    const EditEmployer = (employer)=>{
      visible.value = true
      state.employerEdit = true
      state.newEmployer =false
      state.currentCompany = employer

    }



    return {
      state,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      showHideCreateForm,
      manageCompany,
      showEdit,
      pagination,
      EmployersForm,
      companyAdd,
      companyEdit,
      cancelForm,
      deleteItem,
      visible,
      EditEmployer,
      showModal,
      columns


    };
  }
});
</script>

<style scoped>
.picked {
  border-color: #030852 !important;
}

.capitalize {
  text-transform: capitalize;
}
</style>