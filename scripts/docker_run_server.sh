docker build -t tabu-db-api ../ &&
docker run --name tabu-db-api -p 3000:3000 tabu-db-api
