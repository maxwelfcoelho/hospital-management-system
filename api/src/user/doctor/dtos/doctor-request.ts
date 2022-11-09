export class DoctorRequest {
    name: string;
    email: string;
    password: string;
    phone: string;

    constructor(name: string, email: string, password: string, phone: string) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }
}
