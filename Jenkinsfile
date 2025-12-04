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

        stage('Security Scan (OWASP ZAP)') {
            steps {
                sh '''
                    mkdir -p zap_reports

                    docker run --rm --network=host \
                    -v $PWD/zap_reports:/zap/wrk \
                    zaproxy/zap-stable \
                    zap-baseline.py \
                    -t http://localhost:3000 \
                    -r zap_report.html || true
                '''
            }
        }


    }

    post {
        always {
            sh 'pkill -f "node app.js" || true'

            script {
                if (fileExists('zap_reports/zap_report.html')) {
                    archiveArtifacts artifacts: 'zap_reports/zap_report.html', fingerprint: true
                } else {
                    echo 'No ZAP report generated, skipping artifact archiving'
                }
            }
        }
    }
}
