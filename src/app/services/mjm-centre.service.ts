import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { BookingMobel } from '../models/booking-mobel';
import { BookingResponse } from '../models/booking-response';
import { QuoteModel } from '../models/quote-model';
import { QuoteResponse } from '../models/quote-response';
import { ContactModel } from '../models/contact-model';
import { ContactResponse } from '../models/contact-response';

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

  submitQuote( quoteModel: QuoteModel ): Observable<QuoteResponse> {
    return this.http.post<QuoteResponse>(this.appApiBase + this.formsApiEndpoint, quoteModel)
  }

  submitContact( contactModel: ContactModel ): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.appApiBase + this.formsApiEndpoint, contactModel)
  }
}
