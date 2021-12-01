export class BookingMobel {
    recaptchaToken: string;
    bookingType: string;
    date: Date;
    name: string;
    email: string;
    phone: number;

    constructor(recaptchaToken: string, bookingType: string, date: Date, name: string, email?: string, phone?: number) {
        this.recaptchaToken = recaptchaToken!;
        this.bookingType = bookingType;
        this.date = date;
        this.name = name;
        this.email = email!;
        this.phone = phone!;
    }
}
