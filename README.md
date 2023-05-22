This is a Dockerized [Next.js](https://nextjs.org/) news app client

## Getting started
### Prerequisites:

- Docker Engine (v19.03.0+)
- Docker Compose

You can either: 
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop) (includes both Docker Engine and Docker Compose)

OR

- Install [Docker Engine](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) separately.

- Start the news api first before starting this container

## Starting the container

1. Clone the repository 

2. Open your terminal inside the project directory

3. Install all npm packages included in package.json
    ```
    $ npm install
    ```

4. To build the docker image, execute the following comand
    ```
    $ COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build
    ```

5. Execute the following command to bring the container up
    ```
    $ docker-compose up -d
    ```

6. To access the application, visit http://localhost:3000

## Stopping the containers

1. To bring the container down.

    ```
    $ docker-compose down
    ```


