export class ContactModel {
    formType: string;
    recaptchaToken: string;
    name: string;
    email: string;
    phone: number;
    enquiry: string;

    constructor(formType: string, recaptchaToken: string, name: string, enquiry: string, email?: string, phone?: number) {
        this.formType = formType;
        this.recaptchaToken = recaptchaToken!;
        this.name = name;
        this.enquiry = enquiry;
        this.email = email!;
        this.phone = phone!;
    }
}
