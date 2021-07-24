<template>
  <div id="main-window" class="row">
    <div
      id="gameSelectionList"
      :class="
        windowWidth < 600 && selectedGame != null
          ? 'col-sm-4 pt-2 compact-selection-list'
          : 'col-sm-4 pt-2'
      "
    >
      <div
        :class="
          windowWidth < 600 && selectedGame != null ? 'd-flex flex-row' : 'row'
        "
      >
        <b-button
          class="m-2 order-2"
          style="min-width: 6.5em"
          v-b-toggle.pgn-menu
          variant="success"
        >
          Load PGN
        </b-button>
        <b-button
          class="m-2 order-3"
          @click="$bvModal.show('about')"
          variant="secondary"
        >
          About
        </b-button>
        <About id="about" />
        <b-form-select
          :class="
            windowWidth < 600 && selectedGame != null
              ? 'order-1 m-2'
              : 'order-4 m-2'
          "
          v-model="selectedGame"
          :options="gameListOptions"
          :select-size="puzzleListRowCount"
          :disabled="gameListOptions.length === 0"
        >
          <template #first>
            <b-form-select-option
              :hidden="gameListOptions.length === 0"
              :value="null"
              disabled
              >-- Select a game --</b-form-select-option
            >
          </template>
        </b-form-select>
      </div>
    </div>
    <div id="playArea" class="col-sm-8 pt-2">
      <div id="gameHeader">
        {{
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
            : ""
        }}<br />
        {{
          this.selectedGame != null
            ? (this.selectedGame.white !== "?" ||
              this.selectedGame.black !== "?"
                ? this.selectedGame.white
                : "") +
              (this.selectedGame.black !== "?"
                ? " vs. " + this.selectedGame.black
                : "")
            : ""
        }}<br />
      </div>
      <chessboard
        :fen="currentFen"
        :orientation="side"
        :onPromotion="promote"
        @onMove="processMoveData"
        :showThreats="showThreats"
      />
      <div class="playing-side-note">Playing as {{ side }}</div>
      <p />
      <div class="row justify-content-center">
        <div class="col d-flex flex-row justify-content-end">
          <b-button variant="info" @click="resetPosition"
            >Reset Position</b-button
          >
        </div>
        <div id="game-checkbox-div" class="col d-flex flex-column">
          <div class="row d-flex flex-row">
            <b-form-checkbox id="showThreatsCheckbox" v-model="showThreats">
              Show Threats
            </b-form-checkbox>
          </div>
          <div class="row d-flex flex-row">
            <b-form-checkbox id="flipBoardCheckbox" v-model="isBoardFlipped">
              Flip Board
            </b-form-checkbox>
          </div>
          <div class="row d-flex flex-row">
            <b-form-checkbox
              id="showMovesCheckbox"
              v-model="showMoves"
              :disabled="!this.selectedGame || noAnnotationsAvailable"
            >
              Show Annotation
            </b-form-checkbox>
          </div>
        </div>
      </div>
      <div id="annotation-section" class="pt-3">
        <div id="no-annotations" v-show="noAnnotationsAvailable">
          No annotation available
        </div>
        <div id="game-comments" v-show="showMoves">
          {{
            this.selectedGame && this.selectedGame.comments
              ? this.selectedGame.comments
              : ""
          }}
        </div>
        <div
          id="move-list"
          v-show="
            showMoves && this.selectedGame && this.selectedGame.moves.length > 0
          "
        >
          <move-annotation
            v-if="this.selectedGame && this.selectedGame !== null"
            :moves="this.selectedGame.moves"
            :blackStarts="this.selectedGame.fen.includes(' b ')"
          />
          {{
            this.selectedGame && !["*", "?"].includes(this.selectedGame.result)
              ? "Result: " + this.selectedGame.result
              : ""
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Chessboard from "./chessboard";

export default Chessboard;
</script>

<style>
@import "../assets/styling.css";
</style>
