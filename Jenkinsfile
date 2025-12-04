pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Start API (Staging)') {
            steps {
                sh 'nohup npm start &'
                sh 'sleep 5'
            }
        }

        stage('Run Integration Tests') {
            steps {
                sh 'npx newman run postman/collection.json -e postman/env.json'
            }
        }

        stage('Performance Test (k6)') {
            steps {
                // Run k6 load test against the same API
                sh 'k6 run k6/perf-test.js'
            }
        }
    }

    post {
        always {
            sh 'pkill -f node app.js || true'
        }
    }
}
