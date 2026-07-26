import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { GeneralResponseDto } from '../../../shared/interfaces/general-response-dto';
import { ReadAnalysisResponse } from '../interfaces/read/read-analysis-response';

@Injectable({
  providedIn: 'root',
})
export class AnalysisAPI {
  private apiUrl = environment.apiUrl + '/Analysis'; // Replace with your actual API URL
  private http = inject(HttpClient);

  // read (everything the Analysis screen needs, computed on the backend)
  read(): Observable<GeneralResponseDto<ReadAnalysisResponse>> {
    return this.http.get<GeneralResponseDto<ReadAnalysisResponse>>(`${this.apiUrl}/read`);
  }
}
