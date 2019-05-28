/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
import * as L from 'partial.lenses';
import * as R from 'ramda';
import * as V from 'partial.lenses.validation';
import * as S from 'sanctuary';
import * as RA from 'ramda-adjunct';
import { State } from 'crocks';

const cur = R.curry;

// dummy data:

const testSheet = {
  race: undefined,
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
};

const scoreNamesArray = ['cha', 'str', 'dex'];
const skillNamesArray = ['athletics', 'arcana', 'acrobatics', 'sleight of hand', 'stealth', 'deception', 'intimidation', 'performance', 'persuasion'];

const ScoreSkillMappings = {
  str: ['athletics'],
  dex: ['acrobatics', 'sleight of hand', 'stealth'],
  cha: ['deception', 'intimidation', 'performance', 'persuasion'],
};


// sheet validation:

const isUniqueBy = (p, xs) => {
  const counts = L.counts([L.elems, p], xs);
  return x => counts.get(x) <= 1;
};

// MIKE: you might want to couple this validation with the sheet in an object
// because it'll only be used with that object and probably used in random
// places - so its convenient
const validateSheet = ({ scoreNames, skillNames }) => V.props({
  scores: V.choose(scores => V.and(
    [() => scores.length === scoreNames.length, 'incorrect amount of scores'],
    V.arrayIx(V.props({
      base: V.optional(V.and(
        [RA.isInteger, 'must be a whole number'],
        [RA.inRange(0, 20), 'must be between 0 and 20'],
      )),
      name: V.and(
        [RA.isString, 'must be a string'],
        [R.includes(R.__, scoreNames), 'must be a valid score name'],
        [isUniqueBy('name', scores), 'duplicate'],
      ),
      proficient: [RA.isBoolean, 'must be a boolean'],
    })),
  )),
  skills: V.choose(skills => V.and(
    [() => skills.length === skillNames.length, 'incorrect amount of skills'],
    V.arrayIx(V.props({
      base: V.optional(V.and(
        [RA.isInteger, 'must be a whole number'],
        [RA.inRange(0, 20), 'must be between 0 and 20'],
      )),
      name: V.and(
        [RA.isString, 'must be a string'],
        [R.includes(R.__, skillNames), 'must be a valid skill name'],
        [isUniqueBy('name', skills), 'duplicate'],
      ),
      proficient: [RA.isBoolean, 'must be a boolean'],
      bonuses: V.optional(V.and(
        [RA.isArray, 'must be an array'],
        V.arrayIx(V.props({
          source: [RA.isString, 'source must be a string'],
          val: [RA.isNumber, 'value must be a number'],
        })),
      )),
    })),
  )),
});


// helpers:
// misc helpers:

const Helper = {
  calcModifier: x => RA.floor((x - 10) / 2),

  createSkillBonusFromScore: (sourceName, scoreVal) => ({
    [sourceName]: {
      val: Helper.calcModifier(scoreVal),
    },
  }),

  createScoreValBonus: (sourceName, scoreVal) => ({
    [sourceName]: {
      val: scoreVal,
    },
  }),

  createScoreNominalBonus: sourceName => ({
    [sourceName]: {
      type: 'proficiency',
    },
  }),

  createScoreBonusNew: (sourceName, bonusVals) => ({
    [sourceName]: bonusVals,
  }),

  lenseSelect: R.pipe(
    R.mapObjIndexed(R.unary(L.get)),
    R.applySpec,
  ),
};


// lenses:

const Model = {
  scores: ['scores', L.normalize(R.sortBy(L.get('name')))],
  skills: ['skills', L.normalize(R.sortBy(L.get('name')))],
  race: ['race'],
  size: ['size'],
  speed: ['speed'],
  languages: ['languages'],
  abilities: ['abilities'],
  resistances: ['resistances'],
  subrace: ['subrace'],
  scorePool: ['scorePool'],
};

const Skills = {
  skillByName: name => [L.find(R.propEq('name', name))],
  bonuses: ['bonuses', L.define({})],
};

const Skill = {
  bonuses: ['bonuses', L.define({})],
  name: ['name'],
  vals: [L.branch({
    bonuses: [L.define({}), L.children, 'val'],
    base: [L.define(0)],
  })],
};

Skill.Fold = {
  total: L.foldTraversalLens(L.sum, Skill.vals),
};

const Scores = {
  scoreByName: name => [L.find(R.propEq('name', name))],
};

const Score = {
  bonuses: ['bonuses', L.define({})],

  name: ['name'],

  vals: [L.branch({
    bonuses: [L.define({}), L.children, 'val'],
    base: [L.define(0)],
  })],
};

Score.Fold = {
  total: L.foldTraversalLens(L.sum, Score.vals),
};

Model.Readonly = {
  bonusFromScore: scoreName => [
    Model.scores,
    Scores.scoreByName(scoreName),
    Score.Fold.total,
    cur(Helper.createSkillBonusFromScore)(scoreName),
  ],
};

// misc lenses mainly for viewing stuff:

const View = {
  scoreByNameTotal: scoreName => [Model.scores, Scores.scoreByName(scoreName), Score.Fold.total],
  scoreByNameBonuses: scoreName => [Model.scores, Scores.scoreByName(scoreName), Skill.bonuses],
  skillByNameTotal: skillName => [Model.skills, Skills.skillByName(skillName), Skill.Fold.total],
  skillByNameBonuses: skillName => [Model.skills, Skills.skillByName(skillName), Skill.bonuses],
};

// transforming:

const Transform = {
  addBonusToSkill: (bonus, skillName) => [
    Model.skills,
    Skills.skillByName(skillName),
    Skill.bonuses,
    L.assignOp(bonus),
  ],

  addBonusToScore: (bonus, scoreName) => [
    Model.scores,
    Scores.scoreByName(scoreName),
    Score.bonuses,
    L.assignOp(bonus),
  ],

  addBonusToSkills: (sourceTargets, bonus) => L.seq(...R.map(
    cur(Transform.addBonusToSkill)(bonus),
    sourceTargets[R.keys(bonus)[0]],
  )),
};

const Select = {
  skill: Helper.lenseSelect({
    name: Skill.name,
    total: [Skill.Fold.total],
    bonuses: [Skill.bonuses, L.elems, ''],
  }),
  score: Helper.lenseSelect({
    name: Score.name,
    total: [Score.Fold.total],
  }),
};

// MIKE: move these 2 state utilities to a different file:
const putResultant = a => State.put(a)
  .map(R.always(a));

const putState = R.always(State.get());

const Stateful = {
  addBonusToScore: (scoreSkillMappings, sourceName, scoreName, val) => State
    .modify(
      L.transform(
        Transform.addBonusToScore(
          Helper.createScoreValBonus(sourceName, val),
          scoreName,
        ),
      ),
    )
    .chain(putState)
    .map(
      L.get(
        Model.Readonly.bonusFromScore(scoreName),
      ),
    )
    .chain(bonus => State.modify(
      L.transform(
        Transform.addBonusToSkills(scoreSkillMappings, bonus),
      ),
    )),

  incScoreBase: (scoreSkillMappings, scoreName, val) => State
    .modify(
      L.modify(
        [
          Model.scores,
          Scores.scoreByName(scoreName),
          Score.bonuses,
          'base',
          L.define({}),
          'val',
          L.define(0),
        ],
        R.add(val),
      ),
    )
    .chain(
      R.always(
        State.modify(
          L.modify(
            [Model.scorePool],
            R.flip(R.subtract)(val),
          ),
        ),
      ),
    )
    .chain(putState)
    .map(
      L.get(
        Model.Readonly.bonusFromScore(scoreName),
      ),
    )
    .chain(bonus => State.modify(
      L.transform(
        Transform.addBonusToSkills(scoreSkillMappings, bonus),
      ),
    )),

  setScoreBase: (scoreSkillMappings, scoreName, val) => State
    .modify(
      L.set(
        [Model.scores, Scores.scoreByName(scoreName), 'base'],
        val,
      ),
    )
    .chain(putState)
    .map(
      L.get(
        Model.Readonly.bonusFromScore(scoreName),
      ),
    )
    .chain(bonus => State.modify(
      L.transform(
        Transform.addBonusToSkills(scoreSkillMappings, bonus),
      ),
    )),
};

// MIKE: you need to find out a way to essentially save history without
// necessarily saving functions
// - use a base value
// - use the same exact race transform function for population and setting w/o vuex
// - when setting w/vuex use a mutation and just set the race
// - when getting w/vuex use a getter that runs the population function

// testing transforms:

// MIKE: if you change race after it was already set, you will need to overrite
// abilities set by the previous race
// - you could do this by grouping all race-granted abililties under a property
//   and then setting that property when setting the race
// - EDIT: the above will not be necessary if you repopulate the sheet after
//   changing the race
const raceTransforms = {
  halfling: [
    [Model.race, L.setOp('halfling')],
    [Model.size, 'val', L.setOp('small')],
    [Model.speed, 'val', L.setOp(25)],
    [Model.languages, 'val', L.setOp(['common', 'halfling'])],
    [L.modifyOp(Stateful.addBonusToScore(ScoreSkillMappings, 'race', 'dex', 2).execWith)],
    [Model.abilities, L.appendOp({
      name: 'naturally stealthy',
      explanation: 'You can move through the space of any creature that is of a size larger than yours.',
      source: 'race',
    })],
    [Model.abilities, L.appendOp({
      name: 'lucky',
      explanation: 'When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.',
      source: 'race',
    })],
    [Model.resistances, L.appendOp({
      name: 'brave',
      condition: 'frightened',
      source: 'race',
    })],
  ],
  elf: [
    [Model.race, L.setOp('elf')],
    [Model.size, 'val', L.setOp('medium')],
    [Model.speed, 'val', L.setOp(30)],
    [Model.languages, 'val', L.setOp(['common', 'elvish'])],
    [L.modifyOp(Stateful.addBonusToScore(ScoreSkillMappings, 'race', 'dex', 2).execWith)],
    L.seq(
      [
        Model.skills,
        Skills.skillByName('perception'),
        Skill.bonuses,
        L.assignOp(Helper.createScoreBonusNew('race', { proficient: true })),
      ],
      [Model.skills, Skills.skillByName('perception'), 'proficient', L.setOp(true)],
    ),
    [Model.resistances, L.appendOp({
      name: 'Fey Ancestry',
      condition: 'charmed',
      source: 'race',
    })],
  ],
};

const subraceTransforms = {
  lightfoot: [
    [Model.subrace, L.setOp('lightfoot')],
    [L.modifyOp(Stateful.addBonusToScore(ScoreSkillMappings, 'subrace', 'cha', 1).execWith)],
    [Model.abilities, L.appendOp({
      name: 'naturally stealthy',
      explanation: 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.',
      source: 'subrace',
    })],
  ],
};

Stateful.populateRace = State.get(
  R.prop('race'),
)
  .chain(raceName => State.modify(
    // L.transform(L.seq(...raceTransforms[raceName])),
    L.transform(L.seq(...R.propOr([R.always], raceName, raceTransforms))),
  ));

const transforms = L.seq(...[
  ...raceTransforms['halfling'],
  ...subraceTransforms['lightfoot'],
]);

const getTransform = optics => L.seq(...optics);

const newSheet = L.transform(transforms, testSheet); // ?

const testTransforms1 = [
  // [L.modifyOp(Stateful.setScoreBase(ScoreSkillMappings, 'cha', 14).execWith)],
  // [L.modifyOp(Stateful.addBonusToScore(ScoreSkillMappings, 'race', 'dex', 5).execWith)],
  // [L.modifyOp(Stateful.addBonusToScore(ScoreSkillMappings, 'some other source', 'dex', 2).execWith)],
];

const testTransforms2 = [
  // MIKE: with ur current bonus data structure, there is no way to impart both
  // a nominal and a value bonus from the same source - they would overrwrite
  // eachother:
  // [Model.skills, Skills.skillByName('perception'), Skill.bonuses,L.assignOp(Helper.createScoreValBonus('race'))],

  // MIKE: to solve the above, restructure bonuses thusly:
  // - each key on the bonuses object will still represent a unique source
  // - the value will be an array of values that represent a type of bonus -
  //   "bonus values"
  // - you have two options for data structures to use for bonus values:
  // 1. an object with the type of the value as the sole key, with its value
  //    being the bonus value itself: { val: 5 } or { proficient: true }
  // 2. a primitive value of type string | number. it will be a number for
  //    numeric values and a string for nominal values

  // [Model.skills, Skills.skillByName('perception'), Skill.bonuses, L.assignOp(Helper.createScoreBonusNew())],
];

const skillByNameTotal = skillName => L.get(View.skillByNameTotal(skillName));
const selectSkills = L.collectAs(Select.skill, [Model.skills, L.elems]);
const selectScores = L.collectAs(Select.score, [Model.scores, L.elems]);
// const populate = L.transform(transforms);
// just echo over anything set by the player as the "base" score:
const setScoreBase = (scoreName, val) => L.transform(
  [L.modifyOp(Stateful.addBonusToScore(ScoreSkillMappings, 'base', scoreName, val).execWith)],
);
const incScoreBase = (scoreName, val) => L.transform(
  [L.modifyOp(Stateful.incScoreBase(ScoreSkillMappings, scoreName, val).execWith)],
);
const setRace = raceName => L.transform(L.seq(...raceTransforms[raceName]));
const setRaceBase = raceName => L.transform([Model.race, L.setOp(raceName)]);
const populateRace = L.transform([L.modifyOp(Stateful.populateRace.execWith)]);
const populate = populateRace;

// testing:
const testSheet2 = testSheet;
const testSheet3 = incScoreBase('dex', 15)(testSheet2);
const testSheet4 = setRace('halfling')(testSheet3); // ?
const testSheet5 = setRaceBase('halfling')(testSheet);
const testSheet6 = populateRace(testSheet5); // ?
const testSheet7 = populateRace(testSheet); // ?

L.get(View.scoreByNameTotal('dex'), testSheet2); // ?
L.get(View.scoreByNameTotal('dex'), testSheet3); // ?
L.get(Model.scorePool, testSheet3); // ?
L.get([Model.scores, Scores.scoreByName('dex')], testSheet3); // ?

// MIKE: maybe pass in the mapping function?
selectSkills(testSheet2); // ?
selectSkills(testSheet3); // ?
selectScores(testSheet2); // ?
selectSkills(testSheet); // ?

// exports:
export {
  skillByNameTotal,
  selectSkills,
  selectScores,
  populate,
  setScoreBase,
  incScoreBase,
  setRace,
  populateRace,
};

// MIKE: implement these:
// - races
// - skill/score proficiency
// - classes
// - profeciency bonus
// - levels


// MIKE: add this option thing:

// const newProps = {
//   options: ['race']
// };


// NOTE: this is how you would turn something into a closure used like a class
// (not necessary in this case but demonstrates how to do it):

// const Utility = (() => {
//   const calcModifier = x => RA.floor((x - 10) / 2);

//   return {
//     createBonus: score => ({
//       source: score.name,
//       val: calcModifier(score.base),
//     }),
//   };
// })();


// MIKE: redo this to use new method

// gets addBonusToSkill transforms for a specific bonus
// const getFinalTransforms = (sourceTargets, bonus) => R.map(
//   cur(Transform.addBonusToSkill)(bonus),
//   sourceTargets[bonus.source],
// );

// const addFinalTransforms = (sourceTargets, sheet) => {
//   const bonuses = L.collect([Model.scores, L.elems, Helper.createBonusOld], sheet);
//   const transforms = R.chain(cur(getFinalTransforms)(sourceTargets), bonuses);
//   return L.transform([L.seq(...transforms)], sheet);
// };

// let populatedSheet = addFinalTransforms(sourceTargets, testSheet);
