output "vpc_id" {
  value       = aws_vpc.main.id
  description = "ID of the VPC created"
}

output "public_ip" {
  value       = aws_instance.swarm_manager.public_ip
  description = "Public IP address of the Swarm manager server"
}

output "platform_url" {
  value       = "http://${aws_instance.swarm_manager.public_ip}:3000"
  description = "Platform API Gateway Entry Point"
}

output "grafana_url" {
  value       = "http://${aws_instance.swarm_manager.public_ip}:3100"
  description = "Grafana Monitoring Dashboard"
}

output "rds_endpoint" {
  value       = aws_db_instance.emapex_db.endpoint
  description = "PostgreSQL RDS connection endpoint"
}
