import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Calendly Clone API",
      version: "1.0.0",
      description: "API documentation for Calendly Clone - A meeting scheduling application",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        userId: {
          type: "apiKey",
          in: "header",
          name: "x-user-id",
          description: "User ID for authenticated routes",
        },
      },
      schemas: {
        // User Schemas
        User: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
            slug: { type: "string" },
            timezone: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateUserRequest: {
          type: "object",
          required: ["email", "name", "password"],
          properties: {
            email: { type: "string", format: "email", description: "User's email address" },
            name: { type: "string", minLength: 2, maxLength: 50, description: "User's name" },
            password: { type: "string", minLength: 6, description: "User's password (min 6 characters)" },
            slug: { type: "string", pattern: "^[a-z0-9-]+$", minLength: 1, maxLength: 100, description: "Optional URL-friendly slug" },
          },
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            email: { type: "string", format: "email", description: "User's email address" },
            name: { type: "string", minLength: 2, maxLength: 50, description: "User's name" },
          },
        },

        // Event Type Schemas
        EventType: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64" },
            hostId: { type: "integer", format: "int64" },
            title: { type: "string" },
            description: { type: "string", nullable: true },
            slug: { type: "string" },
            durationMinutes: { type: "integer" },
            isActive: { type: "boolean" },
            locationType: { type: "string", enum: ["online", "in-person"] },
            locationValue: { type: "string", nullable: true },
            bufferBeforeMinutes: { type: "integer" },
            bufferAfterMinutes: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateEventTypeRequest: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", minLength: 2, maxLength: 50, description: "Event type title" },
            description: { type: "string", minLength: 2, maxLength: 1000, description: "Event type description" },
            durationMinutes: { type: "integer", minimum: 15, maximum: 120, default: 30, description: "Duration in minutes" },
            isActive: { type: "boolean", default: true, description: "Whether the event type is active" },
            locationType: { type: "string", enum: ["online", "in-person"], default: "online", description: "Location type" },
            locationValue: { type: "string", description: "Location value (URL for online, address for in-person)" },
            bufferBeforeMinutes: { type: "integer", minimum: 0, maximum: 120, default: 0, description: "Buffer time before event" },
            bufferAfterMinutes: { type: "integer", minimum: 0, maximum: 120, default: 0, description: "Buffer time after event" },
            slug: { type: "string", pattern: "^[a-z0-9-]+$", minLength: 1, maxLength: 100, description: "Optional URL-friendly slug" },
          },
        },
        UpdateEventTypeRequest: {
          type: "object",
          properties: {
            title: { type: "string", minLength: 2, maxLength: 50 },
            description: { type: "string", minLength: 2, maxLength: 1000 },
            durationMinutes: { type: "integer", minimum: 15, maximum: 120 },
            isActive: { type: "boolean" },
            locationType: { type: "string", enum: ["online", "in-person"] },
            locationValue: { type: "string" },
            bufferBeforeMinutes: { type: "integer", minimum: 0, maximum: 120 },
            bufferAfterMinutes: { type: "integer", minimum: 0, maximum: 120 },
            slug: { type: "string", pattern: "^[a-z0-9-]+$", minLength: 1, maxLength: 100 },
          },
        },

        // Availability Rule Schemas
        AvailabilityRule: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64" },
            userId: { type: "integer", format: "int64" },
            weekday: { type: "integer", minimum: 0, maximum: 6, description: "0 = Sunday, 6 = Saturday" },
            startTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", description: "Start time in HH:mm format" },
            endTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", description: "End time in HH:mm format" },
            isActive: { type: "boolean" },
            timezone: { type: "string", default: "UTC" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateAvailabilityRuleRequest: {
          type: "object",
          required: ["weekday", "startTime", "endTime"],
          properties: {
            weekday: { type: "integer", minimum: 0, maximum: 6, description: "0 = Sunday, 6 = Saturday" },
            startTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", description: "Start time in HH:mm format" },
            endTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", description: "End time in HH:mm format" },
            isActive: { type: "boolean", default: true },
            timezone: { type: "string", default: "UTC" },
          },
        },
        UpdateAvailabilityRuleRequest: {
          type: "object",
          properties: {
            weekday: { type: "integer", minimum: 0, maximum: 6 },
            startTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$" },
            endTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$" },
            isActive: { type: "boolean" },
            timezone: { type: "string" },
          },
        },

        // Availability Exception Schemas
        AvailabilityException: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64" },
            userId: { type: "integer", format: "int64" },
            date: { type: "string", format: "date", description: "Date in YYYY-MM-DD format" },
            type: { type: "string", enum: ["BLOCK_FULL_DAY", "BLOCK_PARTIAL", "ADD_AVAILABLE_WINDOW"] },
            startTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", nullable: true },
            endTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", nullable: true },
            timezone: { type: "string", default: "UTC" },
            reason: { type: "string", maxLength: 500, nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateAvailabilityExceptionRequest: {
          type: "object",
          required: ["date", "type"],
          properties: {
            date: { type: "string", pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$", description: "Date in YYYY-MM-DD format" },
            type: { type: "string", enum: ["BLOCK_FULL_DAY", "BLOCK_PARTIAL", "ADD_AVAILABLE_WINDOW"] },
            startTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", description: "Required for non-full day exceptions" },
            endTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$", description: "Required for non-full day exceptions" },
            timezone: { type: "string", default: "UTC" },
            reason: { type: "string", maxLength: 500 },
          },
        },
        UpdateAvailabilityExceptionRequest: {
          type: "object",
          properties: {
            date: { type: "string", pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$" },
            type: { type: "string", enum: ["BLOCK_FULL_DAY", "BLOCK_PARTIAL", "ADD_AVAILABLE_WINDOW"] },
            startTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$" },
            endTime: { type: "string", pattern: "^([01]\\d|2[0-3]):[0-5]\\d$" },
            timezone: { type: "string" },
            reason: { type: "string", maxLength: 500 },
          },
        },

        // Slot Schemas
        Slot: {
          type: "object",
          properties: {
            id: { type: "string" },
            hostId: { type: "integer", format: "int64" },
            eventTypeId: { type: "integer", format: "int64" },
            startAt: { type: "string", format: "date-time" },
            endAt: { type: "string", format: "date-time" },
            status: { type: "string", enum: ["AVAILABLE", "BOOKED", "BLOCKED"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // Booking Schemas
        Booking: {
          type: "object",
          properties: {
            id: { type: "integer", format: "int64" },
            hostId: { type: "integer", format: "int64" },
            eventTypeId: { type: "integer", format: "int64" },
            slotId: { type: "string" },
            inviteeEmail: { type: "string", format: "email" },
            inviteeName: { type: "string" },
            inviteeNotes: { type: "string", nullable: true },
            status: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELLED"] },
            meetLink: { type: "string", nullable: true },
            calendarEventId: { type: "string", nullable: true },
            cancelledAt: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateBookingRequest: {
          type: "object",
          required: ["slotId", "inviteeEmail", "inviteeName"],
          properties: {
            slotId: { type: "string", description: "Slot ID to book" },
            inviteeEmail: { type: "string", format: "email", description: "Invitee's email address" },
            inviteeName: { type: "string", minLength: 1, maxLength: 100, description: "Invitee's name" },
            inviteeNotes: { type: "string", description: "Optional notes from invitee" },
          },
        },
        ListBookingsQuery: {
          type: "object",
          properties: {
            status: { type: "string", enum: ["CONFIRMED", "PENDING", "CANCELLED"], description: "Filter by booking status" },
            from: { type: "string", pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$", description: "Start date in YYYY-MM-DD format" },
            to: { type: "string", pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$", description: "End date in YYYY-MM-DD format" },
          },
        },

        // Google Calendar Schemas
        GoogleAuthUrlResponse: {
          type: "object",
          properties: {
            url: { type: "string", description: "Google OAuth authorization URL" },
          },
        },
        GoogleCallbackResponse: {
          type: "object",
          properties: {
            email: { type: "string", format: "email", description: "Connected Google account email" },
          },
        },
        GoogleCalendarStatusResponse: {
          type: "object",
          properties: {
            connected: { type: "boolean" },
            email: { type: "string", format: "email", nullable: true },
          },
        },

        // Health Check
        HealthResponse: {
          type: "object",
          properties: {
            status: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
          },
        },

        // Generic Response
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", default: false },
            message: { type: "string" },
            statusCode: { type: "integer" },
            errors: { type: "array", items: { type: "object" } },
          },
        },
      },
    },
    security: [
      {
        userId: [],
      },
    ],
    tags: [
      { name: "Health", description: "Health check endpoint" },
      { name: "Users", description: "User management" },
      { name: "Event Types", description: "Event type management" },
      { name: "Public Event Types", description: "Public event type access" },
      { name: "Availability", description: "Availability rules and exceptions" },
      { name: "Bookings", description: "Booking management" },
      { name: "Google Integration", description: "Google Calendar integration" },
    ],
  },
  apis: ["./src/routers/*.ts", "./src/controllers/*.ts", "./src/app.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);