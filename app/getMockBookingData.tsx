'use server';

import { api } from "@cs-magic/common/dist/api/api.js";
import { BookingSlot } from "../types";

export async function getMockBookingData(date: Date, gym: string): Promise<BookingSlot[]> {
    const data = await api.get(
        `https://api.cs-magic.cn/badminton?date=${date.toISOString().split("T")[0]}&gym=${gym}`
    );
    const result = data.data.map((item: any) => ({ ...item, place: gym }));
    console.log("API called for", gym, "on", date.toISOString().split("T")[0]);
    return result;
}
