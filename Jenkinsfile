pipeline {
    agent any
    
    environment {
        SONARQUBE = 'SonarQube'               // Jenkins SonarQube server name
        DOCKER_IMAGE = 'front:latest'         // Docker image tag to build and push
        NEXUS_REGISTRY = 'localhost:5000'    // Nexus Docker registry URL
        NEXUS_CREDENTIALS_ID = 'nexus-creds' // Jenkins credentials ID for Nexus login (username/password)
        
        // Tools
        SONAR_SCANNER_HOME = tool 'sonar-scanner'
    }
     tools {
        nodejs 'NodeJS' // Name of the NodeJS installation configured in Jenkins global tools
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/safehaddar1/Safe-Haddar-Front-Repo.git'
            }
        }
        
        stage('Clean') {
            steps {
                sh 'rm -rf dist || true'
                sh 'rm -rf node_modules || true'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install --force'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build -- --configuration production'
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${SONARQUBE}") {
                    sh """
                        ${env.SONAR_SCANNER} \
                        -Dsonar.projectKey=frontend-kaddem \
                        -Dsonar.sources=src \
                        -Dsonar.host.url=http://localhost:9000 \
                        -Dsonar.login=${env.SONAR_AUTH_TOKEN} \
                        -Dsonar.typescript.lcov.reportPaths=coverage/lcov.info \
                        -Dsonar.testExecutionReportPaths=test-report.xml
                    """
                }
            }
        }
        stage('Deploy to Nexus') {
            steps {
                sh 'zip -r frontend-dist.zip dist/'
                nexusArtifactUploader(
                    nexusVersion: 'nexus3',
                    protocol: 'http',
                    nexusUrl: "${NEXUS_REGISTRY}",
                    groupId: 'com.kaddem',
                    version: "${env.BUILD_ID}",
                    repository: 'kaddem-frontend',
                    credentialsId: "${NEXUS_CREDENTIALS_ID}",
                    artifacts: [
                        [artifactId: 'frontend',
                        classifier: 'dist',
                        file: 'frontend-dist.zip',
                        type: 'zip']
                    ]
                )
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${NEXUS_REGISTRY}/${DOCKER_IMAGE}")
                }
            }
        }
        
        stage('Push Docker Image to Nexus') {
            steps {
                script {
                    docker.withRegistry("http://${NEXUS_REGISTRY}", "${NEXUS_CREDENTIALS_ID}") {
                        dockerImage.push()
                    }
                }
            }
        }
    }
    
    // post {
    //     always {
    //         cleanWs()
    //     }
    //     failure {
    //         emailext body: "Build ${currentBuild.fullDisplayName} failed.\n\nCheck console output at ${env.BUILD_URL}",
    //                 subject: "FAILED: ${currentBuild.fullDisplayName}",
    //                 to: 'professor@email.com'
    //     }
    //     success {
    //         emailext body: "Build ${currentBuild.fullDisplayName} succeeded!\n\nDetails: ${env.BUILD_URL}",
    //                 subject: "SUCCESS: ${currentBuild.fullDisplayName}",
    //                 to: 'professor@email.com'
    //     }
    // }
}