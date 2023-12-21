<template>
  <div class="wrapper">
    <h1 class='text-2xl'><b>Profile</b></h1>
    <form @submit="updateUser">
      <span><b>Id: </b>{{ userId }}</span>
      <span><b>Username: </b>{{ username }}</span>
      <span><b>Is an admin?: {{ (isAdmin && 'Yes') || 'No' }}</b></span>
      <label for="input-firstName">
        <div>First name</div>
        <input v-model="firstName" id='input-firstName' type="text"/>
      </label>
      <label for="input-lastName">
        <div>Last name</div>
        <input v-model="lastName" id='input-lastName' type="text"/>
      </label>
      <label for="input-favoriteGame">
        <div>Favorite game</div>
        <input v-model="favoriteGame" id='input-favoriteGame' type="text"/>
      </label>
      <button @click="updateUser" type='button'>
        Update profile
      </button>
    </form>
    <button class="logout-button" @click="logout()"
            type='button'>
      Logout
    </button>
    <button class="to-play-button" @click="$router.push('/play')"
            type='button'>
      Back to the game
    </button>
  </div>
</template>

<script>
export default {
  name: 'ProfileView',
  computed: {
    userId() {
      return sessionStorage.getItem('userId');
    },
  },
  created() {
    fetch(`http://localhost:9090/users/${sessionStorage.getItem('userId')}?token=${sessionStorage.getItem('token')}`, {
      method: 'GET',
    }).then((response) => {
      if (response.ok) {
        return response.json().then((_body) => {
          this.username = _body.username;
          this.firstName = _body.firstName || '';
          this.lastName = _body.lastName || '';
          this.favoriteGame = _body.favoriteGame || '';
          this.isAdmin = _body.admin;
        });
      }
      // eslint-disable-next-line no-throw-literal
      throw {};
    }).catch(() => {
      alert('An error occurred while fetching user information');
    });
  },
  data() {
    return {
      username: '',
      firstName: '',
      lastName: '',
      favoriteGame: '',
      isAdmin: false,
    };
  },
  methods: {
    updateUser(e) {
      e?.preventDefault();
      fetch(`http://localhost:9090/users/${sessionStorage.getItem('userId')}?token=${sessionStorage.getItem('token')}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: this.firstName,
          lastName: this.lastName,
          favoriteGame: this.favoriteGame,
        }),
      }).then((response) => {
        if (response.ok) {
          return;
        }
        // eslint-disable-next-line no-throw-literal
        throw {};
      })
        .then(() => {
          alert('User information updated');
        })
        .catch(() => {
          alert('An error occurred while updating user information');
        });
    },
    logout() {
      fetch(`http://localhost:9090/logout?token=${sessionStorage.getItem('token')}`, {
        method: 'POST',
      }).then((response) => {
        if (response.ok) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('userId');
          this.$router.push('/login');
          return;
        }
        // eslint-disable-next-line no-throw-literal
        throw {};
      }).catch(() => {
        alert('Error logging out');
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import '../base.scss';

h1 {
  @include header1();
}

form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-self: start;

  :nth-child(3) {
    margin-bottom: 20px;
  }

  input {
    @include default-input(10px);
  }

  button {
    align-self: start;
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 20px;
    border: 1px solid #000000;
  }
}

.logout-button {
  align-self: start;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #000000;
}

.to-play-button {
  margin-top: 20px;
  align-self: start;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #000000;
}
</style>
