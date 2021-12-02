import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { mergeMap } from 'rxjs/operators';

import { contactsValidatorDirective } from '../../directives/contacts-validator';
import { QuoteResponse } from '../../models/quote-response';
import { QuoteModel } from '../../models/quote-model';
import { MjmCentreService } from '../../services/mjm-centre.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mjm-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})
export class QuoteComponent implements OnInit {

  // wire up BlockUI instance
  @BlockUI() blockUI!: NgBlockUI;

  quoteForm!: FormGroup;
  isEmailChecked: boolean = false;
  isPhoneChecked: boolean = false;
  isQuoteMade: boolean = false;
  isQuoteSuccess: boolean = false;
  quoteModel!: QuoteModel;
  quoteResponse!: QuoteResponse;
  formType: string = "quote";

  constructor( private formbuilder: FormBuilder, 
               private mjmService: MjmCentreService,
               private router: Router,
               private recaptchaV3Service: ReCaptchaV3Service) { 

    this.initForm();
  }

  private initForm() {
    this.quoteForm = this.formbuilder.group({
      "name": ['', Validators.required],
      "email": ['', {
        validators: [Validators.pattern(/^[\w]{1,}[\w.+-]{0,}@[\w-]{1,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/)],
        updateOn: 'change'}],
      "phone": ['', {
        validators: [Validators.pattern(new RegExp("^[0-9 ]{10}$"))],
        updateOn: 'change'}],
      "requirements": ['', Validators.required]
    }, {validator: contactsValidatorDirective(Validators.required, ['email', 'phone'])} as AbstractControlOptions );
  }

  ngOnInit(): void {
  }

  emailCheck(e: Event) {
    this.isEmailChecked = !this.isEmailChecked;
    // clear entered text on radio box untick
    if(!this.isEmailChecked)
      this.quoteForm.controls['email'].setValue('');
  }

  phoneCheck(e: Event) {
    this.isPhoneChecked = !this.isPhoneChecked;
    if(!this.isEmailChecked)
      this.quoteForm.controls['phone'].setValue('');
  }

  goBackHome() {
    this.quoteForm.reset();
    this.isEmailChecked = false;
    this.isPhoneChecked = false;
    this.router.navigateByUrl('');
  }

  goQuote() {
    this.isQuoteMade = false;
    this.quoteForm.reset();
    this.isEmailChecked = false;
    this.isPhoneChecked = false;
  }

  disableOnClick(event: any) {
    event.currentTarget.disabled=true;
  }

  /* chain recaptcha observable to get token to use to create quote model passed in
    submitQuote() service function and subscribe to the result*/
  onQuoteSubmit(): Subscription {
    this.blockUI.start("Submitting Quote...");
    return this.recaptchaV3Service.execute("Quote").pipe(
      mergeMap(token => {

        const formValues = this.quoteForm.value; // get form values
        // instantiate quote model with form values and recaptcha V3 token
        this.quoteModel = new QuoteModel( this.formType, token, formValues.name, formValues.requirements,
          formValues.email, formValues.phone );
    
        // call quote webservice and pass quote model
        return this.mjmService.submitQuote(this.quoteModel);
      })
    ).subscribe ( (quoteResponseObservable) => {
      this.quoteResponse = {...quoteResponseObservable}; // assign returned Observable to response object
      this.quoteForm.reset();                            // reset form input value for cleanup

      if( this.quoteResponse.quoteStatus == "Success" ) {
        this.isQuoteMade = true;
        this.isQuoteSuccess = true;
      } else {
        this.isQuoteMade = true;
        this.isQuoteSuccess = false;
      }
      this.blockUI.stop();
    });    
  }
  
}
