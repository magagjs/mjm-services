import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingMobel } from 'src/app/models/booking-mobel';
import { contactsValidatorDirective } from "../../directives/contacts-validator";

@Component({
  selector: 'mjm-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {

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

  constructor( private formbuilder: FormBuilder ) { 

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
    },
    {validator: contactsValidatorDirective(Validators.required, ['email', 'phone'])} );
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

  onBookingSubmit() {
    console.log("Booking form submitted:");
    console.log(this.bookingForm);
    const formValues = this.bookingForm.value; // get form values
    // assign form values to booking model
    this.bookingModel = new BookingMobel( formValues.serviceType, formValues.date, 
      formValues.name, formValues.email, formValues.phone);
    console.log("Booking Model:");
    console.log(this.bookingModel);
  }

}
