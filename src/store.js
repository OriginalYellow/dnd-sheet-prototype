/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import Vue from 'vue';
import Vuex from 'vuex';
import {
  populateSkills, populateScores, populate, incScoreBase,
} from './sheet-functions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // transforms: {
    //   incScoreBase: {
    //     scoreName: 'dex',
    //     val:
    //   }
    // },
    sheet: {
      scorePool: 28,
      scores: [
        {
          name: 'cha',
        },
        {
          name: 'str',
        },
        {
          name: 'dex',
        },
      ],
      skills: [
        {
          name: 'athletics',
        },
        {
          name: 'arcana',
        },
        {
          name: 'acrobatics',
        },
        {
          name: 'sleight of hand',
        },
        {
          name: 'stealth',
        },
        {
          name: 'deception',
        },
        {
          name: 'intimidation',
        },
        {
          name: 'perception',
        },
        {
          name: 'performance',
        },
        {
          name: 'persuasion',
        },
      ],
    },
  },

  getters: {
    sheet: ({ sheet }) => populate(sheet),
    skills: ({ sheet }) => populateSkills(populate(sheet)),
    scores: ({ sheet }) => populateScores(populate(sheet)),
  },

  mutations: {
    incScoreBase: (state, { scoreName, val }) => {
      state.sheet = incScoreBase(scoreName, val)(state.sheet);
    },
  },
  actions: {

  },
});
