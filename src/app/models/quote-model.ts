export class QuoteModel {
    formType: string;
    recaptchaToken: string;
    name: string;
    email: string;
    phone: number;
    requirements: string;

    constructor(formType: string, recaptchaToken: string, name: string, requirements: string, email?: string, phone?: number) {
        this.formType = formType;
        this.recaptchaToken = recaptchaToken!;
        this.name = name;
        this.email = email!;
        this.phone = phone!;
        this.requirements = requirements;
    }
}
