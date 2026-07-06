# Calendly Clone - Meeting Scheduler API

A modern, type-safe backend API for a Calendly-like meeting scheduling application built with **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

## 🚀 Features

- **User Management** - Create, read, update, and delete users with unique slugs
- **Event Types** - Create customizable meeting types with duration, buffers, and location settings
- **Availability Management** - Recurring weekly availability rules and one-off exceptions
- **Slot Generation** - Automatic time slot creation based on availability
- **Booking System** - Invitee booking flow with status tracking (PENDING, CONFIRMED, CANCELLED)
- **Public Event Access** - Public-facing endpoint for invitees to view event types
- **Health Check** - Built-in health endpoint for monitoring

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest LTS | Runtime |
| **TypeScript** | ^6.0.3 | Type safety |
| **Express** | ^5.2.1 | Web framework |
| **Prisma ORM** | ^7.8.0 | Database ORM |
| **PostgreSQL** | - | Primary database |
| **Zod** | ^4.4.3 | Schema validation |
| **dotenv** | ^17.4.2 | Environment config |
| **slug** | ^11.0.1 | URL-friendly strings |
| **tsx** | ^4.22.4 | TypeScript execution |
| **nodemon** | ^3.1.14 | Auto-reload in dev |

## 📁 Project Structure

```
Calendly-clone/
├── prisma/
│   │  │   ├── schema.prisma          # Database schema
  │   └── migrations/            # Migration history
  │
  ├── generated/
  │   └── prisma/                # Generated Prisma client
  │
  ├── src/
  │   ├── app.ts                 # Express app setup
  │   ├── server.ts              # Server entry point
  │   │
  │   ├── config/
  │   │   ├── database.ts        # Prisma client & connection
  │   │   └── env.ts             # Environment variables
  │   │
  │   ├── controllers/
  │   │   ├── user.controller.ts
  │   │   └── event-type.controller.ts
  │   │
  │   ├── dtos/
  │   │   ├── user.dto.ts
  │   │   ├── event-type.dto.ts
  │   │   └── availability.dto.ts
  │   │
  │   ├── middlewares/
  │   │   ├── error-handler.ts
  │   │   ├── require-user-id.ts
  │   │   ├── route-not-found.ts
  │   │   └── validate.ts
  │   │
  │   ├── repositories/
  │   │   ├── user.repository.ts
  │   │   ├── event-type.repository.ts
  │   │   ├── availability.repository.ts
  │   │   └── slot.repository.ts
  │   │
  │   ├── routers/
  │   │   ├── user.router.ts
  │   │   ├── event-type.router.ts
  │   │   └── public-event-type.router.ts
  │   │
  │   ├── services/
  │   │   ├── user.service.ts
  │   │   └── event-types.service.ts
  │   │
  │   ├── types/
  │   │   └── express.d.ts       # Express type extensions
  │   │
  │   └── utils/
  │       ├── api-error.ts
  │       ├── api-response.ts
  │       ├── id-generator.ts
  │       └── ids.ts
  │
  ├── package.json
  ├── tsconfig.json
  ├── pnpm-lock.yaml
  └── .gitignore
```

## ⚙️ Getting Started

### Prerequisites

- **Node.js** (v20+ recommended)
- **pnpm** (v11.5.2+) - Package manager
- **PostgreSQL** database (local or hosted)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gitesh216/meeting-scheduler.git
   cd meeting-scheduler
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env  # Create .env file
   ```
   Configure your `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/calendly_clone?schema=public"
   PORT=3000
   NODE_ENV=development
   MACHINE_ID=1
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm prisma:generate
   
   # Run migrations
   pnpm prisma:migrate
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

The server will start at `http://localhost:3000`

## 📚 API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Service health status |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PATCH | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

**Create User Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepass123",
  "slug": "john-doe"  // optional, auto-generated if not provided
}
```

### Event Types (Authenticated - requires `x-user-id` header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/event-types` | List user's event types |
| GET | `/api/event-types/:id` | Get event type by ID |
| POST | `/api/event-types` | Create event type |
| PATCH | `/api/event-types/:id` | Update event type |
| DELETE | `/api/event-types/:id` | Delete event type |

**Create Event Type Body:**
```json
{
  "title": "30-min Consultation",
  "description": "Free initial consultation",
  "slug": "30min-consultation",
  "durationMinutes": 30,
  "isActive": true,
  "locationType": "online",
  "locationValue": "https://meet.google.com/xxx",
  "bufferBeforeMinutes": 5,
  "bufferAfterMinutes": 10
}
```

### Public Event Access
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/users/:userId/event-types/:slug` | Get public event type for booking |

## 🗄 Database Schema

### Core Models

| Model | Description |
|-------|-------------|
| **User** | Account holder with email, name, slug, timezone |
| **EventType** | Meeting template (duration, buffers, location, active status) |
| **AvailabilityRule** | Recurring weekly schedule (weekday, start/end time, timezone) |
| **AvailabilityException** | One-off date overrides (blocked or custom hours) |
| **Slot** | Concrete time windows generated from rules/exceptions |
| **Booking** | Invitee reservations linked to slots |

### Relationships

```
User 1 ───< EventType
User 1 ───< AvailabilityRule
User 1 ───< AvailabilityException
User 1 ───< Slot
User 1 ───< Booking (as host)

EventType 1 ───< Slot
EventType 1 ───< Booking

Slot 1 ───< Booking
```

## 🔐 Authentication

Currently uses a simple header-based approach:
- Include `x-user-id` header with requests to protected routes
- The `requireUserId` middleware validates this header

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm prisma:generate` | Generate Prisma client |
| `pnpm prisma:migrate` | Run database migrations |
| `pnpm prisma:format` | Format Prisma schema |

## 🧪 Development

### Code Style
- **TypeScript** strict mode enabled
- **ES Modules** (`"type": "module"`)
- **Zod** for runtime validation
- **Prisma** for type-safe database access

### Adding New Features
1. Define schema changes in `prisma/schema.prisma`
2. Run `pnpm prisma:migrate` to create migration
3. Create DTOs in `src/dtos/`
4. Add repository methods in `src/repositories/`
5. Implement business logic in `src/services/`
6. Create controllers in `src/controllers/`
7. Wire up routes in `src/routers/`

## 📄 License

ISC License - See [LICENSE](LICENSE) for details.

## 👤 Author

**Gitesh Zope** - [GitHub](https://github.com/gitesh216)

---

*Built as a learning project to explore modern Node.js/TypeScript backend development with Prisma and PostgreSQL.*