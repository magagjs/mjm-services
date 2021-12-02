import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { BlockUI, NgBlockUI } from "ng-block-ui";

import { BookingMobel } from '../../models/booking-mobel';
import { BookingResponse } from '../../models/booking-response';
import { contactsValidatorDirective } from "../../directives/contacts-validator";
import { MjmCentreService } from '../../services/mjm-centre.service';



@Component({
  selector: 'mjm-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {

  // wire up BlockUI instance
  @BlockUI() blockUI!: NgBlockUI;

  bookingForm!: FormGroup;
  serviceType = {
    minor: "Minor Service",
    major: "Major Service",
    diesel: "Major Diesel Service",
    mech: "Mechanical Repairs"
  };
  //bookingForm!: FormGroup;
  isEmailChecked: boolean = false;
  isPhoneChecked: boolean = false;
  bookingModel!: BookingMobel;
  bookingResponse!: BookingResponse;
  isBookingMade: boolean = false;
  isBookingSuccess: boolean = false;
  todayDate: Date = new Date();
  recaptchaToken!: string;
  formType: string = "booking";

  constructor( private formbuilder: FormBuilder,
               private mjmService: MjmCentreService,
               private router: Router,
               private recaptchaV3Service: ReCaptchaV3Service ) { 

    this.initForm();
  }

  private initForm() {
      this.bookingForm = this.formbuilder.group({
      "serviceType": [this.serviceType, Validators.required],
      "date": ['', Validators.required],
      "name": ['', Validators.required],
      "email": ['', {
        validators: [Validators.pattern(/^[\w]{1,}[\w.+-]{0,}@[\w-]{1,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/)],
        updateOn: 'change'}],
      "phone": ['', {
        validators: [Validators.pattern(new RegExp("^[0-9 ]{10}$"))],
        updateOn: 'change'}]
    }, {validator: contactsValidatorDirective(Validators.required, ['email', 'phone'])} as AbstractControlOptions );
  }
  
  ngOnInit(){}

  emailCheck(e: Event) {
    this.isEmailChecked = !this.isEmailChecked;
    // clear entered text on radio box untick
    if(!this.isEmailChecked)
      this.bookingForm.controls['email'].setValue('');
  }

  phoneCheck(e: Event) {
    this.isPhoneChecked = !this.isPhoneChecked;
    if(!this.isEmailChecked)
      this.bookingForm.controls['phone'].setValue('');
  }

  goBackHome() {
    this.bookingForm.reset();
    this.isEmailChecked = false;
    this.isPhoneChecked = false;
    this.router.navigateByUrl('');
  }

  goBooking() {
    this.isBookingMade = false;
    this.bookingForm.reset();
    this.isEmailChecked = false;
    this.isPhoneChecked = false;
  }

  disableOnClick(event: any) {
    event.currentTarget.disabled=true;
  }

  checkDate() {
    let formInputDate = new Date(this.bookingForm.get('date')?.value);
    if(formInputDate.getTime() < this.todayDate.getTime()) 
      this.bookingForm.get('date')?.setErrors({'incorrect': 'Date cannot be in the past!'});
  }

  /* chain recaptcha observable to get token to use to create booking model passed in
    submitBooking() service function and subscribe to the result*/
  onBookingSubmit(): Subscription {
    this.blockUI.start("Submitting Booking...");
    return this.recaptchaV3Service.execute("Booking").pipe(
      mergeMap(token => {

        const formValues = this.bookingForm.value; // get form values
        // instantiate booking model with form values and recaptcha V3 token
        this.bookingModel = new BookingMobel( this.formType, token, formValues.serviceType, formValues.date, 
          formValues.name, formValues.email, formValues.phone);
    
        // call booking webservice and pass booking model
        return this.mjmService.submitBooking(this.bookingModel);
      })
    ).subscribe ( (bookingResponseObservable) => {
      this.bookingResponse = {...bookingResponseObservable}; // assign returned Observable to response object
      this.bookingForm.reset();                              // reset form input value for cleanup

      if( this.bookingResponse.bookingStatus == "Success" ) {
        this.isBookingMade = true;
        this.isBookingSuccess = true;
      } else {
        this.isBookingMade = true;
        this.isBookingSuccess = false;
      }
      this.blockUI.stop();
    });
  } 

}
