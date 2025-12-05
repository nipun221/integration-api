# 🧪 Integration API – CI/CD Pipeline with Postman, k6, OWASP ZAP & Docker Deployment

This project showcases a **complete DevOps testing and deployment workflow** for a simple Node.js REST API.
It includes **integration testing**, **performance testing**, **security scanning**, **Docker image packaging**, and **automated deployment to a staging VM**, all executed through a Jenkins pipeline running on Azure.

---

# 🚀 What This Project Demonstrates

### ✅ Integration Testing (Postman + Newman)

* Automated API endpoint validation
* End-to-end flow testing
* Build fails automatically if any test fails

### ⚡ Performance Testing (k6)

* Simulates real-world concurrent traffic
* Evaluates latency, throughput, and error thresholds
* k6 results fully printed in Jenkins logs

### 🔐 Security Testing (OWASP ZAP)

* Automated baseline scan against the live API
* Detects missing headers, CSP issues, leaks, and weak configurations
* HTML report archived in Jenkins

### 🚢 Continuous Deployment (Docker + SSH to Azure VM)

* Build Docker image
* Push to Docker Hub
* SSH into staging VM
* Deploy latest container automatically
* Verify service availability on staging

---

# 🔧 Tech Stack

| Component           | Tool              |
| ------------------- | ----------------- |
| Application         | Node.js + Express |
| Database            | SQLite            |
| Integration Tests   | Postman + Newman  |
| Performance Tests   | k6                |
| Security Scan       | OWASP ZAP         |
| CI/CD Orchestration | Jenkins           |
| Containerization    | Docker            |
| Deployment          | Azure VM (Linux)  |
| CI Trigger          | GitHub Webhooks   |

---

# ⚙️ Jenkins Pipeline Workflow

### **1️⃣ Trigger**

* GitHub webhook triggers Jenkins on each push

### **2️⃣ Build Phase**

* Clone repository
* Install Node dependencies
* Run ESLint (optional)

### **3️⃣ Testing Phase**

#### 🔹 **Integration Tests (Newman)**

* API started locally inside Jenkins agent
* Postman tests executed
* API stopped after tests

#### 🔹 **Performance Tests (k6)**

* k6 script runs against `http://localhost:3000`
* Thresholds determine success/failure

#### 🔹 **Security Scan (OWASP ZAP)**

* `zap-baseline.py` scans live API
* Reports saved into `zap_reports/` and archived

### **4️⃣ Docker Packaging**

* Build Docker image
* Tag & push to DockerHub

### **5️⃣ Deployment Phase**

Executed using Jenkins SSH credential (`azurevm`):

1. SSH into staging VM
2. Pull latest image
3. Stop and remove old container
4. Run container with port mapping
5. Ensure container restarts on system reboot

### **6️⃣ Verification**

Jenkins checks:

```
curl http://<staging-ip>:3000/health
```

If the API responds with `200 OK`, deployment marked successful.

---

# 🧪 Integration Testing (Postman)

Endpoints validated:

| Endpoint         | Purpose             |
| ---------------- | ------------------- |
| `GET /health`    | API availability    |
| `POST /items`    | Create new item     |
| `GET /items`     | Fetch all items     |
| `GET /items/:id` | Fetch specific item |

Assertions check:

* Status codes
* Response structure
* Field types
* Consistency across requests

---

# ⚡ Performance Tests (k6)

The script (`k6/perf-test.js`) runs:

* 50 virtual users
* 30s duration
* Threshold checks like:

  ```
  http_req_failed < 1%
  http_req_duration p(95) < 500ms
  ```

Results include:

* Avg / min / max latency
* RPS
* Error rate

All visible in Jenkins console output.

---

# 🔐 Security Scan (OWASP ZAP)

Command executed:

```bash
zaproxy/zap-stable zap-baseline.py -t http://localhost:3000 -r zap_report.html
```

Findings include:

* Missing `X-Frame-Options`
* Missing `Permissions-Policy`
* Missing `CSP`
* Information leakage (X-Powered-By header)
* Cache-control issues

HTML report archived at:

```
zap_reports/zap_report.html
```

---

# 🚀 Continuous Deployment (CD)

After tests pass:

1. Docker image is built
2. Pushed to Docker Hub (`nipun2221/integration-api:staging`)
3. Jenkins SSHes into staging VM
4. Runs:

```bash
docker pull nipun2221/integration-api:staging
docker stop api || true
docker rm api || true
docker run -d --name api -p 3000:3000 --restart unless-stopped nipun2221/integration-api:staging
```

5. Jenkins verifies with `curl`
6. Application becomes available at:

```
http://<staging-ip>:3000/health
```

---

# ✔️ Achievements

### 🎯 Full CI + CD Pipeline Working

* ✔️ GitHub → Jenkins webhook
* ✔️ Integration tests automated
* ✔️ k6 performance tests integrated
* ✔️ OWASP ZAP security scan automated
* ✔️ Docker image built & pushed
* ✔️ Automatic deployment to staging VM
* ✔️ Live API verified after deployment

This setup represents a complete **DevOps testing + deployment lifecycle**, suitable for real-world CI/CD environments.

---

