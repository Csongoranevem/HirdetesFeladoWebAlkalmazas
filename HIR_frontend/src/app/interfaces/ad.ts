export interface AdImage {
    id?: string;
    advert_id: string;
    url: string;
    alt: string;
}

export interface Ad {
    id?: string;
    user_id: string;
    name: string;
    description: string;
    price: number;
    city_id: string;
    product_id: string;
    payment_method: string;
    category_id: string;
    status: "active" | "inactive";
    date_of_upload?: Date;
    images?: AdImage[];
    rating?: number;
    createdAt?: Date;
}