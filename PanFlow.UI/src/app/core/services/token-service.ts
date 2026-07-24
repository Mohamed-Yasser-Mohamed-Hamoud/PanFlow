import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private token = "authToken"

  save(token : string) :void
  {
    localStorage.setItem(this.token , token)
  }

  get(): string | null
  {
    return localStorage.getItem(this.token)
  }

  remove():void
  {
    localStorage.removeItem(this.token)
  }

  isPresent(): boolean
  {
    return !!this.get();
  }
}
