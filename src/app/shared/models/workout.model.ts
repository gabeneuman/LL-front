import { ExerciseGroupI } from '../interfaces';

export class Workout {
  name: string = '';
  exerciseGroups: ExerciseGroupI[] = [];
  note?: string = '';
  progress?: number | string | any = '';
}
