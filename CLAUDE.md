# SG Event Hub Build Commands and Guidelines

## Build Commands
- **Start all services**: `docker-compose up -d`
- **Backend (Java services)**:
  - Build event-manager: `cd event-manager && ./mvnw clean package`
  - Build user-manager: `cd user-manager && ./mvnw clean package`
  - Run tests: `./mvnw test`
  - Run single test: `./mvnw test -Dtest=TestClassName`
- **Frontend (Gatsby/React)**:
  - Install dependencies: `cd sgevent-ui && npm install`
  - Start development server: `cd sgevent-ui && npm run develop`
  - Build for production: `cd sgevent-ui && npm run build`

## Code Style Guidelines
- **Java**: 
  - Use Spring Boot idioms and annotations
  - Lombok annotations for reducing boilerplate
  - Entity/DTO pattern for data transfer
  - Follow Java naming conventions (camelCase for methods/variables, PascalCase for classes)
- **JavaScript/React**:
  - MUI components for UI
  - Redux for state management
  - Use functional components with hooks
  - Follow React project structure (pages, components, services)
  - ES6+ syntax with explicit types