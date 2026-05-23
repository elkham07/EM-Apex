variable "aws_region" {
  type        = string
  description = "The AWS Region to deploy the EM Apex Platform in"
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Name tag prefix for resources"
  default     = "em-apex"
}

variable "environment" {
  type        = string
  description = "Deployment environment name"
  default     = "production"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the main VPC"
  default     = "10.0.0.0/16"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance size for the Swarm Manager node"
  default     = "t3.medium"
}
