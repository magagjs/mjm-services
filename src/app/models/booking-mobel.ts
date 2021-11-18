export class BookingMobel {
    bookingType: string;
    date: Date;
    name: string;
    email: string;
    phone: number;

    constructor(bookingType: string, date: Date, name: string, email?: string, phone?: number) {
        this.bookingType = bookingType;
        this.date = date;
        this.name = name;
        this.email = email!;
        this.phone = phone!;
    }
}
