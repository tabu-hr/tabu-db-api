docker build -t tabu-db-api . &&
docker run --name tabu-db-api -p 3001:3001 tabu-db-api
