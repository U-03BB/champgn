import Vue from "vue";
import ChamBoard from "./ChamBoard.vue";
import pgnParser from "pgn-parser";
import "bootstrap-vue";
import "vue-chessboard/dist/vue-chessboard.css";
import About from "./About.vue";
import MoveAnnotation from "./MoveAnnotation.vue";
import { defaultStartingFen, parseGame } from "../util/gameParser";

const puzzleListMaxRows = 20;

export default Vue.extend({
  name: "PlayArea",
  components: {
    ChamBoard,
    About,
    MoveAnnotation
  },
  props: {
    pgnString: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      gameList: [] as PGN[],
      selectedGame: null as PGN | null,
      promotionPiece: "q" as PromotionPiece,
      currentFen: defaultStartingFen,
      puzzleListRowCount: window.innerWidth > 600 ? puzzleListMaxRows : 1,
      windowWidth: window.innerWidth,
      showMoves: false,
      showThreats: false,
      isBoardFlipped: false
    };
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    resetPosition(): void {
      this.currentFen = "";
      setTimeout(() => {
        this.selectedGame
          ? (this.currentFen = this.selectedGame.fen)
          : (this.currentFen = defaultStartingFen);
      }, 0);
    },
    updateGameList(): void {
      try {
        this.gameList = pgnParser.parse(this.pgnString).map((g: PgnDict) => {
          return parseGame(g);
        });
      } catch {
        alert("ERROR: Can not read PGN from file.");
        this.gameList = [];
      }
      this.selectedGame = null;
      this.resetPosition();
      this.showMoves = false;
    },
    hideRavs(evt: MouseEvent): void {
      const target = evt.target as HTMLElement | null;

      /*
      Close all RAVs if anything clicked other than:
      - RAV popover
      - game board
      - game controls
      */

      const movelist = document.getElementById("move-list");
      const movelistPopovers = Array.from(
        movelist?.getElementsByClassName("popover") ?? []
      );
      const board = document.getElementById("game-board");
      const gameControls = Array.from(
        document.getElementsByClassName("game-control")
      );

      if (
        movelistPopovers.every(el => el !== target && !el.contains(target)) &&
        board !== target &&
        !board?.contains(target) &&
        gameControls.every(el => el !== target && !el.contains(target))
      ) {
        this.$root.$emit("bv::hide::popover");
      }
    },
    scrollToAnnotations(scrollDown: boolean): void {
      this.$nextTick(() => {
        if (scrollDown) {
          const el = document.getElementById("game-controls");
          el?.scrollIntoView({ behavior: "smooth" });
        } else {
          const el = document.getElementById("header-title");
          el?.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  },
  watch: {
    selectedGame: function() {
      this.isBoardFlipped = false;
      this.resetPosition();
      this.showMoves = false;
      this.showThreats = false;
      if (this.selectedGame && this.selectedGame !== null) {
        this.$emit("gameSelected", "true");
      }
    },
    pgnString: function() {
      this.updateGameList();
    },
    windowWidth: function(newWidth) {
      document.body.dispatchEvent(new Event("chessground.resize"));
      if (newWidth >= 600) {
        this.puzzleListRowCount = puzzleListMaxRows;
        return;
      }
      this.puzzleListRowCount = 1;
    }
  },
  computed: {
    side(): "white" | "black" {
      if (!this.selectedGame || this.selectedGame === null) {
        return !this.isBoardFlipped ? "white" : "black";
      }
      return this.selectedGame.fen.includes(" b ") !== this.isBoardFlipped
        ? "black"
        : "white";
    },
    gameListOptions(): { value: PGN; text?: string }[] {
      return this.gameList.map((p, i) => {
        return { value: p, text: (i + 1).toString() + ". " + p.label };
      });
    },
    noAnnotationsAvailable(): boolean {
      return (
        typeof this.selectedGame !== "undefined" &&
        this.selectedGame !== null &&
        this.selectedGame.moves.length == 0 &&
        !this.selectedGame.comments
      );
    },
    gameHeaderText(): { firstline: string; secondline: string } {
      if (
        typeof this.selectedGame === "undefined" ||
        this.selectedGame == null
      ) {
        return { firstline: "", secondline: "" };
      }
      const firstline =
        this.selectedGame != null
          ? (this.selectedGame.event && this.selectedGame.event !== "?"
              ? this.selectedGame.event
              : "") +
            (this.selectedGame.event &&
            this.selectedGame.event !== "?" &&
            this.selectedGame.date &&
            this.selectedGame.date !== ""
              ? " - "
              : "") +
            (this.selectedGame.date && this.selectedGame.date !== ""
              ? this.selectedGame.date
              : "")
          : "";
      const secondline =
        this.selectedGame != null
          ? (this.selectedGame.white !== "?" || this.selectedGame.black !== "?"
              ? this.selectedGame.white
              : "") +
            (this.selectedGame.black !== "?"
              ? " vs. " + this.selectedGame.black
              : "")
          : "";

      return { firstline: firstline, secondline: secondline };
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
      window.addEventListener("click", this.hideRavs);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("click", this.hideRavs);
  },
  template: `<div />`
});
