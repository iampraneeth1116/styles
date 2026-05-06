terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket  = "shopsmart-tfstate-praneeth1116"
    key     = "state/terraform.tfstate"
    encrypt = true
    # Region is passed via GitHub Actions dynamically
  }
}

provider "aws" {
  # The region will be provided via the AWS_REGION environment variable in GitHub Actions
}

# 1. Unique bucket name (using random_id to ensure uniqueness across AWS)
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "rubric_bucket" {
  bucket = "devops-rubric-bucket-${random_id.bucket_suffix.hex}"
}

# 2. Versioning enabled
resource "aws_s3_bucket_versioning" "rubric_bucket_versioning" {
  bucket = aws_s3_bucket.rubric_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

# 3. Encryption enabled
resource "aws_s3_bucket_server_side_encryption_configuration" "rubric_bucket_encryption" {
  bucket = aws_s3_bucket.rubric_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# 4. Public access blocked
resource "aws_s3_bucket_public_access_block" "rubric_bucket_public_access_block" {
  bucket = aws_s3_bucket.rubric_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 5. ECR Repository for Backend Image
resource "aws_ecr_repository" "shopsmart_backend" {
  name                 = "shopsmart-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# 6. ECR Repository for Frontend Image
resource "aws_ecr_repository" "shopsmart_frontend" {
  name                 = "shopsmart-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# 7. ECS Cluster
resource "aws_ecs_cluster" "shopsmart_cluster" {
  name = "shopsmart-cluster"
}

# --- 8. Networking for Fargate ---
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_security_group" "ecs_sg" {
  name        = "shopsmart-ecs-tasks-sg"
  description = "Allow inbound traffic on ports 3000 and 4000"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 4000
    to_port     = 4000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- 9. Task Definitions ---
resource "aws_ecs_task_definition" "backend_task" {
  family                   = "shopsmart-backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = "arn:aws:iam::065624034072:role/LabRole"
  task_role_arn            = "arn:aws:iam::065624034072:role/LabRole"
  container_definitions = jsonencode([
    {
      name      = "shopsmart-backend-container"
      image     = "nginx:latest" # Replaced by GitHub Actions
      essential = true
      portMappings = [
        {
          containerPort = 4000
          hostPort      = 4000
        }
      ]
      environment = [
        { name = "DATABASE_URL", value = var.database_url },
        { name = "JWT_SECRET", value = var.jwt_secret },
        { name = "PORT", value = "4000" }
      ]
    }
  ])
}

resource "aws_ecs_task_definition" "frontend_task" {
  family                   = "shopsmart-frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = "arn:aws:iam::065624034072:role/LabRole"
  task_role_arn            = "arn:aws:iam::065624034072:role/LabRole"
  container_definitions = jsonencode([
    {
      name      = "shopsmart-frontend-container"
      image     = "nginx:latest" # Replaced by GitHub Actions
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
      environment = [
        { name = "PORT", value = "3000" }
      ]
    }
  ])
}

# --- 10. ECS Services ---
resource "aws_ecs_service" "backend_service" {
  name            = "shopsmart-backend-service"
  cluster         = aws_ecs_cluster.shopsmart_cluster.id
  task_definition = aws_ecs_task_definition.backend_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }
}

resource "aws_ecs_service" "frontend_service" {
  name            = "shopsmart-frontend-service"
  cluster         = aws_ecs_cluster.shopsmart_cluster.id
  task_definition = aws_ecs_task_definition.frontend_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }
}
