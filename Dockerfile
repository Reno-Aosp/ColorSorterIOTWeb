# Multi-stage build for IoT Color Detection System

# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Copy frontend source
COPY src/main/resources/static/FrontEnd/package*.json ./
COPY src/main/resources/static/FrontEnd/ ./

# Install dependencies and build
RUN npm install
RUN npm run build

# Stage 2: Build Spring Boot backend
FROM maven:3.9.0-openjdk-21-slim AS backend-build

WORKDIR /app/backend

# Copy Maven files
COPY pom.xml ./
COPY src ./src

# Copy built frontend to Spring Boot static resources
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static/

# Build the application
RUN mvn clean package -DskipTests

# Stage 3: Runtime image
FROM openjdk:21-jre-slim

WORKDIR /app

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy the built JAR file
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Change ownership
RUN chown appuser:appuser app.jar

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 1000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:1000/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]