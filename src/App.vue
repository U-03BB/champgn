<template>
  <div id="app">
    <div id="header-title">{{ siteTitle }} <i class="fas fa-chess" /></div>
    <div id="header-subtitle">
      {{ siteSubtitle }}
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
      siteTitle: "ChamPGN",
      siteSubtitle: "Just Play Chess Puzzles"
    };
  }
});
</script>

<style>
@import "https://use.fontawesome.com/releases/v5.5.0/css/all.css";
</style>
