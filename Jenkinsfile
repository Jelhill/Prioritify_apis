pipeline {
    agent any

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    ls -la
                    node --version
                    npm --version
                    npm ci
                    ls -la
                '''
            }
        }

        stage('Test') {
            agent {
                docker {
                    image 'node:alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    ls -la
                    npm run test
                '''
            }
        }
    }
}
