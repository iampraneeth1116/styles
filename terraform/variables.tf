variable "database_url" {
  type        = string
  description = "Database Connection URL"
  default     = "postgresql://dummy:dummy@localhost/dummy"
}

variable "jwt_secret" {
  type        = string
  description = "JWT Secret"
  default     = "dummy"
}
