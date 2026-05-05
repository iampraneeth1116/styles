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
