import { Request, Response } from "express";
import { ListHostBookingsQuery } from "../dtos/booking.dto.js";
import {
    createBookingPessimistically,
    listHostBookings as listHostBookingsService,
    cancelBooking as removeBookingService
} from "../services/booking.service.js";
import { sendSuccess } from "../utils/api-response.js";

export async function create(req: Request, res: Response) {
    const result = await createBookingPessimistically(req.userId, req.body);
    sendSuccess(res, result, 201, "Booking created successfully");
}

export async function list(req: Request, res: Response) {
    const query: ListHostBookingsQuery = req.query;
    const result = await listHostBookingsService(req.userId, query);
    sendSuccess(res, result);
}


export async function remove(req: Request, res: Response) {
    const { bookingId: id } = req.params;
    const result = await removeBookingService(req.userId, Number(id));
    sendSuccess(res, result, 200, "Booking deleted successfully");
}