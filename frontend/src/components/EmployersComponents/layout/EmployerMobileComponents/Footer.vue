<script setup>

import {HomeOutlined,PlusOutlined,WalletOutlined,UsergroupAddOutlined} from '@ant-design/icons-vue';
import {useRouter} from "vue-router";
const router = useRouter()
const handleClick = (e)=>{
  router.push({
    name: e
  })

}

</script>

<template>
  <div class="footer">
    <a-flex gap="middle" style="justify-content: space-evenly">
      <div style="text-align: center;color: #1a1a1a;" @click="handleClick('EmployerDashBoard')">
        <HomeOutlined />
        <p>Home</p>
      </div>
      <div style="text-align: center;color: #1a1a1a;" @click="handleClick('InitiatePayment')">
        <PlusOutlined />
        <p>Send</p>
      </div>
      <div style="text-align: center;color: #1a1a1a;" @click="handleClick('RecentPayouts')">
        <WalletOutlined />
        <p>Payments</p>
      </div>
      <div style="text-align: center;color: #1a1a1a;" @click="handleClick('PayrollManager')">
        <UsergroupAddOutlined />
        <p>Employees</p>
      </div>



    </a-flex>
  </div>

</template>

<style scoped>
.footer{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #F5F5F5;
  color: white;

  padding: 3%;
}
</style>