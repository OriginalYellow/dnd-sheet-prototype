<template>
  <v-app>
    <v-container>
      <v-layout
        row
        wrap
      >
        <v-flex xs12>
          <div class="text-xs-center">
            <v-chip
              color="green"
              text-color="black"
            >{{ `remaining score pool: ${sheet.scorePool}` }}</v-chip>

            <v-chip
              v-for="score in scores"
              :key="score.name"
              color="grey"
              text-color="black"
            >{{ `${score.name}: ${score.total}` }}</v-chip>

            <v-chip
              v-for="skill in skills"
              :key="skill.name"
              color="blue"
              text-color="white"
            >{{ `${skill.name}: ${skill.total}` }}</v-chip>

            <v-chip
              color="black"
              text-color="white"
            >race: {{ sheet.race }}</v-chip>

            <v-chip
              color="black"
              text-color="white"
            >size: {{ !sheet.size ? '' : sheet.size.val }}</v-chip>

            <v-chip
              color="black"
              text-color="white"
            >languages: {{ languages }}</v-chip>

            <v-chip
              color="black"
              text-color="white"
            >speed: {{ !sheet.speed ? '' : sheet.speed.val }}</v-chip>

            <v-chip
              v-for="resistance in sheet.resistances"
              :key="resistance.name"
              color="pink"
              text-color="white"
            >{{ `resistance against being ${resistance.condition}` }}</v-chip>

            <v-dialog
              v-for="ability in sheet.abilities"
              :key="ability.name"
              max-width="600px"
              :no-click-animation="true"
            >
              <template v-slot:activator="{ on }">
                <v-chip
                  color="purple"
                  text-color="white"
                  v-on="on"
                >{{ ability.name }}</v-chip>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ ability.name }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex>
                        <p class="subtitle">{{`source: ${ability.source}` }}</p>
                        <p class="body-1">{{ ability.explanation }}</p>
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <!-- <small>*indicates required field</small> -->
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>

          <div>
            <v-select
              v-model="selectedScore"
              :items="scoreChoices"
              label="score"
              placeholder="change score"
            ></v-select>
          </div>
          <!--
          <div>
            <v-text-field
              label="score change amount"
              v-model="scoreChangeAmount"
            />
          </div> -->

          <div>
            <v-text-field
              v-model="scoreChangeAmount"
              type="number"
              label="amount to change"
              append-outer-icon="add"
              @click:append-outer="increment"
              prepend-icon="remove"
              @click:prepend="decrement"
            ></v-text-field>
          </div>

          <div>
            <v-btn
              @click="incScoreBase({scoreName: selectedScore, val: scoreChangeAmount})"
              color="orange"
            >
              change score
            </v-btn>
          </div>

          <div>
            <v-select
              v-model="selectedRace"
              :items="raceChoices"
              label="race"
              placeholder="choose your race"
            ></v-select>
          </div>

          <div>
            <v-btn
              @click="setRace(selectedRace)"
              color="orange"
            >
              set race
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import * as R from 'ramda';

export default {
  data: () => ({
    raceChoices: ['halfling', 'elf'],
    scoreChoices: ['cha', 'str', 'dex'],
    selectedRace: null,
    selectedScore: null,
    scoreChangeAmount: 0,
  }),

  methods: {
    ...mapMutations(['incScoreBase', 'setRace']),

    increment() {
      this.scoreChangeAmount = parseInt(this.scoreChangeAmount, 10) + 1;
    },
    decrement() {
      this.scoreChangeAmount = parseInt(this.scoreChangeAmount, 10) - 1;
    },
  },

  computed: {
    ...mapGetters(['sheet', 'skills', 'scores']),

    languages() {
      return R.join(
        ', ',
        !this.sheet.languages ? [''] : this.sheet.languages.val,
      );
    },
  },

  beforeMount() {
    console.log(this.sheet);
    console.log(this.skills);
    console.log(this.scores);
  },
};
</script>


<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
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
