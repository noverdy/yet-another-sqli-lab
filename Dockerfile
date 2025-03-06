FROM golang:1.24 AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o ./main .
RUN go build -o ./cmdline ./cmd


FROM oven/bun:latest AS frontend-builder

WORKDIR /frontend
COPY ./frontend .
RUN bun install
RUN bun run ./build.ts --minify --target=browser --source-map=none --public-path=/


FROM golang:1.24

WORKDIR /app
COPY --from=builder /app ./
COPY --from=frontend-builder /frontend/dist ./frontend/dist
EXPOSE 8080

CMD ["./.docker/run.sh"]
