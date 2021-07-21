<template>
  <div id="main-window" class="row">
    <div id="gameSelectionList" class="col-sm-4 pt-2">
      <div class="row justify-content-start">
        <b-button class="m-2" v-b-toggle.pgn-menu variant="success">
          Load PGN
        </b-button>
        <b-button class="m-2" @click="showAbout" variant="secondary">
          About
        </b-button>
        <About id="about" />
      </div>
      <b-form-select
        v-model="selectedGame"
        :options="gameListOptions"
        :select-size="puzzleListRowCount"
        :disabled="gameListOptionsDisabled"
      />
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
            <b-form-checkbox id="flipBoardCheckbox" v-model="isBoardFlipped">
              Flip Board
            </b-form-checkbox>
          </div>
          <div class="row d-flex flex-row">
            <b-form-checkbox id="showMovesCheckbox" v-model="showMoves">
              Show Moves
            </b-form-checkbox>
          </div>
          <div class="row d-flex flex-row">
            <b-form-checkbox id="showThreatsCheckbox" v-model="showThreats">
              Show Threats
            </b-form-checkbox>
          </div>
        </div>
      </div>
      <div class="pt-3">
        <div v-show="showMoves">
          {{
            this.selectedGame && this.selectedGame.comments
              ? this.selectedGame.comments[0]["text"]
              : ""
          }}
        </div>
        <div v-show="showMoves">
          {{ this.selectedGame != null ? this.selectedGame.moves : "" }}
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
