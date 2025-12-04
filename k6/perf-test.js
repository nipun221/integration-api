import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },   // ramp up to 5 VUs
    { duration: '20s', target: 10 },  // hold at 10 VUs
    { duration: '10s', target: 0 }    // ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],       // <1% requests should fail
    http_req_duration: ['p(95)<500']      // 95% of requests < 500ms
  }
};

export default function () {
  // Hit GET /items
  const res = http.get('http://localhost:3000/items');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  // Optional: small sleep to simulate user think time
  sleep(1);
}
