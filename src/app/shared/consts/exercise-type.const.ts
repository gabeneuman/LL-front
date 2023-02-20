import { DropDownI } from '../interfaces';

export const EXERCISE_TYPE: DropDownI[] = [
  {
    label: 'Weights',
    value: 'weights',
  },
  {
    label: 'Cardio',
    value: 'cardio',
  },
  {
    label: 'Core',
    value: 'core',
  },
];


export enum EXERCISE_TYPES {
  WEIGHTS = "weights",
  CARDIO = "cardio",
  CORE = "core",
}

export const CORE_EXERCISE_TYPES: DropDownI[] = [
  {
    label: 'Reps',
    value: 'reps',
  },
  {
    label: 'Time',
    value: 'time'
  }
]