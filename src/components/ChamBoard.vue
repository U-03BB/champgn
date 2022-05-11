<template>
  <div class="blue merida">
    <PromotionModal id="promotion" @promotion="setPromotionPiece" />
    <div id="game-board" ref="board" class="cg-board-wrap"></div>
  </div>
</template>
<script>
import { chessboard } from "vue-chessboard";
import PromotionModal from "./PromotionModal.vue";

export default {
  name: "ChamBoard",
  extends: chessboard,
  components: {
    PromotionModal
  },
  props: {
    showThreats: {
      required: false,
      type: Boolean,
      default: false
    },
    side: {
      required: false,
      type: String,
      default: "white"
    }
  },
  data() {
    return {
      lastOrig: "",
      lastDest: ""
    };
  },
  methods: {
    userPlay() {
      return (orig, dest) => {
        this.lastOrig = orig;
        this.lastDest = dest;

        this.calculatePromotions();
        if (this.isPromotion(orig, dest)) {
          this.$bvModal.show("promotion");
          return;
        }
        this.finishMove();
      };
    },

    finishMove() {
      this.game.move({
        from: this.lastOrig,
        to: this.lastDest,
        promotion: this.promoteTo
      });
      this.board.set({
        fen: this.game.fen()
      });
      this.board.set({
        fen: this.game.fen(),
        turnColor: this.toColor(),
        movable: {
          color: this.toColor(),
          dests: this.possibleMoves(),
          events: { after: this.userPlay() }
        }
      });
      if (this.showThreats) {
        this.paintThreats();
      }
      if (this.game.in_checkmate()) {
        alert("Checkmate!");
      } else if (this.game.in_stalemate()) {
        alert("Stalemate.");
      }
    },
    setPromotionPiece(p) {
      this.promoteTo = p;
      this.$bvModal.hide("promotion");
      this.finishMove();
    }
  },
  watch: {
    fen() {
      this.board.set({
        orientation: this.side,
        movable: { events: { after: this.userPlay() } }
      });
    },
    side() {
      this.board.set({
        orientation: this.side
      });
    },
    showThreats() {
      if (!this.showThreats) {
        this.board.set({
          fen: this.game.fen()
        });
      }
    }
  },
  mounted() {
    this.board.set({
      movable: { events: { after: this.userPlay() } }
    });
    this.$nextTick(() => {
      window.addEventListener("animationend", () => {
        document.body.dispatchEvent(new Event("chessground.resize"));
      });
    });
  },
  beforeDestroy() {
    window.removeEventListener("animationend", () => {
      document.body.dispatchEvent(new Event("chessground.resize"));
    });
  }
};
</script>
