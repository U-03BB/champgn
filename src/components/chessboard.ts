import Vue from "vue";
import { chessboard } from "vue-chessboard";
import pgnParser from "pgn-parser";
import "bootstrap-vue";
import "vue-chessboard/dist/vue-chessboard.css";
import "bootstrap-vue";

const defaultStartingFen =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export default Vue.extend({
  name: "Chessboard",
  components: {
    chessboard
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
      puzzleSelectRows: 20,
      currentFen: defaultStartingFen,
      hideComments: false,
      isBoardFlipped: false,
      gameOver: false
    };
  },

  methods: {
    promote(): PromotionPiece {
      // Chess component requires a return value, which makes an async modal infeasible
      if (confirm("Promote to Queen?")) {
        return "q";
      }
      if (confirm("Promote to Rook?")) {
        return "r";
      }
      if (confirm("Promote to Bishop?")) {
        return "b";
      }
      if (confirm("Promote to Knight?")) {
        return "k";
      }
      alert("Stop being cute! You're getting a Queen.");
      return "q";
    },
    resetPosition(): void {
      this.currentFen = "";
      setTimeout(() => {
        this.selectedGame
          ? (this.currentFen = this.selectedGame.fen)
          : (this.currentFen = defaultStartingFen);
        this.gameOver = false;
      }, 0);
    },
    processMoveData(moveData: MoveData): void {
      this.currentFen = moveData.fen;
      if (!moveData.turn && !this.gameOver && moveData.history.length > 0) {
        const lastMove: string = moveData.history[moveData.history.length - 1];
        if (lastMove[lastMove.length - 1] === "#") {
          alert("Checkmate!");
        } else {
          alert("Stalemate!");
        }
        this.gameOver = true;
      }
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
    },
    parseGame(pgnInput: PgnDict): PGN {
      const pgnOutput: PGN = {
        setup: "0",
        fen: defaultStartingFen,
        moves: ""
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

      if (pgnInput.moves != null) {
        pgnInput.moves.forEach(m => {
          pgnOutput.moves += this.parseMove(m);
        });
      }

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

      pgnOutput.label =
        pgnOutput.event + ": " + pgnOutput.white + " - " + pgnOutput.black;

      return pgnOutput;
    },
    parseMove(moveInput: Move): string {
      if (moveInput.move_number) {
        return " " + moveInput.move_number + " " + moveInput.move;
      }
      return " " + moveInput.move;
    }
  },
  watch: {
    selectedGame: function() {
      this.isBoardFlipped = false;
      this.resetPosition();
    },
    pgnString: function() {
      this.updateGameList();
    }
  },
  computed: {
    side(): string {
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
    gameListOptionsDisabled(): boolean {
      return this.gameListOptions.length === 0;
    }
  }
});
