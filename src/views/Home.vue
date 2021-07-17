<template>
  <div id="app-home" class="home">
    <div class="row justify-content-start container-fluid h-100">
      <Sidebar
        id="sidebar"
        :pgnString="this.pgnString"
        @pgnUpdated="setNewPgn"
      />
      <div class="col-12">
        <chessboard :pgnString="this.pgnString" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Chessboard from "@/components/Chessboard.vue";
import Sidebar from "@/components/Sidebar.vue";

export default Vue.extend({
  name: "Home",
  components: {
    Chessboard,
    Sidebar
  },
  data() {
    return {
      showPgnMenu: true,
      pgnString: ""
    };
  },
  methods: {
    setNewPgn(newPgn: string): void {
      this.pgnString = newPgn;
    },
    formatFilename(files: File[]): string {
      return files[0].name.slice(0, 22);
    }
  },
  watch: {
    pgnString(newVal: string, oldVal: string) {
      if (newVal !== oldVal) this.$emit("pgnString", newVal);
    }
  }
});
</script>
<style>
@import "../assets/styling.css";
</style>
