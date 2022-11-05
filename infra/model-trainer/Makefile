all: dotfiles/.ssh/id_rsa images

dotfiles/.ssh/id_rsa:
	mkdir -p dotfiles/.ssh
	ssh-keygen -t rsa -C "damian@swistowski.org" -f dotfiles/.ssh/id_rsa
images:
	make -C images

.PHONY: images
