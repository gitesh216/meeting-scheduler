// k6/double-booking.js
import http from "k6/http";
import { check } from "k6";

export const options = {
    vus: 20, // Increase this number (e.g., 50, 100, 500)
    iterations: 20, // Match the VUs so each user fires exactly one request
};

export default function () {
    const res = http.post(
        "http://localhost:3000/api/bookings/optimistic",
        JSON.stringify({
            slotId: __ENV.TARGET_SLOT_ID,
            inviteeEmail: `user-${__VU}@test.com`,
            inviteeName: `Test User ${__VU}`,
        }),
        { headers: { "Content-Type": "application/json", "x-user-id": "9" } },
    );

    check(res, {
        "status is 201 or 409": (r) => r.status === 201 || r.status === 409,
    });
}
