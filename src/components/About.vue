<template>
  <b-modal
    id="about"
    :title="modalTitle"
    centered
    ok-title="OK, Cool"
    ok-only
    hide-header-close
  >
    <b-container>
      <p>
        ChamPGN provides a convenient way to view Chess games and puzzles stored
        in the
        <a href="https://en.wikipedia.org/wiki/Portable_Game_Notation"
          >PGN file format</a
        >.
      </p>
      <p>
        You can view stored positions, continue playing legal moves and browse
        annotations and variations where available.
      </p>
      <p>
        Source code is available at: <br />
        <a :href="githubLink">{{ githubLink }}</a>
      </p>
      <p>
        Any user-submitted PGNs are not saved by the server and are processed
        only in the browser.
      </p>
    </b-container>
  </b-modal>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "About",
  data() {
    return {
      githubLink: "https://github.com/u-03bb/champgn/",
      modalTitle: "About ChamPGN"
    };
  }
});
</script>
<style>
@import "../assets/styling.css";
</style>
