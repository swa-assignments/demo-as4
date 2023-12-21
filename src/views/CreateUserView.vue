<template>
  <div class="wrapper">
    <h1><b>Create user</b></h1>
    <form @submit="submitCreateUser">
      <label for="input-username">
        <div>Username</div>
        <input v-model="username" id='input-username' type="text"/>
      </label>
      <label for="input-password">
        <div>Password</div>
        <input v-model="password" id='input-password' type="password"/>
      </label>
      <div>
        <button class="kek" @click="submitCreateUser" type='button'>
          Create user
        </button>
        <button type="button" @click="$router.push('/login')">
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateUserView',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    submitCreateUser(e) {
      e.preventDefault();

      if (this.username.trim().length === 0 || this.password.trim() === 0) {
        alert('Username and password cannot be empty');
      } else {
        fetch('http://localhost:9090/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username.trim(), password: this.password.trim(),
          }),
        }).then((response) => {
          if (response.ok) {
            return response.json().then((data) => data);
          }
          // eslint-disable-next-line no-throw-literal
          throw {};
        }).then((_body) => fetch('http://localhost:9090/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: _body.username, password: _body.password,
          }),
        }).then((response) => {
          if (response.ok) {
            return response.json().then((data) => data);
          }
          // eslint-disable-next-line no-throw-literal
          throw {};
        }).then((__body) => {
          sessionStorage.setItem('token', __body.token);
          sessionStorage.setItem('userId', __body.userId);
          this.$router.push('/play');
        }).catch(() => {
          alert('Error logging in');
        })).catch(() => {
          alert('Error creating user');
        });
      }
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

  input {
    @include default-input();
  }

  & > div {
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    align-items: center;
    column-gap: 20px;

    :nth-child(1) {
      align-self: start;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #000000;
    }

    :nth-child(2) {
      text-decoration: underline;
    }

  }
}

</style>
