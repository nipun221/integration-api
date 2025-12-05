pipeline {
    agent any

    environment {
        IMAGE = "nipun221/integration-api"
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
                withCredentials([usernamePassword(credentialsId: 'Dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo "$PASS" | docker login -u "$USER" --password-stdin'
                    sh 'docker push $IMAGE:$TAG'
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                sshagent(credentials: ['azurevm']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no azureuser@20.2.137.224 '
                            mkdir -p ~/app &&
                            cd ~/app &&
                            pkill -f node || true &&
                            rm -rf * &&
                            echo "Copy complete"
                        '
                        
                        scp -o StrictHostKeyChecking=no -r * azureuser@20.2.137.224:~/app
                        
                        ssh -o StrictHostKeyChecking=no azureuser@20.2.137.224 '
                            cd ~/app &&
                            npm install &&
                            nohup npm start &
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
