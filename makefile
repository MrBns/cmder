compile:
	deno compile ./main.ts
	rm -rf ./build
	mkdir ./build
	mv cmder ./build/
