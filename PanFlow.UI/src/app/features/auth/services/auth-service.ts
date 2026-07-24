import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../../../core/services/token-service'; 
import { GeneralResponseDto } from '../../../shared/interfaces/general-response-dto'; // 👈 التعديل هنا
import { AuthResponse } from '../interfaces/auth-response';
import { RegisterRequest } from '../interfaces/Register/register-request';
import { LoginRequest } from '../interfaces/Login/login-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl+'/Auth'; // Replace with your actual API URL
  private tokenService = inject(TokenService);
  private http = inject(HttpClient);

  register(data: RegisterRequest): Observable<GeneralResponseDto<AuthResponse>> { // 👈 هنا كمان
    return this.http.post<GeneralResponseDto<AuthResponse>>(`${this.apiUrl}/Register`, data);
  }

  login(data: LoginRequest): Observable<GeneralResponseDto<AuthResponse>> { // 👈 وهنا كمان
    return this.http.post<GeneralResponseDto<AuthResponse>>(`${this.apiUrl}/Login`, data);
  }

  logout() {
    this.tokenService.remove();
  }
}