export interface WorkoutI {
  _id?: string;
  id?: string;
  name: string;
  exerciseGroup: ExerciseGroupI[];
  exerciseGroupLength?: number;
  notes?: string;
  completed?: boolean;
  isDeleted?: boolean;
  createdBy?: string | any;
  modifiedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExerciseGroupI {
  exercises: ExerciseI[];
  noOfSets: number;
  completed?: boolean;
}

export interface ExerciseI {
  name: string;
  type: string;
  noOfSets: string;
  sets: ExerciseSetsI[];
  reps?: number;
  weight?: number;
  time?: string;
  notes?: string;
  completed?: boolean;
  coreType?: string;
}

export interface ExerciseSetsI {
  reps?: number;
  minutes?: string;
  seconds?: string;
  weight?: number;
  completed?: boolean;
}
