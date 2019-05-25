<template>
  <div id="app">
    <div class="text-xs-center">
    <v-chip v-for="skill in skills" :key="skill.name" color="blue" text-color="white">{{ `${skill.name}: ${skill.total}` }}</v-chip>
    <v-chip v-for="score in scores" :key="score.name" color="secondary" text-color="red">{{ `${score.name}: ${score.total}` }}</v-chip>

    <v-chip color="black" text-color="white">race: {{ sheet.race }}</v-chip>
    <v-chip color="black" text-color="white">size: {{ sheet.size.val }}</v-chip>
    <v-chip color="black" text-color="white">languages: {{ languages }}</v-chip>
    <!-- <v-chip color="secondary" text-color="red">{{ sheet.race }}</v-chip> -->

    <!-- <v-chip large color="red" text-color="white">Colored Chip</v-chip> -->

    </div>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as R from 'ramda';

export default {
    computed: {
    ...mapGetters(['sheet', 'skills', 'scores']),

    languages() {
      return R.join(', ', this.sheet.languages.val);

    }  
  },

  mounted() {
    console.log(this.sheet);
    console.log(this.skills);
    console.log(this.scores);
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
