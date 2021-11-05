import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'mjm-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent {

  serviceType = {
    minor: "Minor Service",
    major: "Major Service",
    diesel: "Major Diesel Service",
    mech: "Mechanical Repairs"
  };
  bookingForm = this.formbuilder.group({
    "name": [null, Validators.required],
    "email": [null, []],
    "phone": [null, []]
  });

  isEmailChecked: boolean = false;
  isPhoneChecked: boolean = false;

  constructor(private formbuilder: FormBuilder) { }

  emailCheck(e: Event) {
    this.isEmailChecked = !this.isEmailChecked;
    //e.target?.dispatchEvent
  }

  phoneCheck(e: Event) {
    this.isPhoneChecked = !this.isPhoneChecked;
  }

  onBookingSubmit() {
    console.log("Booking form submitted:");
    console.log(this.bookingForm);
  }

  /*emailAndPhone() {
    return (form: FormGroup): {[key: string]: any} => {
      return (form.value.phone && form.value.email) ||
             (!form.value.phone && !form.value.email) 
                ? { emailAndPhoneError : true } 
                : null;
    };
  }*/

}
