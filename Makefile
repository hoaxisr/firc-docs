.PHONY: dev build check deploy clean

dev:
	hugo server -D --bind 0.0.0.0

build:
	hugo --minify --cleanDestinationDir

check:
	scripts/check.sh

deploy: check
	scripts/deploy.sh

clean:
	rm -rf public resources .hugo_build.lock
