import Vue from "vue";
import ChamBoard from "./ChamBoard.vue";
import pgnParser from "pgn-parser";
import "bootstrap-vue";
import "vue-chessboard/dist/vue-chessboard.css";
import "bootstrap-vue";
import About from "./About.vue";
import MoveAnnotation from "./MoveAnnotation.vue";

const defaultStartingFen =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

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
          return this.parseGame(g);
        });
      } catch {
        alert("ERROR: Can not read PGN from file.");
        this.gameList = [];
      }
      this.selectedGame = null;
      this.resetPosition();
      this.showMoves = false;
    },
    parseGame(pgnInput: PgnDict): PGN {
      const pgnOutput: PGN = {
        setup: "0",
        fen: defaultStartingFen,
        moves: []
      };

      const pgnKeys: Array<keyof PGN> = [
        "event",
        "site",
        "date",
        "round",
        "white",
        "black",
        "result",
        "annotator",
        "setup",
        "fen",
        "comments",
        "moves",
        "label"
      ];

      // Turn header tuples into dictionary
      const pgnInputHeaderDict: { [key: string]: string } = {};
      pgnInput.headers.forEach(h => {
        pgnInputHeaderDict[h.name.toLowerCase()] = h.value;
      });

      function setProp<K extends keyof PGN>(key: K, value: PGN[K]) {
        pgnOutput[key] = value;
      }

      pgnKeys.forEach(k => {
        if (pgnInputHeaderDict[k]) {
          setProp(k, pgnInputHeaderDict[k]);
        }
      });

      pgnOutput.moves = pgnInput.moves;

      // Reduce Game comments to a single string
      // Comments for moves are handled individually.
      pgnOutput.comments = pgnInput.comments
        ?.map(c => {
          return c.text;
        })
        .reduce((a, b) => {
          return a + " " + b;
        });

      if (pgnOutput.date) {
        const [year, month, day] = pgnOutput.date.split(".");
        if (year && year === "????") pgnOutput.date = "";
        else if (month && month === "??") pgnOutput.date = year;
        else if (day && day === "??") pgnOutput.date = `${year}.${month}`;
      }

      pgnOutput.label =
        (pgnOutput.event && pgnOutput.event !== "?" ? pgnOutput.event : "") +
        (pgnOutput.event &&
        pgnOutput.event !== "?" &&
        pgnOutput.white &&
        pgnOutput.white !== "?"
          ? " : "
          : "") +
        (pgnOutput.white && pgnOutput.white !== "?" ? pgnOutput.white : "") +
        (pgnOutput.black && pgnOutput.black !== "?"
          ? " - " + pgnOutput.black
          : "");

      return pgnOutput;
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
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  template: `<div />`
});
