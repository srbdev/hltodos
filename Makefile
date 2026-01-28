.PHONY: build image clean

build: image
	docker run --rm -u $$(id -u):$$(id -g) -v $$(pwd):/app hltodos-builder

image:
	docker build -t hltodos-builder .

clean:
	rm -rf node_modules out *.vsix
