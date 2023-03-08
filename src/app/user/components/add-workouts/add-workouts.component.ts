import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { NotesComponent } from 'src/app/shared/components/notes/notes.component';
import {
  CORE_EXERCISE_TYPES,
  EXERCISE_TYPE,
  EXERCISE_TYPES,
} from 'src/app/shared/consts';
import {
  DropDownI,
  ExerciseGroupI,
  ExerciseI,
  ExerciseSetsI,
  WorkoutI,
} from 'src/app/shared/interfaces';
import { DataService } from 'src/app/shared/services/data.service';
import { TitleService } from 'src/app/shared/services/title.service';

@Component({
  selector: 'app-add-workouts',
  templateUrl: './add-workouts.component.html',
  styleUrls: ['./add-workouts.component.css'],
})
export class AddWorkoutsComponent implements OnInit {
  workoutForm!: FormGroup;
  workOutPlan!: WorkoutI[];
  exerciseTypeEnums = EXERCISE_TYPES;
  exerciseTypes: DropDownI[] = EXERCISE_TYPE;
  coreSetTypes: DropDownI[] = CORE_EXERCISE_TYPES;
  isGrouped = false;
  formFieldHelpers: string[] = [''];
  workoutId!: string | null;
  notes: string = '';
  isReadOnly = false;

  constructor(
    private formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly titleService: TitleService,
    private dialog: MatDialog,
    private dataService: DataService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  getCoreExerciseType(
    event: MatRadioChange,
    groupId: number,
    exerciseId: number
  ) {
    const noOfSets = this.workoutForm.value.exerciseGroup[groupId].noOfSets;
    this.getExerciseSetRepsOrTime(groupId, exerciseId).clear();
    for (let setId = 0; setId < noOfSets; setId++) {
      this.addExerciseGroupSets(groupId, exerciseId, setId);
      if (event.value === 'reps') {
        this.exerciseGroup
          .at(groupId)
          .get('exercises')
          .at(exerciseId)
          .get('sets')
          .at(setId)
          .controls['reps'].addValidators(Validators.required);

        this.exerciseGroup
          .at(groupId)
          .get('exercises')
          .at(exerciseId)
          .get('sets')
          .at(setId)
          .controls['reps'].updateValueAndValidity();
      } else if (event.value === 'time') {
        this.exerciseGroup
          .at(groupId)
          .get('exercises')
          .at(exerciseId)
          .get('sets')
          .at(setId)
          .controls['minutes'].addValidators(Validators.required);
        this.exerciseGroup
          .at(groupId)
          .get('exercises')
          .at(exerciseId)
          .get('sets')
          .at(setId)
          .controls['minutes'].updateValueAndValidity();
      }
    }
  }

  get hasExercise() {
    return this.workoutForm.value.exerciseGroup[0]?.exercises?.length;
  }

  ngOnInit(): void {
    this.initializeWorkoutForm();
    this.workoutId = this.route.snapshot.paramMap.get('workoutId');
    const isReadOnly = this.route.snapshot.paramMap.get('isReadOnly');
    if (isReadOnly) {
      this.isReadOnly = true;
      this.getWorkoutDetails(isReadOnly);
    }
    if (this.workoutId) {
      this.getWorkoutDetails(this.workoutId);
    }
  }

  onEdit(workout: WorkoutI): void {
    console.log('workout: ', workout);
    this.titleService.setTitle(this.isReadOnly ? `Readonly (${workout.name})` : `Edit workout (${workout.name})`);
    this.workoutForm.patchValue({ name: workout.name });
    this.workoutForm.patchValue({ notes: workout.notes });
    // populating the exercise groups
    workout.exerciseGroup.forEach(
      (exerciseGroup: ExerciseGroupI, groupId: number) => {
        this.addNewGroup();
        this.exerciseGroup.controls[groupId].patchValue(exerciseGroup);
        //populating exercises inside of each groups
        exerciseGroup.exercises.forEach(
          (excercise: ExerciseI, exerciseId: number) => {
            // updating the excercise according to its group
            this.addNewExercise(groupId);
            // setting the value of exercise fields accroding to their group
            this.getExercises(groupId).controls[exerciseId].patchValue(
              excercise
            );
            // populating sets insides each exercise according to number of sets
            excercise.sets.forEach((sets: ExerciseSetsI, setId: number) => {
              // updating number of sets of each exercise inside of its group
              this.addExerciseGroupSets(groupId, exerciseId, setId);
              this.getExerciseSetRepsOrTime(groupId, exerciseId).controls[
                setId
              ].patchValue(sets);
            });
          }
        );
      }
    );
  }

  private getWorkoutDetails(id: string): void {
    this.dataService.getWorkoutById(id).subscribe((res) => {
      this.onEdit(res);
    });
  }

  /**
   * Initialize Workout Form
   */
  initializeWorkoutForm(): void {
    this.workoutForm = this.formBuilder.group({
      name: ['', Validators.required],
      exerciseGroup: this.formBuilder.array([]),
      completed: [false],
      notes: [''],
    });
  }

  // Section Exercise Group Start

  /**
   * get exercise group
   */
  get exerciseGroup(): any {
    return this.workoutForm.controls['exerciseGroup'] as FormArray;
  }

  /**
   * Initialize Exercise Groups
   */
  createNewGroup(): void {
    const exerciseGroupItem = this.formBuilder.group({
      exercises: this.formBuilder.array([]),
      noOfSets: [null, Validators.required],
      completed: [false],
    });
    this.exerciseGroup.push(exerciseGroupItem);
  }

  /**
   * Adds new group to workout
   * such as workout = {
   *  exerciseGroups: [
   *      0: [],
   *      1: [],
   *  ]
   * }
   */
  addNewGroup(): void {
    if (this.exerciseGroup.length >= 1) {
      if (this.workoutId) {
        this.isGrouped = true;
        this.createNewGroup();
        return;
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: `Are you sure?`,
          content: `Are you sure you want to add new exercise group?`,
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.isGrouped = true;
          this.createNewGroup();
        }
      });
    } else {
      this.createNewGroup();
    }
  }

  removeExerciseGroup(groupId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Are you sure?`,
        content: `Are you sure you want to delete exercise gourp ${
          groupId + 1
        }`,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.exerciseGroup.removeAt(groupId);
      }
    });
  }

  // Section Exercise Group End

  // Section for adding multiple exercises STart

  getExercises(groupId: number): any {
    return this.exerciseGroup.at(groupId).get('exercises') as FormArray;
  }

  addNewExercise(groupId: number): void {
    const exerciseForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      reps: [null],
      weight: [null],
      time: [''],
      notes: [''],
      noOfSets: [null],
      coreType: [null],
      completed: [false],
      sets: this.formBuilder.array([]),
    });
    this.getExercises(groupId).push(exerciseForm);
  }

  removeExercise(groupId: number, exerciseId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Are you sure?`,
        content: `Are you sure you want to remove this exercise?`,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getExercises(groupId).removeAt(exerciseId);
      }
    });
  }

  getExerciseTypeSelection(
    event: MatSelectChange,
    groupId: number,
    exerciseId: number
  ): void {
    this.exerciseGroup
      .at(groupId)
      .get('exercises')
      .at(exerciseId).controls.coreType.value = '';
    const noOfSets = this.workoutForm.value.exerciseGroup[groupId].noOfSets;
    if (event.value != this.exerciseTypeEnums.CORE) {
      this.getExerciseSetRepsOrTime(groupId, exerciseId).clear();
      for (let set = 0; set < noOfSets; set++) {
        this.addExerciseGroupSets(groupId, exerciseId, set);
      }
    } else {
      this.getExerciseSetRepsOrTime(groupId, exerciseId).clear();
      this.addExerciseGroupSets(groupId, exerciseId, 0);
    }
  }
  // Section for adding multiple exercises End

  // SEction for no of sets per exercise Start

  /**
   *
   * @param groupId Exercise Group Id
   * @param exerciseId Exercise Id in current Group Id
   * @returns FormArray
   */
  getExerciseSetRepsOrTime(groupId: number, exerciseId: number): FormArray {
    return this.exerciseGroup
      .at(groupId)
      .get('exercises')
      .at(exerciseId)
      .get('sets') as FormArray;
  }

  createExerciseSet(): FormGroup {
    return this.formBuilder.group({
      reps: [null],
      minutes: [''],
      seconds: [''],
    });
  }

  addExerciseGroupSets(
    groupId: number,
    exerciseId: number,
    setId: number
  ): void {
    this.getExerciseSetRepsOrTime(groupId, exerciseId).push(
      this.createExerciseSet()
    );
    switch (this.getExerciseType(groupId, exerciseId, setId)) {
      case this.exerciseTypeEnums.CARDIO:
        this.exerciseGroup
          .at(groupId)
          .get('exercises')
          .at(exerciseId)
          .get('sets')
          .at(setId)
          .controls['minutes'].addValidators(Validators.required);
        this.exerciseGroup
          .at(groupId)
          .get('exercises')
          .at(exerciseId)
          .get('sets')
          .at(setId)
          .controls['minutes'].updateValueAndValidity();
        break;
      case this.exerciseTypeEnums.WEIGHTS:
        this.exerciseGroup
          .at(groupId)
          .get('exercises')
          .at(exerciseId)
          .get('sets')
          .at(setId)
          .controls['reps'].addValidators(Validators.required);
        this.exerciseGroup
          .at(groupId)
          .get('exercises')
          .at(exerciseId)
          .get('sets')
          .at(setId)
          .controls['reps'].updateValueAndValidity();

        break;

      default:
        break;
    }
  }

  getExerciseType(groupId: number, exerciseId: number, setId?: number): string {
    return this.exerciseGroup.at(groupId).get('exercises').at(exerciseId)
      .controls.type.value;
  }

  // SEction for no of sets per exercise End

  save() {
    if (this.workoutId) {
      this.dataService
        .updateWorkout(this.workoutId, this.workoutForm.value)
        .subscribe({
          next: (res) => {
            this.toastr.success('Workout Updated Successfully');
            this.router.navigate(['/workout-list']);
          },
        });
    } else {
      this.dataService.createWorkout(this.workoutForm.value).subscribe({
        next: (res) => {
          this.toastr.success('Workout Created Successfully');
          this.router.navigate(['/workout-list']);
        },
      });
    }
  }

  public addNotes(groupId: number, exerciseId: number): void {
    const dialogRef = this.dialog.open(NotesComponent, {
      width: '500px',
      height: '500px',
      data: {
        note: this.exerciseGroup.at(groupId).get('exercises').at(exerciseId)
          .controls['notes'].value,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.notes = res;
        this.exerciseGroup.at(groupId).get('exercises').at(exerciseId)
          .controls['notes'].setValue(this.notes);
      }
      console.log(this.workoutForm.value);
    });

    // this.workoutForm.controls['notes'].setValue(this.notes);
  }

  /**
   * helper function to support placeholders and labels for form fields
   */
  getFormFieldHelpersAsString(): string {
    return this.formFieldHelpers.join(' ');
  }
}
