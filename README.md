# Token Tracker
In Magic: The Gathering (MTG), `tokens` are "virtual" cards that are not a part of a player's library (deck) that are created by effects of other cards. Tokens are a crucial aspect of gameplay, but managing them can be cumbersome. In Limited games, players may not have access to the corresponding token cards, while in constructed formats, players must bring their own tokens. Players currently rely on manual methods for token management, such as using dice, temporary dry-erase cards, other objects to represent tokens, or official token cards.

These manual methods can add to the complexity, expense, room for error, and clutter of an already intricate game, making it difficult for players to focus on strategy, gameplay, and fun.

**Token Tracker** is a web app that streamlines token management to enhance MTG gameplay and allows players to be more efficient and organized to play the game with tokens.

## Description
Token Tracker allows you to:
- **Create Token Palettes**: Build palettes based on your deck's likely tokens.
- **Manage Live Game**: Create a game instance from a token palette to track tokens during live gameplay.
- **Track Game State**: Add and remove tokens in real time. Increment or decrement counters, tap and untap, and track summoning sickness.
- **Search Tokens**: Look up tokens using to explore their attributes, art, and more.

With Token Tracker, you can manage tokens efficiently without relying on physical objects. The goal is to make your MTG experience more streamlined, enjoyable, and affordable.

## Dependencies
### Back-End (Java Spring Boot)
- Java 21
- Spring Boot 3.4.2
  - spring-boot-starter-data-jpa
  - spring-boot-starter-web
  - mysql-connector-j
- MySQL Database
- Maven Build Tool
- [Scryfall API](https://github.com/scryfall)

### Front-End (React + TypeScript)
- React 18.3.1
- TypeScript 5.6.2
- Vite 6.0.5
- Axios
- React Router 7.1.5
- Express
- dotenv
- ESLint
- [Scryfall API](https://github.com/scryfall)

## Setup Instructions

### Prerequisites
- Node.js 22.x
- Java 21+
- MySQL Server
- Maven

### Clone the Repository

```bash
git clone https://github.com/ItsJenOClock/token-tracker-web-app.git
cd token-tracker-web-app
```

### Front-End Setup
1. Navigate to the front-end directory:
   ```bash
   cd token-tracker-front-end
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create an `.env` file:
   ```bash
   touch .env
   ```
4. Add the following to `.env`. Adjust port as needed:
   ```env
   VITE_APP_BACKEND_URL=http://localhost:8080/api
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

### Back-End Setup
1. Navigate to the back-end directory:
   ```bash
   cd ../token-tracker-back-end
   ```
2. Configure `application.properties` in `src/main/resources/`. Insert your MySQL credentials in `spring.datasource.username` and `spring.datasource.password` (default username is `root` and no password):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/token_tracker_db
   spring.datasource.username=
   spring.datasource.password=
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
   spring.jpa.show-sql=true
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.application.name=token-tracker-back-end
   ```
3. Install dependencies, and build the project:
   ```bash
   ./mvnw clean install
   # or
   mvn clean install
   ```
4. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   # or
   mvn spring-boot:run
   ```

You can now access Token Tracker at `http://localhost:5173`. Don't forget to adjust Vite port as needed. 
Have fun, and GG! 🧙