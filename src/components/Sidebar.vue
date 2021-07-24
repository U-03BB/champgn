<template>
  <b-sidebar
    id="pgn-menu"
    title="Load Chess Puzzles"
    bg-variant="success"
    text-variant="light"
    backdrop
    shadow
    v-model="showPgnMenu"
    @hidden="changeSidebarImage"
  >
    <div class="px-3 py-2">
      <div id="pgn-picker-radio">
        <b-form-group default="hosted-pgns">
          <b-form-radio
            name="pgnPicker"
            v-model="pgnPickerRadio"
            value="hosted-pgns"
          >
            Play a hosted puzzle collection
          </b-form-radio>
          <b-form-radio
            name="pgnPicker"
            v-model="pgnPickerRadio"
            value="customLocal"
          >
            Load a PGN file from your device
          </b-form-radio>
        </b-form-group>
      </div>
      <div id="hosted-pgns" v-show="pgnPickerRadio === 'hosted-pgns'">
        <p class="import-file-help-text">
          The following Chess puzzle collections are available.
        </p>

        <b-form-select
          v-model="selectedHostedPgnFile"
          :options="hostedPgnOptions"
          :select-size="5"
          :disabled="hostedPgnOptionsDisabled"
        />
        <b-button @click="loadHostedPGN">Load Collection</b-button>
        <p />
        <b-img :src="sidebarImg" height="500" width="500" thumbnail></b-img>
      </div>
      <div id="local-pgn-picker" v-show="pgnPickerRadio === 'customLocal'">
        <p class="import-file-help-text">
          Browse for a local Chess PGN file.
        </p>

        <b-form-file
          ref="file-input"
          v-model="pgnFile"
          :state="Boolean(pgnFile)"
          accept="application/x-chess-pgn"
          placeholder="Load local PGN"
          drop-placeholder="Drop file here..."
          :file-name-formatter="formatFilename"
          @input="readPGN"
        ></b-form-file>
        <p />
        <b-img :src="sidebarImg" height="500" width="500" thumbnail></b-img>
      </div>
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
import pgnList from "@/pgnList";
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
      showPgnMenu: true,
      sidebarImg: "https://source.unsplash.com/500x500/?chess",
      pgnPickerRadio: "hosted-pgns",
      pgnFile: new File([], "") as File | null,
      hostedPgnOptions: Object.keys(pgnList)
        .sort()
        .map(k => {
          return { value: pgnList[k], text: k };
        }),
      selectedHostedPgnFile: ""
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
    changeSidebarImage(): void {
      this.sidebarImg =
        this.sidebarImg.split("?")[0] + "?chess&" + new Date().getTime();
    },
    clearPgn(): void {
      this.pgnFile = null;
      this.$emit("pgnUpdated", "");
      this.showPgnMenu = false;
      this.$emit("gameSelected", "false");
    },
    async loadHostedPGN(): Promise<void> {
      const response = await fetch("/pgn/" + this.selectedHostedPgnFile);
      const blob: Blob = await response.blob();
      blob.text().then(text => this.$emit("pgnUpdated", text));
      this.showPgnMenu = false;
      this.$emit("gameSelected", "false");
    }
  },
  computed: {
    hostedPgnOptionsDisabled(): boolean {
      return this.hostedPgnOptions.length === 0;
    }
  }
});
</script>
<style>
@import "../assets/styling.css";
</style>
