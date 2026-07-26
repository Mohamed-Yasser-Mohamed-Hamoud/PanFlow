import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralResponseDto } from '../../../shared/interfaces/general-response-dto'; // الـ Interface الموحد
import { SelectedUserResponse } from '../interfaces/Read/selected-user-response';
import { UpdateRequest } from '../interfaces/Update/update-request';
import { UpdatePasswordRequest } from '../interfaces/Update/update-password-request';
import { deleteUserRequest } from '../interfaces/Delete/deleteUserRequest';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl + '/Users'; // Replace with your actual API URL
  private http = inject(HttpClient); // الـ Inject الحديثة ونبّدل الـ constructor

  // 1. جلب بيانات البروفايل (ترجع الداتا متغلفة جوه الـ Response)
  getProfile(): Observable<GeneralResponseDto<SelectedUserResponse>> {
    return this.http.get<GeneralResponseDto<SelectedUserResponse>>(`${this.apiUrl}/profile`);
  }

  // 2. تعديل بيانات البروفايل (أكشن -> بيرجع any مكان الـ object)
  updateProfile(request: UpdateRequest): Observable<GeneralResponseDto<any>> {
    return this.http.put<GeneralResponseDto<any>>(`${this.apiUrl}/profile`, request);
  }

  // 3. تعديل الباسورد (أكشن -> بيرجع any)
  updatePassword(request: UpdatePasswordRequest): Observable<GeneralResponseDto<any>> {
    return this.http.put<GeneralResponseDto<any>>(`${this.apiUrl}/profile/update-password`, request);
  }

  // 4. حذف الحساب (أكشن -> بيرجع any)
  deleteUser(request: deleteUserRequest): Observable<GeneralResponseDto<any>> {
    return this.http.delete<GeneralResponseDto<any>>(`${this.apiUrl}/profile`, { body: request });
  }
}