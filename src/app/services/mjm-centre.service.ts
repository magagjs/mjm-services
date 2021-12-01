import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { BookingMobel } from '../models/booking-mobel';
import { BookingResponse } from '../models/booking-response';

@Injectable({
  providedIn: 'root'
})
export class MjmCentreService {

  appApiBase = environment.mjmApiBaseUrl;
  formsApiEndpoint = environment.mjmFormsEndpoint;

  constructor(private http: HttpClient) { }

  submitBooking( bookingModel: BookingMobel ): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.appApiBase + this.formsApiEndpoint, bookingModel)
  }
}
