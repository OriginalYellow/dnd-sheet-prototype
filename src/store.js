import Vue from 'vue';
import Vuex from 'vuex';

import transform from '@/sheet-functions';

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
    // getSheet: state => transform(state.sheet),
    getSheet: (state) => {
      console.log(state);
      console.log(transform(state));
      return 5;
    },
  },

  mutations: {

  },
  actions: {

  },
});
