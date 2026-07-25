import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { GeneralResponseDto } from '../../../shared/interfaces/general-response-dto';

import { CreateHabitRequest } from '../interfaces/create/create-habit-request';
import { CreateHabitResponse } from '../interfaces/create/create-habit-response';
import { DeleteHabitRequest } from '../interfaces/delete/delete-habit-request';
import { ReadHabitRequest } from '../interfaces/read/read-habit-request';
import { ReadHabitResponse } from '../interfaces/read/read-habit-response';
import { ReadAllHabitResponse } from '../interfaces/read/read-all-habit-response';
import { ReadAspectHabitsRequest } from '../interfaces/read/read-aspect-habits-request';
import { RestoreHabitRequest } from '../interfaces/restore/restore-habit-request';
import { UpdateHabitRequest } from '../interfaces/update/update-habit-request';

@Injectable({
  providedIn: 'root',
})
export class HabitAPI {
  private apiUrl = environment.apiUrl + '/Habits'; // Replace with your actual API URL
  private http = inject(HttpClient);

  // create
  create(request: CreateHabitRequest): Observable<GeneralResponseDto<CreateHabitResponse>> {
    return this.http.post<GeneralResponseDto<CreateHabitResponse>>(
      `${this.apiUrl}/create`,
      request,
    );
  }

  // Read (single)
  read(request: ReadHabitRequest): Observable<GeneralResponseDto<ReadHabitResponse>> {
    return this.http.get<GeneralResponseDto<ReadHabitResponse>>(`${this.apiUrl}/read`, {
      params: { habitId: request.habitId },
    });
  }

  // readAll
  readAll(): Observable<GeneralResponseDto<ReadAllHabitResponse>> {
    return this.http.get<GeneralResponseDto<ReadAllHabitResponse>>(`${this.apiUrl}/readAll`);
  }

  // aspectHabit
  getAspectHabits(
    request: ReadAspectHabitsRequest,
  ): Observable<GeneralResponseDto<ReadAllHabitResponse>> {
    return this.http.get<GeneralResponseDto<ReadAllHabitResponse>>(`${this.apiUrl}/aspectHabit`, {
      params: { aspectId: request.aspectId },
    });
  }

  // deletedHabit
  getDeletedHabits(): Observable<GeneralResponseDto<ReadAllHabitResponse>> {
    return this.http.get<GeneralResponseDto<ReadAllHabitResponse>>(`${this.apiUrl}/deletedHabit`);
  }

  // Update
  update(request: UpdateHabitRequest): Observable<GeneralResponseDto<any>> {
    return this.http.put<GeneralResponseDto<any>>(`${this.apiUrl}/update`, request);
  }

  // Delete (soft)
  delete(request: DeleteHabitRequest): Observable<GeneralResponseDto<any>> {
    return this.http.put<GeneralResponseDto<any>>(`${this.apiUrl}/delete`, request);
  }

  // Delete forever
  deleteForEver(request: DeleteHabitRequest): Observable<GeneralResponseDto<any>> {
    return this.http.delete<GeneralResponseDto<any>>(`${this.apiUrl}/delete`, {
      body: request,
    });
  }

  // Restore
  restore(request: RestoreHabitRequest): Observable<GeneralResponseDto<any>> {
    return this.http.put<GeneralResponseDto<any>>(`${this.apiUrl}/restore`, request);
  }
}
