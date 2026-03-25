output "instance_public_ip" {
  description = "The public IP of the web server"
  value       = aws_instance.web_server.public_ip
}

output "app_url" {
  description = "The URL to access the application"
  value       = "http://${aws_instance.web_server.public_ip}:3000"
}
