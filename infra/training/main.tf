data "aws_ami" "tensorflow" {
  most_recent = true

  filter {
    name   = "name"
    values = ["Deep Learning AMI GPU TensorFlow*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["898082745236"] # Amazon
}

resource "aws_key_pair" "deployer" {
  key_name   = "deployer"
  public_key = var.deployer_public_key
}

resource "aws_subnet" "subnet_public" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = var.cidr_subnet
}

resource "aws_vpc" "vpc" {
  cidr_block           = var.cidr_vpc
  enable_dns_support   = true
  enable_dns_hostnames = true
}

resource "aws_security_group" "sg_22" {
  name   = "sg_22"
  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
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

resource "aws_instance" "training" {
  ami           = data.aws_ami.tensorflow.id
  instance_type = "t2.micro" # g5.xlarge

  subnet_id              = aws_subnet.subnet_public.id
  vpc_security_group_ids = [aws_security_group.sg_22.id]

  key_name = "deployer"
  tags = {
    Name = "training"
  }
}

output "public_ip" {
  value = aws_instance.training.public_ip
}
