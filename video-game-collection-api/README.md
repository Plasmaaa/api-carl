# 🎮 Video Game Collection API

A complete RESTful API for managing a video game collection with full CRUD operations, internationalization, content negotiation, API versioning, and HATEOAS support.

## ✅ Features Implemented

### 1. Architecture & Structure
- ✅ **MVC Architecture**: Models, Controllers, Routes, Middlewares organized by function
- ✅ **TypeScript**: Full type safety
- ✅ **Modular Routes**: v1 and v2 API versioning
- ✅ **Error Handling**: Global error handler middleware

### 2. Express.js Server
- ✅ **Express 5.x**: Latest version
- ✅ **Body Parser Middleware**: JSON request parsing
- ✅ **Modular Routing**: RESTful routes organization
- ✅ **Environment Variables**: PORT configured via .env

### 3. PostgreSQL Database
- ✅ **Sequelize ORM**: Complete ORM integration
- ✅ **Connection Management**: Via environment variables
- ✅ **Migrations**: SQL migration file with schema and indexes
- ✅ **Database Sync**: Automatic table creation on startup

### 4. RESTful CRUD Operations

| Method | Endpoint | Action | Status |
|--------|----------|--------|--------|
| GET | `/api/v{x}/games` | List all games | 200 |
| POST | `/api/v{x}/games` | Create game | 201 |
| GET | `/api/v{x}/games/:id` | Get single game | 200, 404 |
| PATCH | `/api/v{x}/games/:id` | Update (partial) | 200, 404 |
| DELETE | `/api/v{x}/games/:id` | Delete game | 204, 404 |

### 5. Advanced Features

#### 🌐 Internationalization (i18n)
- ✅ **Languages**: English, French, Spanish
- ✅ **Auto-detection**: From Accept-Language header or query parameter
- ✅ **Backend**: i18next with file-based translations

#### 📦 Content Negotiation
- ✅ **JSON**: Default format
- ✅ **XML**: Via application/xml header
- ✅ **YAML**: Via application/yaml header

#### 🔄 API Versioning
- ✅ **v1**: Base implementation
- ✅ **v2**: Extended features (same endpoints, enhanced responses)

#### 🔗 HATEOAS (Hypermedia As The Engine Of Application State)
```json
{
  "id": 1,
  "title": "Game Title",
  "_links": {
    "self": { "href": "/api/v1/games/1", "method": "GET" },
    "update": { "href": "/api/v1/games/1", "method": "PATCH" },
    "delete": { "href": "/api/v1/games/1", "method": "DELETE" },
    "collection": { "href": "/api/v1/games", "method": "GET" }
  }
}
```

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v12 or higher

## 🚀 Installation

1. **Clone repository**:
   ```bash
   git clone <repository>
   cd video-game-collection-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Setup PostgreSQL**:
   - Ensure PostgreSQL is running
   - Database will be created automatically on first run

## 🏃 Running the Application

### Development
```bash
npm run dev
```
Server will run on `http://localhost:3000`

### Production
```bash
npm run build
npm start
```

### Health Check
```bash
curl http://localhost:3000/health
```

## 🧪 Testing the API

### Using REST Client (VS Code)
Open `request.http` and click "Send Request" on any request

### Using cURL
```bash
# List all games
curl http://localhost:3000/api/v1/games

# Create a game
curl -X POST http://localhost:3000/api/v1/games \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Legend of Zelda",
    "genre": "Action-Adventure",
    "releaseDate": "2017-03-03",
    "platform": "Nintendo Switch"
  }'

# Get specific game
curl http://localhost:3000/api/v1/games/1

# Update game (PATCH)
curl -X PATCH http://localhost:3000/api/v1/games/1 \
  -H "Content-Type: application/json" \
  -d '{ "genre": "Adventure RPG" }'

# Delete game
curl -X DELETE http://localhost:3000/api/v1/games/1
```

## 🌍 Internationalization Examples

```bash
# English (default)
curl http://localhost:3000/api/v1/games

# French
curl http://localhost:3000/api/v1/games \
  -H "Accept-Language: fr"

# Spanish
curl http://localhost:3000/api/v1/games \
  -H "Accept-Language: es"
```

## 📄 Content Negotiation Examples

```bash
# JSON (default)
curl http://localhost:3000/api/v1/games

# XML
curl http://localhost:3000/api/v1/games \
  -H "Accept: application/xml"

# YAML
curl http://localhost:3000/api/v1/games \
  -H "Accept: application/yaml"
```

## 📚 API Documentation

### Game Model
```typescript
{
  id: number;              // Auto-increment primary key
  title: string;           // Required, 1-255 chars
  genre: string;           // Required, 1-100 chars
  releaseDate: Date;       // Required, ISO date format
  platform: string;        // Required, must be: PlayStation, Xbox, Nintendo Switch, PC, Mobile, Web
  createdAt: Date;         // Auto timestamp
  updatedAt: Date;         // Auto timestamp
}
```

### Response Format
```json
{
  "data": {
    ...resource data,
    "_links": { ...HATEOAS links }
  },
  "message": "Localized success message"
}
```

## 🔧 Project Structure

```
src/
├── app.ts                          # Express app setup
├── server.ts                       # Server entry point
├── controllers/
│   └── gamesController.ts          # CRUD logic
├── models/
│   └── Game.ts                     # Sequelize model
├── routes/
│   ├── v1/games.ts                 # v1 routes
│   └── v2/games.ts                 # v2 routes
├── middleware/
│   ├── errorHandler.ts             # Global error handler
│   └── contentNegotiation.ts       # Format negotiation
├── database/
│   ├── connection.ts               # Database connection
│   └── migrations/
│       └── 001_create_games_table.sql
├── locales/
│   ├── en.json                     # English translations
│   ├── fr.json                     # French translations
│   └── es.json                     # Spanish translations
├── utils/
│   ├── hateoas.ts                  # HATEOAS link generation
│   └── validators.ts               # Input validation
└── types/
    └── index.ts                    # TypeScript definitions
```

## 📦 Dependencies

- **express@5.0.0**: Web framework
- **sequelize@6.35.2**: ORM
- **pg@8.10.0**: PostgreSQL client
- **i18next@23.7.6**: Internationalization
- **yaml@2.3.4**: YAML support
- **xml@1.0.1**: XML support

## 🛠️ Available Scripts

```bash
npm run dev        # Start in development mode with hot reload
npm run build      # Build TypeScript to JavaScript
npm start          # Start production server
npm test           # Run tests (when configured)
```

## 📝 HTTP Request Examples

See `request.http` for comprehensive examples including:
- CRUD operations for all HTTP methods
- API versioning (v1 and v2)
- Content negotiation (JSON, XML, YAML)
- Internationalization (EN, FR, ES)
- Error handling scenarios
- HATEOAS links validation

## 🐛 Error Handling

The API implements comprehensive error handling with:
- Validation errors (400)
- Not found errors (404)
- Server errors (500)
- Localized error messages
- Error timestamps and paths

## 🔐 Security Notes

- Input validation on all endpoints
- Platform whitelist validation
- SQL injection protection (via Sequelize ORM)
- CORS-ready middleware

## 📄 License

MIT

## 👨‍💻 Author

Jason

- **Version 2**:
  - Similar endpoints with potential enhancements or additional features.

### Internationalization
The API supports English, French, and Spanish. You can specify the desired language using the `Accept-Language` header in your requests.

### Error Handling
The API includes standardized error responses for better client-side handling.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.