pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins-sa
  containers:
  - name: buildah
    image: quay.io/buildah/stable:latest
    command:
    - sleep
    args:
    - infinity
    securityContext:
      privileged: true
    volumeMounts:
    - name: varlibcontainers
      mountPath: /var/lib/containers
  - name: git
    image: alpine/git:latest
    command:
    - sleep
    args:
    - infinity
  volumes:
  - name: varlibcontainers
    emptyDir: {}
"""
    }
  }

  environment {
    IMAGE = "quay.io/bishoyibrahim21/nodejs-app"
    GIT_REPO = "https://github.com/bishoy-ibrahim/argocd-demo"
  }

  stages {
    stage('Clone') {
      steps {
        git branch: 'master',
            url: 'https://github.com/bishoy-ibrahim/nodejs-app'
      }
    }

    stage('Build Image') {
      steps {
        container('buildah') {
          sh """
            buildah bud -t ${IMAGE}:${BUILD_NUMBER} .
            buildah tag ${IMAGE}:${BUILD_NUMBER} ${IMAGE}:latest
          """
        }
      }
    }

    stage('Push Image') {
      steps {
        container('buildah') {
          withCredentials([usernamePassword(
            credentialsId: 'quay-credentials',
            usernameVariable: 'QUAY_USER',
            passwordVariable: 'QUAY_TOKEN'
          )]) {
            sh """
              buildah login -u ${QUAY_USER} -p ${QUAY_TOKEN} quay.io
              buildah push --tls-verify=false ${IMAGE}:${BUILD_NUMBER} docker://${IMAGE}:${BUILD_NUMBER}
              buildah push --tls-verify=false ${IMAGE}:latest docker://${IMAGE}:latest
            """
          }
        }
      }
    }

    stage('Update Manifest') {
      steps {
        container('git') {
          withCredentials([string(
            credentialsId: 'github-token',
            variable: 'GIT_TOKEN'
          )]) {
            sh """
              cd /workspace
              git clone https://bishoy-ibrahim:${GIT_TOKEN}@github.com/bishoy-ibrahim/argocd-demo.git
              cd argocd-demo
              git config user.email "bishohima7@gmail.com"
              git config user.name "bishoy-ibrahim"
              sed -i "s|image:.*|image: ${IMAGE}:${BUILD_NUMBER}|g" environments/dev/deployment.yaml
              git add .
              git commit -m "update: image tag to ${BUILD_NUMBER}"
              git push origin master
            """
          }
        }
      }
    }
  }

  post {
    success {
      echo "Pipeline succeeded! Image ${IMAGE}:${BUILD_NUMBER} deployed!"
    }
    failure {
      echo "Pipeline failed!"
    }
  }
}
