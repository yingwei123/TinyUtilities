# Stage 1: Build the frontend
FROM node:20.10.0 AS frontend-builder
WORKDIR /frontend

# Copy and install frontend dependencies
COPY ./frontend/package*.json ./
RUN npm install

# Copy frontend source code and build it
COPY ./frontend .
RUN npm run build

# Stage 2: Build the backend with Go
FROM golang:1.17 AS backend-builder
WORKDIR /app

# Copy backend module files and download dependencies
COPY ./backend/go.mod ./backend/go.sum ./backend/
RUN cd ./backend && go mod download

# Copy backend source files and build the Go application
COPY ./backend ./backend
RUN cd ./backend/cmd && go build -o /app/myapp

# Stage 3: Create the final image with both frontend and backend
FROM alpine:latest
WORKDIR /root/

# Install libc compatibility libraries
RUN apk add --no-cache libc6-compat

# Copy the built Go app
COPY --from=backend-builder /app/myapp .

# Copy the frontend static files
COPY --from=frontend-builder /frontend/dist ./frontend

# Expose the port that your application will run on
EXPOSE 8080

# Run the Go application
CMD ["./myapp"]
