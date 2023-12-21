<template>
  <div class="wrapper">
    <h1><b>Current user's top 3 highest scores</b></h1>
    <span v-for="game in currentUsersTop3Games" :key="game.id">
      <b>Score: </b>{{ game.score }}
    </span>
    <h1><b>Top 10 highest scores of anyone</b></h1>
    <span v-for="game in anyoneTop10Games" :key="game.id">
      <b>Score: </b>{{ game.score }}
    </span>
    <button @click="$router.push('/play')" type='button'>
      Back to the game
    </button>
  </div>
</template>

<script>

export default {
  name: 'HighScoresView',
  computed: {
    currentUsersTop3Games() {
      return this.games.filter((game) => game.user === parseInt(sessionStorage.getItem('userId'), 10) && game.completed)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    },
    anyoneTop10Games() {
      return this.games.filter((game) => game.completed)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    },
  },
  created() {
    fetch(`http://localhost:9090/games?token=${sessionStorage.getItem('token')}`)
      .then((response) => {
        if (response.ok) {
          return response.json().then((_body) => {
            this.games = _body;
          });
        }
        // eslint-disable-next-line no-throw-literal
        throw {};
      }).catch(() => {
        alert('Failed to fetch high scores');
      });
  },
  data() {
    return {
      games: [],
    };
  },
};
</script>

<style scoped lang="scss">
@import '../base.scss';

h1 {
  @include header1();
}

h1:first-of-type {
  margin-bottom: 20px;
}

h1:last-of-type {
  margin-bottom: 20px;
  margin-top: 20px;
}

button {
  margin-top: 20px;
  align-self: start;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #000000;
}
</style>
