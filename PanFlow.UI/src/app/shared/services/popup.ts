import { Injectable } from '@angular/core';
import { icons } from 'lucide';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class Popup {
  
  constructor() {}

  underWork()
  {

    Swal.fire({
    title : 'still in progress 🚧',
    icon : 'info',
    confirmButtonText : 'Ok',
    confirmButtonColor : '#cc8500',
    background : '#ffffff',
    customClass: 
    {
      popup : 'my-popup'
    },
    showClass:{
      popup : 'animate__animated animate__fadeInDown'
    },
    hideClass:{
      popup:'animate__animated animate__fadeOutUp'
    },
  });
  }




}
