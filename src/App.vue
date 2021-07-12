<template>
  <div id="app">
    <div id="app-header">{{ siteHeader }} <i class="fas fa-chess" /></div>
    <div id="header-subtitle">
      A Chess PGN exploration tool
    </div>
    <hr />
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      siteHeader: "ChamPGN"
    };
  }
});
</script>

<style>
@import "https://use.fontawesome.com/releases/v5.5.0/css/all.css";
</style>
