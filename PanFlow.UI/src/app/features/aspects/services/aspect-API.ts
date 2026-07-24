import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateAspectResponse } from '../interfaces/create/create-aspect-response';
import { GeneralResponseDto } from '../../../shared/interfaces/general-response-dto';
import { Observable } from 'rxjs';
import { CreateAspectRequest } from '../interfaces/create/create-aspect-request';
import { ReadAspectResponse } from '../interfaces/read/read-aspect-response';
import { ReadAspectRequest } from '../interfaces/read/read-aspect-request';
import { GetAllAspectsResponse } from '../interfaces/read/get-all-aspects-response';
import { UpdateAspectRequest } from '../interfaces/update/update-aspect-request';
import { environment } from '../../../../environments/environment.development';
import { DeleteAspectRequest } from '../interfaces/delete/delete-aspect-request';

@Injectable({
  providedIn: 'root',
})
export class AspectAPI {
  private apiUrl = environment.apiUrl + '/Aspects'; // Replace with your actual API URL
  private http = inject(HttpClient); // الـ Inject الحديثة ونبّدل الـ constructor

  // create
  create(request: CreateAspectRequest): Observable<GeneralResponseDto<CreateAspectResponse>> {
    return this.http.post<GeneralResponseDto<CreateAspectResponse>>(
      `${this.apiUrl}/create`,
      request,
    );
  }

  //GetById
  getById(request: ReadAspectRequest): Observable<GeneralResponseDto<ReadAspectResponse>> {
    return this.http.get<GeneralResponseDto<ReadAspectResponse>>(`${this.apiUrl}/get`, {
      params: { aspectId: request.aspectId },
    });
  }

  //GetAll
  getAll(): Observable<GeneralResponseDto<GetAllAspectsResponse>> {
    return this.http.get<GeneralResponseDto<GetAllAspectsResponse>>(`${this.apiUrl}/get-all`);
  }

  getAllDeleted(): Observable<GeneralResponseDto<GetAllAspectsResponse>> {
    return this.http.get<GeneralResponseDto<GetAllAspectsResponse>>(`${this.apiUrl}/get-deleted`);
  }

  //Update
  update(request: UpdateAspectRequest): Observable<GeneralResponseDto<any>> {
    return this.http.put<GeneralResponseDto<any>>(`${this.apiUrl}/update`, request);
  }

  DeleteForEver(request: DeleteAspectRequest): Observable<GeneralResponseDto<any>> {
    return this.http.delete<GeneralResponseDto<any>>(`${this.apiUrl}/delete`, {
      body: request,
    });
  }

  //Delete
  delete(request: DeleteAspectRequest): Observable<GeneralResponseDto<any>> {
    return this.http.put<GeneralResponseDto<any>>(`${this.apiUrl}/delete`, request);
  }
  //Restore
  restore(request: ReadAspectRequest): Observable<GeneralResponseDto<any>> {
    return this.http.put<GeneralResponseDto<any>>(`${this.apiUrl}/restore`, request);
  }
}
