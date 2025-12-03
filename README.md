# 🧪 Integration API – Jenkins CI + Postman Integration Tests

This project demonstrates a complete integration testing workflow using a simple Node.js REST API, Postman test scripts, Newman CLI, and a Jenkins CI pipeline running on an Azure Ubuntu VM.

## 🚀 What This Project Does

* Builds a small **Items API** using Node.js + SQLite
* Creates a **Postman collection** with integration tests
* Uses **Newman** to run tests automatically in CI
* Jenkins pipeline is triggered **automatically by GitHub webhooks**
* API is started on the VM, tested end-to-end, and then stopped

## 🔧 Tech Stack

* Node.js + Express
* SQLite
* Postman + Newman
* Jenkins on Azure VM
* GitHub Webhooks

## ⚙️ Pipeline Workflow (Jenkins)

1. Webhook triggers Jenkins on every GitHub push
2. Jenkins checks out the repository
3. Installs Node dependencies (`npm install`)
4. Starts the API (`npm start`)
5. Runs Postman tests via Newman
6. Fails if any assertion fails
7. Stops the API process

## 🧪 Integration Tests

The Postman collection tests:

* `GET /health` → service is running
* `POST /items` → creates an item and returns `id`, `name`, `price`
* `GET /items` → returns an array with at least one item
* `GET /items/:id` → returns the correct item

All tests are executed in CI and must pass for the build to succeed.

## ✔️ Achievement

* Jenkins pipeline successfully runs integration tests
* Build is triggered automatically from GitHub
* Newman shows **0 failed assertions**
* Pipeline completes with **SUCCESS**

This setup demonstrates a real CI workflow with automated integration testing for APIs.


