<template>
  <a-menu
      v-model:selectedKeys="selectedKeys"
      @click="handleClick"
      mode="inline"
      style="height: 100%"
  >
    <a-menu-item key="DashBoard">
      <AppstoreOutlined/>
      Dashboard
    </a-menu-item>
    <a-menu-item key="CreateInvoice">
      <SendOutlined/>
      Create Invoice
    </a-menu-item>
    <a-menu-item key="PaymentInvitations">
      <UserAddOutlined/>
      Payment Invitations
    </a-menu-item>
    <a-menu-item key="AccountsManager">
      <CreditCardOutlined/>
      Bank Accounts
    </a-menu-item>
    <a-menu-item key="CryptoWallets">
      <BlockOutlined/>
      Crypto Wallets
    </a-menu-item>
    <a-menu-item key="ManageEmployers">
      <TeamOutlined/>
      Manage Employers
    </a-menu-item>
    <a-menu-item key="AllInvoices">
      <ProfileOutlined/>
      All Invoices
    </a-menu-item>
    <a-menu-item key="AllWithdrawals">
      <BankOutlined/>
      All Withdrawals
    </a-menu-item>
    <a-menu-item key="kycView">
      <IdcardOutlined/>
      KYC
    </a-menu-item>
    <a-menu-item key="ProfileManager">
      <UserOutlined/>
      Profile
    </a-menu-item>

  </a-menu>
</template>

<script>
import {computed, defineComponent, ref,} from 'vue';
import {useRouter} from "vue-router/dist/vue-router";
import { AppstoreOutlined,IdcardOutlined,ProfileOutlined,TeamOutlined,SendOutlined,CreditCardOutlined,UserOutlined,UserAddOutlined,BankOutlined,BlockOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  components:{
    AppstoreOutlined,
    IdcardOutlined,
    ProfileOutlined,
    TeamOutlined,
    SendOutlined,
    CreditCardOutlined,
    UserOutlined,
    UserAddOutlined,
    BankOutlined,
    BlockOutlined
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