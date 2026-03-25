terraform { 
  cloud { 
    
    organization = "Noy_organization" 

    workspaces { 
      name = "apples-app" 
    } 
  } 

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}