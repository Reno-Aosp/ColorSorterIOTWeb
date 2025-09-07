pipeline {
    agent any
    
    tools {
        maven 'Maven 3.9.0'
        nodejs 'NodeJS 18.17.0'
    }
    
    environment {
        BACKEND_DIR = 'demo'
        FRONTEND_DIR = 'demo/src/main/resources/static/FrontEnd'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                dir(BACKEND_DIR) {
                    echo 'Building Spring Boot backend...'
                    sh 'mvn clean compile'
                }
            }
        }
        
        stage('Test Backend') {
            steps {
                dir(BACKEND_DIR) {
                    echo 'Running backend tests...'
                    sh 'mvn test'
                }
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    echo 'Building React frontend...'
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Package Application') {
            steps {
                dir(BACKEND_DIR) {
                    echo 'Packaging Spring Boot application...'
                    sh 'mvn package -DskipTests'
                }
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                echo 'Archiving build artifacts...'
                archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
                archiveArtifacts artifacts: '**/target/*.war', fingerprint: true
            }
        }
        
        stage('Deploy (Optional)') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying application...'
                // Add your deployment commands here
                // sh 'java -jar target/demo-0.0.1-SNAPSHOT.jar'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed.'
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}