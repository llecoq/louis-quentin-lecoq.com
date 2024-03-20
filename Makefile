clean:
	npm run benchmark:clean-data 
	npm run benchmark:clean-profiles
	@echo "Cleaning temporary benchmarks files..."

benchmark:
	npm run benchmark:all
	npm run profiling:all
	@echo "Running benchmarks..."

clean_all: clean
	rm -rf node_modules 
	rm -rf src/rs/pkg/
	rm -rf src/rs/target/
	@echo "Cleaning all files, including compiled files..."

.PHONY: clean benchmark clean_all
