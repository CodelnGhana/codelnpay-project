<template>
  <EmployeeBaseLayout>

    <div class="mainMarg" >

      <MainCta/>

      <a-card title="Recent Transactions" style="border-radius: 0" :bodyStyle="{padding:'12px'}" class="hideMobile">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="Withdrawals">
            <AllWalletTransactions/>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Invoices" force-render>
            <Invoices/>
          </a-tab-pane>
        </a-tabs>

      </a-card>
    </div>

  </EmployeeBaseLayout>

</template>

<script>
import EmployeeBaseLayout from "../../components/EmployeesComponents/layout/EmployeeBaseLayout.vue";
import MainCta from "../../components/EmployeesComponents/DashboardComponents/MainCta.vue";
import Invoices from "../../components/EmployeesComponents/Invoices/Invoices.vue";
import AllWalletTransactions from "../../components/EmployeesComponents/WalletComponents/AllWalletTransactions.vue";
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: "DashBoard",

  components: {
    EmployeeBaseLayout,
    MainCta,
    Invoices,
    AllWalletTransactions
  },
  setup() {
    return {
      activeKey: ref('1'),
    };
  },
})
</script>

<style scoped>

/* media query */
/*large laptops */
@media (max-width: 2560px) and (min-width: 1921px) {

}

/*uhd laptops */
@media (min-width: 1441px) and (max-width: 1920px) {


}

/* medium laptops*/
@media (max-width: 1440px) and (min-width: 1369px) {


}

/* mid large medium laptops*/
@media (max-width: 1368px) and (min-width: 1025px) {


}

/* small laptops*/
@media (max-width: 1024px) and (min-width: 769px) {



}

/* tabs*/
@media (max-width: 768px) and (min-width: 426px) {



}

/* big phone*/
@media (max-width: 425px) and (min-width: 376px) {




}

/* small phone*/
@media (max-width: 375px) and (min-width: 320px) {




}
</style>