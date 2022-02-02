import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ReCaptchaV3Service } from 'ng-recaptcha';

import { contactsValidatorDirective } from '../../directives/contacts-validator';
import { MjmCentreService } from '../../services/mjm-centre.service';
import { ContactModel } from 'src/app/models/contact-model';
import { ContactResponse } from 'src/app/models/contact-response';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'mjm-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  docTitle = "MJM - Contact Us"; // current HTML document title
  // wire up BlockUI instance
  @BlockUI() blockUI!: NgBlockUI;

  contactForm!: FormGroup;
  isEmailChecked: boolean = false;
  isPhoneChecked: boolean = false;
  isContactMade: boolean = false;
  isContactSuccess: boolean = false;
  contactModel!: ContactModel;
  contactResponse!: ContactResponse;
  formType: string = "contact";

  constructor( private titleService: Title,         // 'Title' service is for current HTML document title
               private formbuilder: FormBuilder, 
               private mjmService: MjmCentreService,
               private router: Router,
               private recaptchaV3Service: ReCaptchaV3Service ) { 
                 
    this.initForm();
  }

  private initForm() {
    this.contactForm = this.formbuilder.group({
      "name": ['', Validators.required],
      "email": ['', {
        validators: [Validators.pattern(/^[\w]{1,}[\w.+-]{0,}@[\w-]{1,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/)],
        updateOn: 'change'}],
      "phone": ['', {
        validators: [Validators.pattern(new RegExp("^[0-9 ]{10}$"))],
        updateOn: 'change'}],
      "enquiry": ['', Validators.required]
    }, {validator: contactsValidatorDirective(Validators.required, ['email', 'phone'])} as AbstractControlOptions );
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.docTitle);
  }

  emailCheck(e: Event) {
    this.isEmailChecked = !this.isEmailChecked;
    // clear entered text on radio box untick
    if(!this.isEmailChecked)
      this.contactForm.controls['email'].setValue('');
  }

  phoneCheck(e: Event) {
    this.isPhoneChecked = !this.isPhoneChecked;
    if(!this.isEmailChecked)
      this.contactForm.controls['phone'].setValue('');
  }

  goBackHome() {
    this.contactForm.reset();
    this.isEmailChecked = false;
    this.isPhoneChecked = false;
    this.router.navigateByUrl('');
  }

  goContact() {
    this.isContactMade = false;
    this.contactForm.reset();
    this.isEmailChecked = false;
    this.isPhoneChecked = false;
  }

  disableOnClick(event: any) {
    event.currentTarget.disabled=true;
  }

  /* chain recaptcha observable to get token to use to create contact model passed in
    submitContact() service function and subscribe to the result*/
    onContactSubmit(): Subscription {
      this.blockUI.start("Submitting Enqiry...");
      return this.recaptchaV3Service.execute("Enquiry").pipe(
        mergeMap(token => {
  
          const formValues = this.contactForm.value; // get form values
          // instantiate contact model with form values and recaptcha V3 token
          this.contactModel = new ContactModel( this.formType, token, formValues.name, formValues.enquiry,
            formValues.email, formValues.phone );
      
          // call contact webservice and pass contact model
          return this.mjmService.submitContact(this.contactModel);
        })
      ).subscribe ( (contactResponseObservable) => {
        this.contactResponse = {...contactResponseObservable}; // assign returned Observable to response object
        this.contactForm.reset();                              // reset form input value for cleanup
  
        if( this.contactResponse.contactStatus == "Success" ) {
          this.isContactMade = true;
          this.isContactSuccess = true;
        } else {
          this.isContactMade = true;
          this.isContactSuccess = false;
        }
        this.blockUI.stop();
      });    
    }

}
