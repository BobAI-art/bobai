variable "region" {
  type    = string
  default = "eu-west-2"
}


variable "root_volume_size_gb" {
  type = number
  default = 150
}

locals { timestamp = regex_replace(timestamp(), "[- TZ:]", "") }

source "amazon-ebs" "trainer" {
  ami_name      = "model-trainer-${local.timestamp}"
  instance_type = "g5.xlarge"  # change
  #instance_type = "t2.micro"  # change
  region        = var.region

  source_ami_filter {
    filters = {
      name                = "Deep Learning AMI GPU TensorFlow*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["898082745236"]
  }
  ssh_username = "ec2-user"

  launch_block_device_mappings {
    device_name = "/dev/sda1"
    volume_size = "${var.root_volume_size_gb}"
    volume_type = "gp3"
    iops = 3000
    throughput = 125
    delete_on_termination = true
  }
}

# a build block invokes sources and runs provisioning steps on them.
build {
  sources = ["source.amazon-ebs.trainer"]

  provisioner "file" {
    source      = "../tf-packer.pub"
    destination = "/tmp/tf-packer.pub"
  }
  provisioner "file" {
    source      = "../dotfiles/.ssh/id_rsa"
    destination = "/tmp/id_rsa"
  }

  provisioner "file" {
    source      = "../dotfiles/.ssh/id_rsa.pub"
    destination = "/tmp/id_rsa.pub"
  }


  provisioner "shell" {
    script = "../scripts/setup.sh"
  }
}
