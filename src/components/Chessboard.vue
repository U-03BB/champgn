<template>
  <div class="row">
    <div class="col-sm-4 pt-2">
      <b-form-select
        v-model="selectedGame"
        :options="options"
        :select-size="puzzleSelectRows"
        :disabled="optionsDisabled"
      />
    </div>
    <div class="col-sm-8 pt-2">
      {{
        this.selectedGame != null
          ? this.selectedGame.event + " - " + this.selectedGame.date
          : ""
      }}<br />
      {{
        this.selectedGame != null
          ? this.selectedGame.white + " vs. " + this.selectedGame.black
          : ""
      }}<br />
      <chessboard
        :fen="currentFen"
        :orientation="side"
        :onPromotion="promote"
        @onMove="processMoveData"
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
            <b-form-checkbox id="hideCommentsCheckbox" v-model="hideComments">
              Hide Moves
            </b-form-checkbox>
          </div>
        </div>
      </div>
      <div class="pt-3">
        <div v-show="!hideComments">
          {{
            this.selectedGame && this.selectedGame.comments
              ? this.selectedGame.comments[0]["text"]
              : ""
          }}
        </div>
        <div v-show="!hideComments">
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
