<template>
  <a-statistic class="cardColor"  :value="amount" :value-style="{ color: 'white' }" :prefix="currency">


  </a-statistic>
</template>

<script>
import {defineComponent} from 'vue';
export default defineComponent( {
  props: ['currency', 'amount','walletType'],

})
</script>

<style scoped>
.statisticStyle{
  color: white;

}
.cardColor{}
</style>