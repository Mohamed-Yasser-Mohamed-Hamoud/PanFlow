import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { GeneralResponseDto } from '../../../shared/interfaces/general-response-dto';
import { AddHabitsToDayRequest } from '../interfaces/add-habits/add-habits-to-day-request';
import { AddHabitsToDayResponse } from '../interfaces/add-habits/add-habits-to-day-response';
import { CreateDayRequest } from '../interfaces/create/create-day-request';
import { CreateDayResponse } from '../interfaces/create/create-day-response';
import { ReadDayRequest } from '../interfaces/read/read-day-request';
import { ReadDayResponse } from '../interfaces/read/read-day-response';
import { ReadAllDayResponse } from '../interfaces/read/read-all-day-response';
import { UpdateHabitDayRequest } from '../interfaces/update/update-habit-day-request';

@Injectable({
  providedIn: 'root',
})
export class DayAPI {
  private apiUrl = environment.apiUrl + '/Day'; // Replace with your actual API URL
  private http = inject(HttpClient);

  // create
  create(request: CreateDayRequest): Observable<GeneralResponseDto<CreateDayResponse>> {
    return this.http.post<GeneralResponseDto<CreateDayResponse>>(`${this.apiUrl}/create`, request);
  }

  // today (get or auto-create an empty today's day)
  today(): Observable<GeneralResponseDto<ReadDayResponse>> {
    return this.http.get<GeneralResponseDto<ReadDayResponse>>(`${this.apiUrl}/today`);
  }

  // Read (single)
  read(request: ReadDayRequest): Observable<GeneralResponseDto<ReadDayResponse>> {
    return this.http.get<GeneralResponseDto<ReadDayResponse>>(`${this.apiUrl}/read`, {
      params: { dayId: request.dayId },
    });
  }

  // readAll
  readAll(): Observable<GeneralResponseDto<ReadAllDayResponse>> {
    return this.http.get<GeneralResponseDto<ReadAllDayResponse>>(`${this.apiUrl}/readAll`);
  }

  // updateHabitStatus
  updateHabitStatus(request: UpdateHabitDayRequest): Observable<GeneralResponseDto<any>> {
    return this.http.put<GeneralResponseDto<any>>(`${this.apiUrl}/updateHabitStatus`, request);
  }

  // addHabitsToDay (كان اسمها addHabits قبل كده - اتصلحت عشان تطابق route الباك اند)
  addHabits(request: AddHabitsToDayRequest): Observable<GeneralResponseDto<AddHabitsToDayResponse>> {
    return this.http.post<GeneralResponseDto<AddHabitsToDayResponse>>(
      `${this.apiUrl}/addHabitsToDay`,
      request,
    );
  }

  // Delete day (soft delete)
  delete(request: { dayId: string }): Observable<GeneralResponseDto<any>> {
    return this.http.delete<GeneralResponseDto<any>>(`${this.apiUrl}/delete`, {
      params: { dayId: request.dayId },
    });
  }

  // Restore day
  restore(request: { dayId: string }): Observable<GeneralResponseDto<any>> {
    return this.http.post<GeneralResponseDto<any>>(`${this.apiUrl}/restore`, request);
  }

  // Remove habit from day
  removeHabitFromDay(request: { dayId: string; habitId: string }): Observable<GeneralResponseDto<any>> {
    return this.http.delete<GeneralResponseDto<any>>(`${this.apiUrl}/removeHabitFromDay`, {
      params: { dayId: request.dayId, habitId: request.habitId },
    });
  }

  // Reorder habits in day
  reorderHabits(request: { dayId: string; habitIds: string[] }): Observable<GeneralResponseDto<any>> {
    return this.http.put<GeneralResponseDto<any>>(`${this.apiUrl}/reorderHabits`, request);
  }
}
