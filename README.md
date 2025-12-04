# 🧪 Integration API – CI Pipeline with Postman, k6 & OWASP ZAP

This project showcases a **complete DevOps testing workflow** for a simple Node.js REST API.
It includes **integration testing**, **performance testing**, and **security scanning**, all automated through a Jenkins CI pipeline running on an Azure Ubuntu VM.

---

## 🚀 What This Project Demonstrates

### ✅ Integration Testing (Postman + Newman)

* API endpoints tested automatically with Newman
* End-to-end flow validated in Jenkins
* Build fails if any assertion fails

### ⚡ Performance Testing (k6)

* Load tests simulate real-world traffic
* Response times, error rates, and thresholds evaluated
* Performance results printed directly in the Jenkins console

### 🔐 Security Testing (OWASP ZAP)

* Baseline security scan against the running API
* Detects missing security headers, CSP issues, information leaks
* HTML reports archived as Jenkins artifacts

---

## 🔧 Tech Stack

* Node.js + Express
* SQLite (lightweight DB)
* Postman + Newman (Integration Tests)
* **k6** (Performance Tests)
* **OWASP ZAP** (Security Scan)
* Jenkins on Azure VM
* GitHub Webhooks (CI Trigger)

---

## ⚙️ Jenkins Pipeline Workflow

1. Webhook triggers Jenkins on every GitHub push
2. Jenkins pulls the latest code
3. Installs dependencies (`npm install`)
4. Starts the API (`npm start`)
5. Runs **Postman/Newman integration tests**
6. Runs **k6 performance tests**
7. Runs **OWASP ZAP baseline security scan**
8. Archives reports and stops the API

All three test stages must pass for the pipeline to succeed.

---

## 🧪 Integration Tests (Postman)

The Postman collection verifies:

* `GET /health` → API is live
* `POST /items` → Item is created with `id`, `name`, `price`
* `GET /items` → Returns an array with at least one item
* `GET /items/:id` → Returns the correct item created earlier

These tests ensure the API behaves correctly across dependent operations.

---

## ⚡ Performance Tests (k6)

The `k6/perf-test.js` script:

* Sends concurrent requests to the API
* Measures latency, throughput, and failure rate
* Enforces thresholds (e.g., `p95 < 500ms`, error rate < 1%)

Performance results are fully visible in Jenkins logs.

---

## 🔐 Security Scan (OWASP ZAP)

The pipeline runs:

```bash
zaproxy/zap-stable zap-baseline.py -t http://localhost:3000 -r zap_report.html
```

OWASP ZAP identifies:

* Missing security headers
* CSP directive issues
* Cache-control problems
* X-Powered-By leakage
* Other common vulnerabilities

The HTML report appears as a Jenkins artifact under `zap_reports/`.

---

## ✔️ Achievements

* Fully automated CI pipeline with **integration**, **performance**, and **security** testing
* All testing stages run inside Jenkins on every commit
* GitHub → Jenkins webhook works seamlessly
* OWASP ZAP reports generated successfully
* k6 load testing integrated into the workflow
* API tested end-to-end in a real CI environment


