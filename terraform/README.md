# EM Apex — Terraform Infrastructure

## Overview

This directory contains Terraform configuration files for provisioning the EM Apex platform on **AWS**.

## Resources Provisioned

| Resource | File | Description |
|----------|------|-------------|
| AWS VPC | `vpc.tf` | Virtual Private Cloud with public subnet, IGW, route table |
| Security Groups | `security_groups.tf` | Firewall rules for SSH, HTTP, NATS, API Gateway |
| EC2 Instance | `ec2.tf` | Swarm manager with Docker + Compose auto-install |
| RDS PostgreSQL | `rds.tf` | Managed database with private-only access |
| Variables | `variables.tf` | Configurable inputs (region, CIDR, instance type) |
| Outputs | `outputs.tf` | Public IP, platform URL, Grafana URL, RDS endpoint |

## Quick Start

```bash
# 1. Initialize Terraform
terraform init

# 2. Review the execution plan
terraform plan

# 3. Apply the infrastructure
terraform apply

# 4. Get the outputs
terraform output
```

## Outputs

After `terraform apply`, you will get:

- **public_ip** — SSH into your server: `ssh ubuntu@<public_ip>`
- **platform_url** — API Gateway: `http://<public_ip>:3000`
- **grafana_url** — Monitoring: `http://<public_ip>:3100`
- **rds_endpoint** — PostgreSQL connection string

## Destroy

```bash
terraform destroy
```
