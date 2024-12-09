<template>
  <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-button type="primary" @click="navigateTo({name:'Home'})">
        Back Home
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: "notFound",
  methods:{
    navigateTo(route) {
      this.$router.push(route)
    },
  }
};
</script>

<style scoped>

</style>