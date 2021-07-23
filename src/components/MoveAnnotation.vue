<template>
  <div id="moveset">
    <p v-for="m in movepairs" :key="m.moveNumber">
      {{ m.moveNumber }}. {{ m.white ? m.white.move : "..." }}
      {{ m.white && m.white.nags ? parseNags(m.white.nags) : "" }}
      {{ m.black ? m.black.move : "" }}
      {{ m.black && m.black.nags ? parseNags(m.black.nags) : "" }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Nag } from "./nag";

export default Vue.extend({
  name: "Move",
  props: {
    moves: {
      type: Array as () => Move[],
      required: true
    },
    blackStarts: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    parseNags(nags: (keyof typeof Nag)[]): string {
      return nags
        .map(n => {
          return `(${Nag[n]})`;
        })
        .reduce((a, b) => {
          return a + " " + b;
        });
    }
  },
  computed: {
    movepairs(): MovePair[] {
      const res: MovePair[] = [];
      let i = 0;
      while (i < this.moves.length) {
        if (i === 0 && this.blackStarts) {
          res.push({
            moveNumber: Number(this.moves[i].move_number),
            black: this.moves[i]
          });
          i++;
          continue;
        }

        const move: MovePair = {
          moveNumber: Number(this.moves[i].move_number),
          white: this.moves[i]
        };

        if (i++ < this.moves.length) {
          move.black = this.moves[i];
        }
        res.push(move);
        i++;
      }
      return res;
    },
    Nag() {
      return Nag;
    }
  }
});
</script>
