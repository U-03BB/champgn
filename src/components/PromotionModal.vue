<template>
  <b-modal
    id="promotion"
    title="Select Promotion Piece"
    centered
    hide-footer
    no-close-on-backdrop
    no-close-on-esc
    hide-header-close=""
  >
    <b-container>
      <b-row>
        <b-col>
          <b-button variant="outline-secondary" @click="setPiece('q')">
            <i class="promotion-icon fas fa-chess-queen" />
          </b-button>
        </b-col>
        <b-col>
          <b-button variant="outline-secondary" @click="setPiece('r')">
            <i class="promotion-icon fas fa-chess-rook" />
          </b-button>
        </b-col>
        <b-col>
          <b-button variant="outline-secondary" @click="setPiece('b')">
            <i class="promotion-icon fas fa-chess-bishop" />
          </b-button>
        </b-col>
        <b-col>
          <b-button variant="outline-secondary" @click="setPiece('n')">
            <i class="promotion-icon fas fa-chess-knight" />
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "PromotionModal",
  data() {
    return {
      promotionPiece: "q"
    };
  },
  methods: {
    setPiece(piece: PromotionPiece) {
      this.$emit("promotion", piece);
    }
  }
});
</script>
