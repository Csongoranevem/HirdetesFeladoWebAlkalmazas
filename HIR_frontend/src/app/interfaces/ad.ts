export interface Ad {
    id: string;
    user_id: string;
    name: string;
    description: string;
    price: number;
    city_id: string;
    product_id: string;
    payment_method: "Készpénz" | "Banki átutalás" | "Csereajánlat";
    category_id: string;
    status: "active" | "inactive";
    date_of_upload: Date;
}