<template>
  <b-card id="moveset" class="annotation text-center">
    <b-table small striped hover :items="tableData" :fields="fields">
      <template #cell(moveNumber)="data">
        {{ data.value }}
      </template>

      <template #cell(whiteMove)="data">
        <span>
          <!-- TODO: Split up move + annotation text-->
          {{ data.value }}
        </span>
        <b-popover
          v-if="data.item.whiteRavs && data.item.whiteRavs.length > 0"
          :target="data.item.whiteLabel"
          triggers="click"
        >
          <template>
            <b-tabs card>
              <b-tab
                v-for="(rav, idx) in data.item.whiteRavs"
                :key="'rav-tab-' + idx"
                :title="String(idx + 1)"
              >
                {{
                  data.item.whiteRavs[idx].comments.length > 0
                    ? data.item.whiteRavs.comments.join("\n")
                    : ""
                }}
                <move-annotation
                  :moves="data.item.whiteRavs[idx].moves"
                  :blackStarts="false"
                  :labelPrefix="data.item.whiteLabel + '-' + idx"
                />
              </b-tab>
            </b-tabs>
          </template>
        </b-popover>
      </template>

      <template #cell(blackMove)="data">
        <span>
          {{ data.value }}
        </span>
        <b-popover
          v-if="data.item.blackRavs && data.item.blackRavs.length > 0"
          :target="data.item.blackLabel"
          triggers="click"
        >
          <b-tabs card>
            <b-tab
              v-for="(rav, idx) in data.item.blackRavs"
              :key="'rav-tab-' + idx"
              :title="String(idx + 1)"
            >
              {{
                data.item.blackRavs[idx].comments.length > 0
                  ? data.item.blackRavs.comments.join("\n")
                  : ""
              }}
              <move-annotation
                :moves="data.item.blackRavs[idx].moves"
                :blackStarts="true"
                :labelPrefix="data.item.blackLabel"
              />
            </b-tab>
          </b-tabs>
        </b-popover>
      </template>
    </b-table>
  </b-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Nag } from "@/util/nag";

export default Vue.extend({
  name: "move-annotation",
  props: {
    moves: {
      type: Array as () => Move[],
      required: true
    },
    blackStarts: {
      type: Boolean,
      required: false,
      default: false
    },
    labelPrefix: {
      type: String,
      required: false,
      default: "note"
    }
  },
  data() {
    return {
      fields: [
        {
          key: "moveNumber",
          label: "No.",
          sortable: false
        },
        {
          key: "whiteMove",
          label: "W",
          sortable: false,
          tdClass: (value: never, key: never, item: AnnotationTableRow) => {
            if (item.whiteRavs?.length > 0) return "annotation-has-ravs";
            return "";
          },
          tdAttr: (value: never, key: never, item: AnnotationTableRow) => ({
            id: item.whiteLabel
          })
        },
        {
          key: "blackMove",
          label: "B",
          sortable: false,
          tdClass: (value: never, key: never, item: AnnotationTableRow) => {
            if (item.blackRavs?.length > 0) return "annotation-has-ravs";
            return "";
          },
          tdAttr: (value: never, key: never, item: AnnotationTableRow) => ({
            id: item.blackLabel
          })
        }
      ]
    };
  },
  methods: {
    parseNags(nags: (keyof typeof Nag)[]): string[] {
      return nags.map(n => {
        return `(${Nag[n]})`;
      });
    },
    parseComments(move: Move): string {
      if (move.nags) {
        return this.parseNags(move.nags as (keyof typeof Nag)[]).join("\n");
      }
      return move.comments?.map(c => c.text.trim()).join("\n") ?? "";
    }
  },
  computed: {
    movePairs(): MovePair[] {
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
    },
    tableData(): AnnotationTableRow[] {
      return this.movePairs.map(m => ({
        moveNumber: m.moveNumber,
        whiteMove: m.white
          ? m.white.move + "\n" + this.parseComments(m.white)
          : "...",
        whiteRavs: m.white?.ravs ? m.white.ravs : [],
        whiteLabel: this.labelPrefix + "-" + String(m.moveNumber) + "W",
        blackMove: m.black
          ? m.black.move + "\n" + this.parseComments(m.black)
          : "...",
        blackRavs: m.black?.ravs ? m.black.ravs : [],
        blackLabel: this.labelPrefix + "-" + String(m.moveNumber) + "B"
      }));
    }
  }
});
</script>
