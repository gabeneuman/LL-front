import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription, takeWhile } from 'rxjs';
import { EXERCISE_TYPES } from 'src/app/shared/consts';
import { WorkoutI } from 'src/app/shared/interfaces';
import { DataService } from 'src/app/shared/services/data.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { TitleService } from 'src/app/shared/services/title.service';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.css'],
})
export class WorkoutComponent implements OnInit, OnDestroy {
  workoutPlans!: WorkoutI[];
  workoutPlan!: any;
  workoutId!: string | null;
  exerciseTypeEnums = EXERCISE_TYPES;
  currentGroupIndex = 0;
  currentExerciseIndex = 0;
  currentSetIndex = 0;
  minutes = 0;
  seconds = 0;
  timer = false;
  showCountdown = false;
  timeUp = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private titleService: TitleService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getWorkoutPlan();
  }

  getWorkoutPlan(): void {
    this.workoutId = this.route.snapshot.paramMap.get('workoutId');
    if (this.workoutId) {
      this.getWorkoutDetails(this.workoutId);
    }
    this.titleService.setTitle(
      this.workoutPlan?.name
        ? `Workout Name: ${this.workoutPlan.name}`
        : 'Workout not found'
    );
  }

  private getWorkoutDetails(id: string): void {
    this.dataService.getWorkoutById(id).subscribe((res) => {
      res.exerciseGroup.forEach(group => {
        group.exercises.forEach(exercise => {
          exercise.sets.forEach(set => {
            set.weight = null;
          }) 
        })
       
      })
      this.workoutPlan = res;
      this.titleService.setTitle(
        this.workoutPlan?.name
         ? this.workoutPlan.name 
         : 'Workout not found'
      );
    });
  }

  private updateWorkout() {
    this.dataService
      .updateWorkout(this.workoutId!, this.workoutPlan)
      .subscribe({
        next: (res) => {},
        error: ({ error }) => {
          this.toastr.error(error.message, 'Error');
        },
      });
  }

  startCountdown(minutes: number, seconds: number) {
    this.timer = this.showCountdown = true;
    if (this.minutes != 0 && this.seconds != 0) {
      minutes = this.minutes;
      seconds = this.seconds;
    }
    this.minutes = minutes;
    this.seconds = seconds;
    this.subscription = interval(1000)
      .pipe(takeWhile(() => this.minutes >= 0 && this.seconds >= 0))
      .subscribe(() => {
        if (--this.seconds < 0) {
          this.seconds = 59;
          if (--this.minutes < 0) {
            this.minutes = 0;
            this.seconds = 0;
            this.subscription.unsubscribe();
            // show alert
            this.toastr.success('Time up', 'Congratulations');
            this.timeUp = true;
            this.workoutPlan.exerciseGroup[this.currentGroupIndex].exercises[
              this.currentExerciseIndex
            ].sets[this.currentSetIndex].completed = true;
            // next exercise in 5 seconds
            setTimeout(() => {
              this.nextExercise(
                this.currentGroupIndex,
                this.currentExerciseIndex,
                this.currentSetIndex
              );
            }, 5000);
          }
        }
      });
  }

  stopCountdown(minutes: number, seconds: number, strict?: boolean) {
    this.timer = false;
    if (strict) {
      this.minutes = 0;
      this.seconds = 0;
      this.timeUp = false;
    } else {
      minutes = this.minutes;
      seconds = this.seconds;
    }
    this.subscription.unsubscribe();
  }

  nextExercise(groupId: number, exerciseId: number, setId: number) {
    const totalSets =
      this.workoutPlan.exerciseGroup[groupId].exercises[exerciseId].sets.length;
    if (
      this.currentExerciseIndex ===
      this.workoutPlan.exerciseGroup[groupId].exercises.length - 1
    ) {
      if (
        this.currentGroupIndex ===
        this.workoutPlan.exerciseGroup.length - 1
      ) {
        if (this.currentSetIndex + 1 != totalSets) {
          this.currentGroupIndex = groupId;
          this.currentExerciseIndex = 0;
          this.currentSetIndex++;
        } else {
          this.workoutPlan.completed = true;
          this.toastr.success('Workout Completed', 'Congratulations');

          this.dataService.redoWorkout({workoutId: this.workoutPlan._id, workout: this.workoutPlan, user: localStorage.getItem('user')}).subscribe();
          this.router.navigate(['/workout-list']);
        }
      } else {
        if (this.currentSetIndex + 1 != totalSets) {
          this.currentGroupIndex = groupId;
          this.currentExerciseIndex = 0;
          this.currentSetIndex++;
        } else {
          this.currentGroupIndex++;
          this.currentExerciseIndex = 0;
          this.currentSetIndex = 0;
        }
      }
    } else {
      this.currentExerciseIndex++;
    }
    this.workoutPlan.exerciseGroup[this.currentGroupIndex].completed = true;
    this.stopCountdown(0, 0, true);
    this.showCountdown = false;
    this.updateWorkout();
  }

  previousExercise(groupId: number, exerciseId: number, setId: number) {
    const totalSets =
      this.workoutPlan.exerciseGroup[groupId].exercises[exerciseId].sets.length;
    if (this.currentExerciseIndex === 0) {
      if (this.currentSetIndex === 0) {
        if (this.currentGroupIndex === 0) {
          this.toastr.warning(
            'This is the first exercise of the workout plan',
            'Cannot go back'
          );
        } else {
          this.currentGroupIndex--;
          this.currentExerciseIndex =
            this.workoutPlan.exerciseGroup[this.currentGroupIndex].exercises
              .length - 1;
          this.currentSetIndex =
            this.workoutPlan.exerciseGroup[this.currentGroupIndex].exercises[
              this.currentExerciseIndex
            ].sets.length - 1;
        }
      } else {
        this.currentSetIndex--;
      }
    } else {
      this.currentExerciseIndex--;
    }
    if (
      !(
        this.currentExerciseIndex == 0 &&
        this.currentSetIndex == 0 &&
        this.currentGroupIndex == 0
      )
    ) {
      this.showCountdown = false;
      this.stopCountdown(0, 0, true);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
