resource "aws_db_subnet_group" "rds_subnet" {
  name       = "${var.project_name}-rds-subnet-group"
  subnet_ids = [aws_subnet.public.id]

  tags = {
    Name        = "${var.project_name}-rds-subnet-group"
    Environment = var.environment
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-rds-sg"
  description = "Allow PostgreSQL access from Swarm nodes"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from Swarm"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.swarm_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-rds-sg"
    Environment = var.environment
  }
}

resource "aws_db_instance" "emapex_db" {
  identifier           = "${var.project_name}-db"
  engine               = "postgres"
  engine_version       = "15"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  storage_type         = "gp3"
  db_name              = "emapex"
  username             = "admin"
  password             = "emapex_prod_password_2024"
  publicly_accessible  = false
  skip_final_snapshot  = true
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet.name

  tags = {
    Name        = "${var.project_name}-postgres"
    Environment = var.environment
  }
}
