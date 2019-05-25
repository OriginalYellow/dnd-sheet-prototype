<template>
  <v-app>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <div class="text-xs-center">
  
            <v-chip
              v-for="skill in skills"
              :key="skill.name"
              color="blue"
              text-color="white"
            >{{ `${skill.name}: ${skill.total}` }}</v-chip>
  
            <v-chip
              v-for="score in scores"
              :key="score.name"
              color="grey"
              text-color="red"
            >{{ `${score.name}: ${score.total}` }}</v-chip>
  
            <v-chip color="black" text-color="white">race: {{ sheet.race }}</v-chip>
            <v-chip color="black" text-color="white">size: {{ sheet.size.val }}</v-chip>
            <v-chip color="black" text-color="white">languages: {{ languages }}</v-chip>
          </div>
          <div>
            <v-select v-model="selected" :items="items" label="Race" placeholder="choose your race"></v-select>
          </div>
        </v-flex>      
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import * as R from "ramda";
import { mapActions } from 'vuex'

export default {
  data: () => ({
    items: ["halfling", "elf"],
    selected: null,
    points: 25, 
  }),

  methods: {
    ...mapActions([
      'increment', // map `this.increment()` to `this.$store.dispatch('increment')`

      // `mapActions` also supports payloads:
      'incrementBy' // map `this.incrementBy(amount)` to `this.$store.dispatch('incrementBy', amount)`
    ]),

    addSkillPoint() {
      this.points = --this.points; 
      
    }
  },

  computed: {
    ...mapGetters(["sheet", "skills", "scores"]),
    
    languages() {
      return R.join(", ", this.sheet.languages.val);
    }
  },

  beforeMount() {
    console.log(this.sheet);
    console.log(this.skills);
    console.log(this.scores);
  }
};
</script>


<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
