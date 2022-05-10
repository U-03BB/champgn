<template>
  <div id="app">
    <div id="header">
      <div id="header-title" :class="shouldShrinkHeader ? 'title-shrink' : ''">
        {{ siteTitle }} <i class="fas fa-chess" />
      </div>
      <div
        id="header-subtitle"
        :class="shouldShrinkHeader ? 'subtitle-shrink' : ''"
      >
        {{ siteSubtitle }}
      </div>
    </div>
    <hr />
    <router-view @gameSelected="shrinkHeader" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      siteTitle: "ChamPGN",
      siteSubtitle: "Chess Puzzle Collections",
      shouldShrinkHeader: false
    };
  },
  methods: {
    shrinkHeader(shouldShrinkString: "true" | "false"): void {
      const shouldShrink = shouldShrinkString === "true";
      if (this.shouldShrinkHeader !== shouldShrink) {
        this.shouldShrinkHeader = shouldShrink;
      }
    }
  }
});
</script>

<style>
@import "https://use.fontawesome.com/releases/v5.5.0/css/all.css";
</style>
