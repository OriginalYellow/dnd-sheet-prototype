<template>
  <div id="app">
    <div class="text-xs-center">
    <v-chip color="blue" text-color="white">Primary</v-chip>

    <v-chip color="secondary" text-color="red">Secondary</v-chip>

    <v-chip large color="red" text-color="white">Colored Chip</v-chip>

    <v-chip color="black" text-color="white">Colored Chip</v-chip>
  </div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
    ...mapGetters(['sheet', 'skills']),
  },

  mounted() {
    console.log(this.sheet);
    console.log(this.skills);
  },
}
</script>


<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
