import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { GeneralResponseDto } from '../../../shared/interfaces/general-response-dto';
import { CreateDayRequest } from '../interfaces/create/create-day-request';
import { CreateDayResponse } from '../interfaces/create/create-day-response';
import { DeleteDayRequest } from '../interfaces/delete/delete-day-request';
import { ReadDayRequest } from '../interfaces/read/read-day-request';
import { ReadDayResponse } from '../interfaces/read/read-day-response';
import { ReadAllDayResponse } from '../interfaces/read/read-all-day-response';
import { RestoreDayRequest } from '../interfaces/restore/restore-day-request';
import { UpdateDayHabitRequest } from '../interfaces/update/update-day-habit-request';
import { AddHabitsToDayRequest } from '../interfaces/add-habits/add-habits-to-day-request';
import { AddHabitsToDayResponse } from '../interfaces/add-habits/add-habits-to-day-response';

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

  // today (get or auto-create today's day)
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
  removeHabitFromDay(request: { dayId: string; habitId: string }) {
    return this.http.delete<GeneralResponseDto<object>>(`${this.apiUrl}/removeHabit`, {
      body: request,
    });
  }

  // Add habits to day
  addHabits(
    request: AddHabitsToDayRequest,
  ): Observable<GeneralResponseDto<AddHabitsToDayResponse>> {
    return this.http.post<GeneralResponseDto<AddHabitsToDayResponse>>(
      `${this.apiUrl}/addHabits`,
      request,
    );
  }

  // deletedDay
  getDeletedDays(): Observable<GeneralResponseDto<ReadAllDayResponse>> {
    return this.http.get<GeneralResponseDto<ReadAllDayResponse>>(`${this.apiUrl}/deletedDay`);
  }

  // updateHabitStatus (dayId + habitId مع بعض، لأن DayHabit عنده Composite Key)
  updateHabitStatus(request: UpdateDayHabitRequest): Observable<GeneralResponseDto<any>> {
    return this.http.put<GeneralResponseDto<any>>(`${this.apiUrl}/updateHabitStatus`, request);
  }

  // Delete (soft)
  delete(request: DeleteDayRequest): Observable<GeneralResponseDto<any>> {
    return this.http.put<GeneralResponseDto<any>>(`${this.apiUrl}/delete`, request);
  }

  // Delete forever
  deleteForEver(request: DeleteDayRequest): Observable<GeneralResponseDto<any>> {
    return this.http.delete<GeneralResponseDto<any>>(`${this.apiUrl}/delete`, {
      body: request,
    });
  }

  // Restore
  restore(request: RestoreDayRequest): Observable<GeneralResponseDto<any>> {
    return this.http.put<GeneralResponseDto<any>>(`${this.apiUrl}/restore`, request);
  }
}
