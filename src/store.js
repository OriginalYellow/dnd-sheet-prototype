import Vue from 'vue';
import Vuex from 'vuex';

import * as F from './sheet-functions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sheet: {
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
    sheet: ({ sheet }) => F.populate(sheet),
    
    skills: ({ sheet }) => F.populateSkills(F.populate(sheet)),
    scores: ({ sheet }) => F.populateScores(F.populate(sheet)),
  },

  mutations: {  

  },
  actions: {

  },
});
