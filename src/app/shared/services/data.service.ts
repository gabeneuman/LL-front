import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environments } from 'src/app/environments/environment';
import { WorkoutI } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  readonly userInfoChanged$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
  ) {}

  createWorkout(workout: any) {
    return this.http.post(
      `${environments.baseURL}${environments.workoutAPI}/create`,
      workout
    );
  }

  getWorkOuts(): Observable<WorkoutI[]> {
    return this.http.get<WorkoutI[]>(
      `${environments.baseURL}${environments.workoutAPI}/`
    );
  }

  getCompletedWorkOuts(): Observable<WorkoutI[]> {
    return this.http.get<WorkoutI[]>(
      `${environments.baseURL}${environments.workoutAPI}/completed`
    );
  }

  getWorkoutById(id: string): Observable<WorkoutI> {
    return this.http.get<WorkoutI>(
      `${environments.baseURL}${environments.workoutAPI}/${id}`
    );
  }

  updateWorkout(id: string, workout: any): Observable<WorkoutI> {
    return this.http.put<WorkoutI>(
      `${environments.baseURL}${environments.workoutAPI}/${id}`,
      workout
    );
  }

  deleteWorkout(id: string): Observable<WorkoutI> {
    return this.http.put<WorkoutI>(
      `${environments.baseURL}${environments.workoutAPI}/delete/${id}`,
      {}
    );
  }

  updateUser(user: any) {
    this.userInfoChanged$.next(user);
    return this.http.put(
      `${environments.baseURL}${environments.userAPI}/me`,
      user
    );
  }

  getUser(): Observable<any> {
    return this.http.get<any>(
      `${environments.baseURL}${environments.userAPI}/me`
    );
  }

}
