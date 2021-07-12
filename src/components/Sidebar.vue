<template>
  <b-sidebar
    id="pgn-menu"
    title="Load Games from PGN"
    bg-variant="success"
    text-variant="light"
    backdrop
    shadow
    v-model="showPgnMenu"
    @hidden="changeSidebarImage"
  >
    <div class="px-3 py-2">
      <p class="import-file-help-text">
        Browse for local PGN Chess game file, or drag and drop the file into the
        box.
      </p>

      <b-form-file
        ref="file-input"
        v-model="pgnFile"
        :state="Boolean(pgnFile)"
        accept=".pgn"
        placeholder="Use local PGN"
        drop-placeholder="Drop file here..."
        :file-name-formatter="formatFilename"
        @input="readPGN"
      ></b-form-file>
      <p />
      <b-img :src="sidebarImg" height="500" width="500" thumbnail></b-img>
    </div>
    <div id="sidebar-lower-button-div" class="d-flex justify-content-end">
      <b-button class="m-2" @click="clearPgn" variant="secondary">
        Clear PGN
      </b-button>
    </div>
  </b-sidebar>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Sidebar",
  props: {
    pgnString: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      pgnFile: new File([], "") as File | null,
      showPgnMenu: true,
      sidebarImg: "https://source.unsplash.com/500x500/?chess"
    };
  },
  methods: {
    readPGN(file: File): void {
      if (file != null) {
        const reader = new FileReader();
        reader.onload = evt => {
          if (evt.target != null) {
            this.showPgnMenu = false;
            if (this.pgnFile instanceof File) {
              this.pgnFile.text().then(text => this.$emit("pgnUpdated", text));
            }
          }
        };
        reader.readAsText(file, "string");
      }
    },
    formatFilename(files: File[]): string {
      return files[0].name.slice(0, 22);
    },
    showAbout(): void {
      this.$bvModal.show("about");
    },
    changeSidebarImage(): void {
      this.sidebarImg =
        this.sidebarImg.split("?")[0] + "?chess&" + new Date().getTime();
    },
    clearPgn(): void {
      this.pgnFile = null;
      this.$emit("pgnUpdated", "");
    }
  }
});
</script>
<style>
@import "../assets/styling.css";
</style>
