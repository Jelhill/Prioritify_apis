pipeline {
    agent any

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:alpine'
                }
            }
            steps {
                sh 'echo "Hello Jenkins World!"'
            }
        }
    }
}
