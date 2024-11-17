"use server"

import { api } from "@cs-magic/common/api/api.js"

import { BookingSlot } from "../types"

export async function getBookingData(date: string, gym: string): Promise<BookingSlot[]> {
  const data = await api.get(`https://api.cs-magic.cn/badminton?date=${date}&gym=${gym}`)
  const result = data.data.map((item: any) => ({
    start_time: item.start_time,
    end_time: item.end_time,
    place: gym,
    available_count: item.available_count,
  }))
  console.log("API called for", gym, "on", date)
  return result
}
