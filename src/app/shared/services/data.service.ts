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

  getAllWorkOuts(payload): Observable<WorkoutI[]> {
    return this.http.post<WorkoutI[]>(
      `${environments.baseURL}${environments.workoutAPI}/explore`, payload
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

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(
      `${environments.baseURL}${environments.userAPI}/${id}`
    );
  }

  redoWorkout(body: {_id? :string, workoutId: string, user: string, workout:any}): Observable<any> {
    return this.http.post<any>(
      `${environments.baseURL}${environments.workoutAPI}/redo`,
        body
    );
  }

  searchWorkoutByName(payload, page): Observable<WorkoutI[]> {
    return this.http.get<WorkoutI[]>(
      `${environments.baseURL}${environments.workoutAPI}/explore/search?search=${payload}&page=${page}`
    );
  }

  getCompletedWorkoutDetails(id: string): Observable<WorkoutI> {
    return this.http.get<WorkoutI>(
      `${environments.baseURL}${environments.workoutAPI}/completed/${id}`
    );
  }

}
