# Production-Ready ECS Microservice Platform on AWS

## Overview

This project demonstrates the design and implementation of a production-style container platform on AWS using Terraform and ECS Fargate.

The objective was not simply to deploy a container, but to build an operationally sound, secure, observable, and deployment-safe microservice architecture aligned with real-world production practices.

The infrastructure and deployment workflows are fully automated.

---

## Project Structure

```
prod-microservice/
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── infra/
│   ├── backend.tf
│   ├── provider.tf
│   ├── variables.tf
│   ├── vpc.tf
│   ├── security.tf
│   ├── alb.tf
│   ├── ecs.tf
│   ├── iam-github.tf
│   ├── monitoring.tf
│   ├── outputs.tf
│   ├── bootstrap/
│   └── .terraform.lock.hcl
│
├── microservice/
│   ├── src/
│   │   └── server.js
│   ├── Dockerfile
│  
│
├── screenshots/
├── .gitignore
└── README.md
```

## Architecture

### Infrastructure Flow

```
Users (Internet)
        │
        ▼
Application Load Balancer (ALB)
        │
        ▼
ECS Fargate Service
        │
        ▼
Docker Container (Node.js Microservice)
        │
        ├──────────► CloudWatch Logs
        │
        └──────────► CloudWatch Alarms
                          │
                          ▼
                       SNS (Email Alerts)
```


### CI/CD Flow

```
Developer Push (GitHub)
        │
        ▼
GitHub Actions (OIDC Authentication)
        │
        ▼
Amazon ECR (Image Push - Commit SHA Tag)
        │
        ▼
ECS Rolling Deployment (Circuit Breaker Enabled)
```

--- 

## Core Components

- **Terraform** – Infrastructure as Code
- **Amazon ECS Fargate** – Serverless container runtime
- **Application Load Balancer** – Public entry point with health checks
- **Amazon ECR** – Private container registry
- **Amazon CloudWatch** – Logs and monitoring
- **Amazon SNS** – Email alert notifications
- **GitHub Actions (OIDC)** – Secure CI/CD pipeline

---


## Key Features

### Infrastructure as Code

- Fully provisioned using Terraform
- Remote state stored in S3
- State locking via DynamoDB
- Default tagging strategy across resources
- Clean separation between backend and application infrastructure

---

### Container Platform

- Dockerized Node.js microservice
- ECS Fargate (no EC2 management required)
- Public ALB with health check integration
- Secure security group configuration (ALB → ECS only)

---

### Deployment Strategy

- Rolling deployments
- 100% minimum healthy tasks
- 200% maximum deployment capacity
- Deployment circuit breaker enabled
- Automatic rollback on unhealthy deployments
- Zero-downtime updates

---

### Observability & Monitoring

- Structured JSON container logging
- Dedicated CloudWatch log group
- Log retention policy (7 days)
- CPU utilization alarms
- ALB 5xx error alarms
- SNS email notifications

---

### Secure CI/CD (OIDC)

- GitHub Actions pipeline
- OIDC-based authentication (no static AWS credentials)
- Docker image tagged with commit SHA
- Automatic ECS deployment on push to `main`
- No manual intervention required

---

## Deployment Workflow

1. Developer pushes code to `main`
2. GitHub Actions authenticates to AWS via OIDC
3. Docker image is built and tagged with commit SHA
4. Image is pushed to Amazon ECR
5. ECS service triggers rolling deployment
6. Circuit breaker automatically rolls back if deployment fails

---

## Security Practices Applied

- No hardcoded AWS credentials
- IAM least-privilege role for GitHub Actions
- ECS tasks restricted to ALB traffic only
- Avoided use of `latest` tag in production deployment
- State locking enabled to prevent Terraform conflicts
- Backend infrastructure isolated from application stack

---

## Cost Optimization Strategy

- Used minimal Fargate compute size (0.25 vCPU / 0.5GB)
- Avoided NAT Gateway to reduce cost
- Scaled ECS service to zero when inactive
- Log retention limited to control CloudWatch storage costs
- Remote backend incurs minimal operational cost

---

## Lessons Learned

- Terraform backend resources must be isolated from application stacks.
- State locking is critical in collaborative environments.
- Avoid using `latest` in production deployments.
- Deployment circuit breakers reduce operational risk.
- OIDC authentication is superior to static access keys.
- Observability should be built in from the beginning.
- Cost-awareness is part of production engineering.



