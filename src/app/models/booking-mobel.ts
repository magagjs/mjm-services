export class BookingMobel {
    formType: string;
    recaptchaToken: string;
    bookingType: string;
    date: Date;
    name: string;
    email: string;
    phone: number;

    constructor(formType: string, recaptchaToken: string, bookingType: string, date: Date, name: string, email?: string, phone?: number) {
        this.formType = formType;
        this.recaptchaToken = recaptchaToken!;
        this.bookingType = bookingType;
        this.date = date;
        this.name = name;
        this.email = email!;
        this.phone = phone!;
    }
}
