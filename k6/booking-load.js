// k6/booking-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import exec from 'k6/execution';

// Load dynamic test configuration output by the seeder script
const testConfig = new SharedArray('testConfig', function () {
    return [JSON.parse(open('./test-config.json'))];
})[0];

const BASE_URL = __ENV.K6_HOST || 'http://localhost:3000';

export const options = {
    scenarios: {
        booking_load: {
            executor: 'shared-iterations',
            vus: 50,
            iterations: 8000,
            maxDuration: '3m',
        },
    },
};

export default function () {
    const idx = exec.scenario.iterationInTest;
    const slotIds = testConfig.slotIds;
    
    // If slots are exhausted, sleep VUs so they don't spin-loop
    if (idx >= slotIds.length) {
        sleep(1);
        return;
    }

    const res = http.post(`${BASE_URL}/api/bookings/optimistic`, JSON.stringify({
        slotId: slotIds[idx],
        inviteeEmail: `user-${idx}@test.com`,
        inviteeName: `Test User ${idx}`,
    }), { 
        headers: { 
            'Content-Type': 'application/json',
            'x-user-id': String(testConfig.hostId), // Uses the actual host ID matching the slots
        } 
    });

    if (res.status !== 201) {
        console.log(`Failed with status ${res.status}: ${res.body}`);
    }

    check(res, { 'status is 201': (r) => r.status === 201 });
}