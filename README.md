# Calendly Clone - Meeting Scheduler API

A modern, type-safe backend API for a Calendly-like meeting scheduling application built with **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, **Temporal.io**, **Google Calendar API**, and **Redis**.

## 🚀 Features

### Core Features
- **User Management** - Create, read, update, and delete users with unique slugs
- **Event Types** - Create customizable meeting types with duration, buffers, and location settings
- **Availability Management** - Recurring weekly availability rules and one-off exceptions
- **Slot Generation** - Automatic time slot creation based on availability rules and exceptions
- **Booking System** - Invitee booking flow with optimistic/pessimistic locking and status tracking (PENDING, CONFIRMED, CANCELLED)
- **Public Event Access** - Public-facing endpoint for invitees to view event types and book slots
- **Health Check** - Built-in health endpoint for monitoring

### Advanced Features
- **Temporal.io Workflow Orchestration** - Durable, fault-tolerant workflows for:
  - Automatic slot regeneration when availability changes
  - Booking confirmation emails
  - Booking cancellation notifications
  - Google Calendar event creation with Google Meet links
- **Google Calendar Integration** - OAuth2 flow for calendar setup with Redis-based state management, automatic event creation with Google Meet links
- **Email Notifications** - Booking confirmations and cancellations via SMTP (Mailhog for development)
- **Redis Integration** - Caching, session management, and OAuth token storage (ready for production)
- **Optimistic & Pessimistic Locking** - Race-condition-safe slot booking
- **Availability Exceptions** - One-off date overrides (blocked time or custom hours)
- **Availability Rules** - Recurring weekly schedules with timezone support
- **Slot Regeneration Workflows** - Automatic slot updates when availability changes

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest LTS | Runtime |
| **TypeScript** | ^6.x | Type safety |
| **Express** | ^5.x | Web framework |
| **Prisma ORM** | ^7.x | Database ORM |
| **PostgreSQL** | 15+ | Primary database |
| **Temporal.io** | ^1.20.x | Workflow orchestration |
| **Google APIs** | ^173.x | Google Calendar & OAuth2 |
| **Redis** | ^5.x (ioredis) | Caching, sessions & OAuth tokens |
| **Nodemailer** | ^9.x | Email delivery |
| **Zod** | ^4.x | Schema validation |
| **Luxon** | ^3.x | Date/time handling |
| **dotenv** | ^17.x | Environment config |
| **tsx** | ^4.x | TypeScript execution |
| **nodemon** | ^3.x | Auto-reload in dev |

## 📁 Project Structure

```
Calendly-clone/
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Migration history
│
├── generated/
│   └── prisma/                    # Generated Prisma client
│
├── temporal/
│   └── dynamicConfig/             # Temporal dynamic config
│
├── src/
│   ├── app.ts                     # Express app setup
│   ├── server.ts                  # Server entry point
│   │
│   ├── config/
│   │   ├── database.ts            # Prisma client & connection
│   │   ├── db-client.ts           # Database client wrapper
│   │   ├── env.ts                 # Environment variables
│   │   ├── nodemailer.ts          # Email transport config
│   │   ├── redis-client.ts        # Redis client
│   │   └── temporal.ts            # Temporal client config
│   │
│   ├── controllers/
│   │   ├── availability.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── event-type.controller.ts
│   │   ├── google.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── dtos/
│   │   ├── availability.dto.ts
│   │   ├── booking.dto.ts
│   │   ├── event-type.dto.ts
│   │   └── user.dto.ts
│   │
│   ├── mailer/
│   │   └── booking.mailer.ts      # Email templates
│   │
│   ├── middlewares/
│   │   ├── error-handler.ts
│   │   ├── require-user-id.ts
│   │   ├── route-not-found.ts
│   │   └── validate.ts
│   │
│   ├── repositories/
│   │   ├── availability.repository.ts
│   │   ├── booking.repository.ts
│   │   ├── event-type.repository.ts
│   │   ├── google-oauth-state.repository.ts  # Redis OAuth state management
│   │   ├── google-token.repository.ts        # Redis token storage
│   │   ├── slot.repository.ts
│   │   └── user.repository.ts
│   │
│   ├── routers/
│   │   ├── availability.router.ts
│   │   ├── booking.router.ts
│   │   ├── event-type.router.ts
│   │   ├── google.router.ts
│   │   ├── public-event-type.router.ts
│   │   └── user.router.ts
│   │
│   ├── services/
│   │   ├── availability.service.ts
│   │   ├── booking.service.ts
│   │   ├── event-types.service.ts
│   │   ├── google-calendar.service.ts
│   │   ├── slot.service.ts
│   │   └── user.service.ts
│   │
│   ├── temporal/
│   │   ├── client.ts              # Temporal client helpers
│   │   ├── worker.ts              # Temporal worker
│   │   ├── activities/
│   │   │   └── index.ts           # Temporal activities
│   │   └── workflows/
│   │       ├── booking-notification.workflow.ts
│   │       ├── google-calendar.workflow.ts
│   │       ├── index.ts
│   │       └── slot-generation.workflow.ts
│   │
│   ├── types/
│   │   └── express.d.ts           # Express type extensions
│   │
│   └── utils/
│       ├── api-error.ts
│       ├── api-response.ts
│       ├── google-setup.ts        # Google OAuth CLI setup tool
│       ├── id-generator.ts
│       ├── ids.ts
│       └── slots/
│           └── slot-generation.ts # Slot generation logic
│
├── tests/
│   ├── integration/
│   └── unit/
│
├── docker-compose.yml             # Temporal, Mailhog, Temporal UI, Redis
├── package.json
├── tsconfig.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── prisma.config.ts
└── .gitignore
```

## ⚙️ Getting Started

### Prerequisites

- **Node.js** (v20+ recommended)
- **pnpm** (v11.5.2+) - Package manager
- **PostgreSQL** database (local or hosted)
- **Docker** & **Docker Compose** (for Temporal, Mailhog, Temporal UI, Redis)

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
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/calendly_clone?schema=public"
   
   # Server
   PORT=3000
   NODE_ENV=development
   MACHINE_ID=1
   SLOT_GENERATION_DAYS=30
   
   # Temporal
   TEMPORAL_ADDRESS=localhost:7233
   TEMPORAL_NAMESPACE=default
   TEMPORAL_TASK_QUEUE=calendly-tasks
   TEMPORAL_ENABLED=true
   
   # Email (Mailhog for development)
   SMTP_HOST=localhost
   SMTP_PORT=1025
   SMTP_USER=""
   SMTP_PASSWORD=""
   EMAIL_FROM="Calendly <noreply@example.com>"
   
   # Google Calendar (Optional)
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback
   GOOGLE_SENDER_EMAIL=your_email@gmail.com
   GOOGLE_CALENDAR_ID=primary
   
   # Redis (Optional - for OAuth token storage and caching)
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. **Start infrastructure services**
   ```bash
   docker-compose up -d
   ```
   This starts:
   - **Temporal** (port 7233) - Workflow orchestration
   - **Temporal UI** (port 8080) - Workflow visualization
   - **Mailhog** (ports 1025 SMTP, 8025 UI) - Email testing
   - **Redis** (port 6379) - Caching and OAuth token storage

5. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm prisma:generate
   
   # Run migrations
   pnpm prisma:migrate
   ```

6. **Start development server**
   ```bash
   pnpm dev
   ```

7. **Start Temporal worker** (in a separate terminal)
   ```bash
   pnpm dev:worker
   # or for production
   pnpm temporal:worker
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
  "slug": "john-doe",  // optional, auto-generated if not provided
  "timezone": "UTC"    // optional
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

### Availability Rules (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/availability/rules` | List availability rules |
| POST | `/api/availability/rules` | Create availability rule |
| PATCH | `/api/availability/rules/:id` | Update availability rule |
| DELETE | `/api/availability/rules/:id` | Delete availability rule |

**Create Rule Body:**
```json
{
  "weekday": 1,           // 0=Sunday, 1=Monday, etc.
  "startTime": "09:00",
  "endTime": "17:00",
  "timezone": "America/New_York",
  "isActive": true
}
```

### Availability Exceptions (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/availability/exceptions` | List availability exceptions |
| POST | `/api/availability/exceptions` | Create availability exception |
| PATCH | `/api/availability/exceptions/:id` | Update availability exception |
| DELETE | `/api/availability/exceptions/:id` | Delete availability exception |

**Create Exception Body:**
```json
{
  "date": "2026-07-25",
  "type": "BLOCKED",        // or "CUSTOM_HOURS"
  "startTime": "10:00",    // required if CUSTOM_HOURS
  "endTime": "14:00",      // required if CUSTOM_HOURS
  "timezone": "UTC"
}
```

### Slots (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/users/:userId/event-types/:slug/slots` | Get available slots for booking |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking (public - invitee flow) |
| GET | `/api/bookings` | List host's bookings (authenticated) |
| DELETE | `/api/bookings/:id` | Cancel booking (authenticated host) |

**Create Booking Body:**
```json
{
  "slotId": "slot_id",
  "inviteeEmail": "invitee@example.com",
  "inviteeName": "John Doe",
  "inviteeNotes": "Optional notes"
}
```

**List Bookings Query:**
```
GET /api/bookings?status=CONFIRMED&from=2026-07-01&to=2026-07-31
```

### Public Event Access
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/users/:userId/event-types/:slug` | Get public event type for booking |

### Google Calendar OAuth
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/google/setup` | Get Google OAuth URL for calendar setup |
| GET | `/api/google/callback` | OAuth callback handler |

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

### Key Enums

- **SlotStatus**: `AVAILABLE` | `BOOKED` | `BLOCKED`
- **BookingStatus**: `PENDING` | `CONFIRMED` | `CANCELLED`
- **ExceptionType**: `BLOCKED` | `CUSTOM_HOURS`
- **LocationType**: `online` | `offline` | `phone`

> **Note**: Google OAuth tokens (refresh tokens) are stored in **Redis** (not in the database) for security. The `google-token.repository.ts` and `google-oauth-state.repository.ts` handle token storage and OAuth state management with TTL-based expiration.

## 🔐 Authentication

Currently uses a simple header-based approach:
- Include `x-user-id` header with requests to protected routes
- The `requireUserId` middleware validates this header
- Future: JWT-based authentication planned

## 🔄 Workflows (Temporal.io)

### Slot Regeneration Workflow
Triggered automatically when:
- Availability rules are created/updated/deleted
- Availability exceptions are created/updated/deleted
- Event types are created/updated

Regenerates slots for the affected date range.

### Booking Notification Workflow
- Sends confirmation email to invitee when booking is created
- Sends cancellation email when booking is cancelled

### Google Calendar Workflow
- Creates Google Calendar event with Google Meet link
- Adds invitee as attendee
- Runs asynchronously after booking confirmation

## 📧 Email Notifications

- **Booking Confirmation**: Sent to invitee with event details and Google Meet link
- **Booking Cancellation**: Sent to invitee when host cancels
- Uses Nodemailer with SMTP (Mailhog for local development)

## 🔑 Google OAuth Flow (Redis-Based)

The application uses Redis for secure OAuth state and token management:

1. **OAuth State** (`google-oauth-state.repository.ts`):
   - Generates cryptographically secure nonce (UUID)
   - Stores `userId` in Redis with 10-minute TTL
   - State consumed and deleted on callback

2. **Refresh Token Storage** (`google-token.repository.ts`):
   - Stores refresh token + associated email in Redis
   - No expiration (persists until explicitly deleted)
   - Used by Temporal workflows for calendar event creation

3. **Flow**:
   ```
   GET /api/google/setup → Returns OAuth URL with state nonce
   User authorizes → Google redirects to /api/google/callback?state=nonce&code=auth_code
   Callback → Consumes state, exchanges code for tokens, saves refresh token to Redis
   ```

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm dev:worker` | Start Temporal worker with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm prisma:generate` | Generate Prisma client |
| `pnpm prisma:migrate` | Run database migrations |
| `pnpm prisma:studio` | Open Prisma Studio |
| `pnpm prisma:format` | Format Prisma schema |
| `pnpm temporal:worker` | Start Temporal worker (production) |
| `pnpm google:setup` | Run Google OAuth CLI setup tool |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |

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
8. Add Temporal workflows/activities if async processing needed

### Testing
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test -- tests/unit/your-test.test.ts
```

### Google Calendar Setup (CLI)
```bash
# Interactive setup to get refresh token
pnpm google:setup
```
This will guide you through OAuth flow and output the refresh token to add to your environment.

## 🐳 Docker Services

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Service URLs
- **Temporal**: `localhost:7233`
- **Temporal UI**: `http://localhost:8080`
- **Mailhog SMTP**: `localhost:1025`
- **Mailhog UI**: `http://localhost:8025`
- **Redis**: `localhost:6379`

## 🔧 Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | - | PostgreSQL connection string |
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment |
| `MACHINE_ID` | `1` | Machine ID for distributed ID generation |
| `SLOT_GENERATION_DAYS` | `30` | Days ahead to generate slots |
| `TEMPORAL_ADDRESS` | `localhost:7233` | Temporal server address |
| `TEMPORAL_NAMESPACE` | `default` | Temporal namespace |
| `TEMPORAL_TASK_QUEUE` | `calendly-tasks` | Temporal task queue |
| `TEMPORAL_ENABLED` | `true` | Enable/disable Temporal |
| `SMTP_HOST` | `localhost` | SMTP host |
| `SMTP_PORT` | `1025` | SMTP port |
| `SMTP_USER` | - | SMTP username |
| `SMTP_PASSWORD` | - | SMTP password |
| `EMAIL_FROM` | `Calendly <noreply@example.com>` | From email address |
| `GOOGLE_CLIENT_ID` | - | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | - | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | - | OAuth redirect URI |
| `GOOGLE_SENDER_EMAIL` | - | Email for calendar events |
| `GOOGLE_CALENDAR_ID` | `primary` | Calendar ID to use |
| `REDIS_HOST` | `localhost` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |

## 📄 License

ISC License - See [LICENSE](LICENSE) for details.

## 👤 Author

**Gitesh Zope** - [GitHub](https://github.com/gitesh216)

---

*Built as a learning project to explore modern Node.js/TypeScript backend development with Prisma, PostgreSQL, Temporal.io, Google Calendar API, and Redis.*