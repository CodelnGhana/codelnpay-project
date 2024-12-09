<template>
  <a-menu
      v-model:selectedKeys="selectedKeys"
      @click="handleClick"
      mode="inline"
      style="height: 100%"
  >
    <a-menu-item key="EmployerDashBoard">
      <AppstoreOutlined/>
      Dashboard
    </a-menu-item>
    <a-menu-item key="InitiatePayment">
      <SendOutlined/>
      Send Payment
    </a-menu-item>


    <a-menu-item key="RecentPayouts">
      <FileTextOutlined/>
      All Payments
    </a-menu-item>
    <a-menu-item key="PayrollManager">
      <TeamOutlined/>
      Manage Employees
    </a-menu-item>
    <a-menu-item key="MyProfile">
      <UserOutlined/>
      Profile
    </a-menu-item>

  </a-menu>
</template>

<script>
import {computed, defineComponent, ref,} from 'vue';
import {useRouter} from "vue-router/dist/vue-router";
import { AppstoreOutlined,TeamOutlined,FileTextOutlined,SendOutlined,UserOutlined } from '@ant-design/icons-vue';
export default defineComponent( {
  components:{
    AppstoreOutlined,
    TeamOutlined,
    FileTextOutlined,
    SendOutlined,
    UserOutlined
  },
  setup(){
    const router = useRouter()
    let path = computed(() =>{
      let pathString =[]
      pathString.push(router.currentRoute.value.name)
      return pathString
    })
    let active = []
    active.push(path)
    const handleClick = (e)=>{
      router.push({
        name: e.key
      })

    }
    return{
      path,
      selectedKeys: ref(path.value),
      handleClick,
    }
  }
})
</script>

<style scoped>

</style>