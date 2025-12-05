pipeline {
    agent any

    environment {
        IMAGE = "nipun2221/integration-api"
        TAG = "staging"
        STAGING_HOST = "20.2.90.173"   
        STAGING_USER = "azureuser"
    }

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

        stage('Start API for tests') {
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

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE:$TAG .'
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                withCredentials([usernamePassword(credentialsId: 'Dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                    echo "$PASS" | docker login -u "$USER" --password-stdin

                    # Retag local image into logged-in user's namespace and push
                    docker tag nipun2221/integration-api:staging ${USER}/integration-api:staging || true
                    docker push ${USER}/integration-api:staging
                    '''
                }
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                sshagent(['azurevm']) {
                sh """
                    ssh -o StrictHostKeyChecking=no azureuser@20.2.137.224 '
                    docker pull nipun2221/integration-api:staging &&
                    docker stop api || true &&
                    docker rm api || true &&
                    docker run -d --name api -p 3000:3000 nipun2221/integration-api:staging
                    '
                """
                }
            }
        }


        stage('Verify Deployment') {
            steps {
                sh "curl -I http://$STAGING_HOST:3000/health"
            }
        }
    }

    post {
        always {
            sh 'pkill -f node || true'
        }
    }
}
