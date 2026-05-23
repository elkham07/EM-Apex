# EM Apex Platform — Architecture Documentation

## Overview

EM Apex is a microservices-based freelance platform where admins create tasks, workers submit work, and payments are processed automatically through an event-driven pipeline.

## Architecture Diagram

```
                    ┌──────────────────────┐
                    │   Worker App (:8080)  │
                    │   Admin App  (:8081)  │
                    └─────────┬────────────┘
                              │
                    ┌─────────▼────────────┐
                    │   API Gateway (:3000) │
                    │  (Express + Proxy)    │
                    │  /metrics endpoint    │
                    └─────────┬────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌─────▼─────┐         ┌────▼────┐
   │  Auth   │          │   Task    │         │Submission│
   │ Service │          │  Service  │         │ Service  │
   │ (:3001) │          │ (:3002)   │         │ (:3003)  │
   └────┬────┘          └───────────┘         └────┬─────┘
        │                                          │
        │ pub: user.registered           pub: submission.approved
        │                                          │
   ┌────▼──────────────────────────────────────────▼────┐
   │                  NATS Message Broker               │
   │                     (:4222)                        │
   └──┬──────────────┬──────────────────┬───────────────┘
      │              │                  │
 ┌────▼────┐   ┌─────▼─────┐    ┌──────▼──────┐
 │Notif.   │   │  Payment  │    │   Profile   │
 │Service  │   │  Service  │    │   Service   │
 │(:3005)  │   │  (:3004)  │    │   (:3006)   │
 └─────────┘   └─────┬─────┘    └─────────────┘
                      │
               pub: payment.completed
```

## Event Flow

1. **User Registration** → Auth Service publishes `user.registered` → Notification Service sends welcome email
2. **Task Creation** → Admin creates task via Admin App → Task Service stores in PostgreSQL
3. **Work Submission** → Worker submits via Worker App → Submission Service publishes `submission.created`
4. **Approval** → Admin approves → Submission Service publishes `submission.approved`
5. **Payment** → Payment Service processes (Stripe mock) → publishes `payment.completed`
6. **Profile Update** → Profile Service updates XP/Level based on earnings

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JS |
| API Gateway | Express.js, http-proxy-middleware |
| Microservices | Node.js, Express.js |
| Database | PostgreSQL 15 (Sequelize ORM) |
| Message Broker | NATS |
| Payments | Stripe SDK (mocked) |
| Email | Nodemailer (Ethereal mock) |
| Monitoring | Prometheus + Grafana |
| Containerization | Docker, Docker Compose |
| Orchestration | Docker Swarm (ready) |
| IaC | Terraform (AWS) |

## Infrastructure

### Docker Compose Services (12 total)
- `worker-app` — Nginx serving worker dashboard
- `admin-app` — Nginx serving admin dashboard
- `api-gateway` — Express reverse proxy
- `auth-service` — JWT authentication
- `task-service` — Task CRUD
- `submission-service` — Work submissions + NATS events
- `payment-service` — Stripe payments + NATS events
- `profile-service` — XP/Level tracking
- `notification-service` — Email notifications
- `postgres` — PostgreSQL 15
- `nats` — NATS message broker
- `redis` — Redis cache
- `prometheus` — Metrics collection
- `grafana` — Monitoring dashboards

### Terraform Resources
- AWS VPC with public subnet
- Internet Gateway + Route Table
- Security Groups (SSH, HTTP, API, NATS)
- EC2 Instance (Docker Swarm manager with cloud-init)
- RDS PostgreSQL (managed database)
