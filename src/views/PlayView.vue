<template>
  <div class='wrapper'>
    <div>
      <div :class="[secondsLeft <= 0 ? 'disabled' : '', 'grid']">
        <div v-for="(row, rowIndex) in board.board" :key="'row'+rowIndex">
          <div v-for="(col, colIndex) in row" :key="'col'+colIndex"
               :class="[(rowIndex === tile.row && colIndex === tile.col)
            ? 'selectedCell' : 'defaultCell']"
               @click="handleSelectTile(rowIndex, colIndex)"
               @keydown="() => {}"
          >
            {{ col.value }}
          </div>
        </div>
      </div>
      <div class="board-info">
        <div>
          <span><b>Score:&nbsp;</b>{{ score }}</span>
          <button v-if="secondsLeft <= 0" type="button" @click="startNewGame()">
            Play again
          </button>
        </div>
        <span><b>Seconds left:&nbsp;</b>{{ secondsLeft }}</span>
        <router-link to='/high-scores'>
          <button type="button">
            View high scores
          </button>
        </router-link>
      </div>
    </div>
    <router-link to="/profile">
      <button type="button">
        Profile
      </button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GeneratorFake2 } from '@/model/generator';
import * as Board from '../model/board';

const generator = new GeneratorFake2();

export default defineComponent({
  name: 'PlayView',
  watch: {
    secondsLeft(newValue) {
      if (newValue > 0) {
        // eslint-disable-next-line no-return-assign
        setTimeout(() => this.secondsLeft -= 1, 1000);
      } else {
        this.finishGame().then(() => alert('Time is up!'));
      }
    },
  },
  created() {
    this.startNewGame();
  },
  data() {
    return {
      score: 0,
      tile: { row: -1, col: -1 },
      board: { board: [] },
      secondsLeft: -1,
      gameId: -1,
    };
  },
  methods: {
    finishGame() {
      return fetch(`http://localhost:9090/games/${this.gameId}?token=${sessionStorage.getItem('token')}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: this.score, completed: true,
        }),
      });
    },
    // eslint-disable-next-line consistent-return
    handleSelectTile(row, col) {
      if (this.tile.row === -1) {
        this.tile = { row, col };
      } else {
        if (Board.canMove(this.board, { row: this.tile.row, col: this.tile.col }, { row, col })) {
          const moveResult = Board.move(generator, this.board, {
            row: this.tile.row, col: this.tile.col,
          }, {
            row, col,
          });
          this.board = moveResult.board;
          this.score += moveResult.effects.filter((effect) => effect.kind === 'Match').length;
          this.tile = { row: -1, col: -1 };
          return fetch(`http://localhost:9090/games/${this.gameId}?token=${sessionStorage.getItem('token')}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              score: this.score,
            }),
          });
        }
        this.tile = { row, col };
      }
    },
    startNewGame() {
      this.board = Board.create(generator, 6, 6);
      this.secondsLeft = 60;
      this.score = 0;
      return fetch(
        `http://localhost:9090/games?token=${sessionStorage.getItem('token')}`,
        {
          method: 'POST',
        },
      ).then((response) => {
        if (response.ok) {
          return response.json().then((_body) => {
            this.gameId = _body.id;
          });
        }
        // eslint-disable-next-line no-throw-literal
        throw {};
      });
    },
  },
});
</script>

<style scoped lang="scss">
@import '../base.scss';

.wrapper {
  display: flex;
  flex-direction: column;
  padding: 40px;

  :first-child {
    display: flex;
    flex-direction: row;

    .grid {
      display: flex;
      flex-direction: column;
      align-self: start;
      border: 2px solid lightgray;

      > div {
        display: flex;
        flex-direction: row;

        > div {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-width: 2px;
          border-color: lightgray;
        }

        .selectedCell {
          border-color: black;
          border-style: dashed;
        }

        .defaultCell {
          border-style: solid;

          &:hover {
            border-color: orange;
          }
        }

      }
    }

    .disabled {
      pointer-events: none;
      opacity: 0.5;
    }

    .board-info {
      display: flex;
      flex-direction: column;
      margin-left: 20px;

      div {
        display: flex;
        flex-direction: row;
        column-gap: 20px;

        button {
          text-decoration: underline;
        }
      }

      span {
        display: flex;
        flex-direction: row;
      }

      a {
        margin-top: 20px;
        display: flex;
        align-self: start;

        button {
          @extend %button-primary;
        }
      }
    }
  }

  > a {
    margin-top: 20px;
    display: flex;
    align-self: start;

    button {
      @extend %button-primary;
    }
  }

}
</style>
