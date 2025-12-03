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
                // Run API in background for tests
                sh 'nohup npm start &'
                // Give it a few seconds to boot
                sh 'sleep 5'
            }
        }

        stage('Run Integration Tests') {
            steps {
                // Ensure newman is installed globally or as devDependency
                sh 'npx newman run postman/collection.json -e postman/env.json'
            }
        }
    }

    post {
        always {
            // Try to kill Node app if it's still running
            sh 'pkill -f "node app.js" || true'
        }
    }
}
