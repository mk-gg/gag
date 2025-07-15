<p align="center">
  <a href="https://github.com/mk-gg/gag">
    <img src="https://github.com/mk-gg/gag/blob/main/images/preview.png" alt="Master" style="width:50%; height:auto;">
  </a>
</p>

<p align="center">
  <h1>Grow a Garden - Shop Tracker</h1>
</p>



A monorepo containing a full-stack application for tracking a popular Roblox game called Grow a Garden. This project was created to solve the tedious process of having to log into the game just to check shop inventories. With this tracker, you can conveniently monitor shop contents without the need to launch the game.

You can try out the web app [here](https://gag-tracker.netlify.app).

## Features
- Live monitoring of in-game shop inventories
- Wishlist system for tracking specific items
- Push notifications for wishlist item availability

## Project Structure

This repository contains two main projects:

- `gag-tracker-frontend/`: A Next.js-based web application
- `gag-tracker-backend/`: A .NET Core-based REST API

## Prerequisites

- Node.js (v18 or later)
- .NET 8.0 SDK
- Docker (optional, for containerized deployment)
- pnpm (for frontend package management)

## Getting Started

### Frontend Setup

```bash
cd gag-tracker-frontend
pnpm install
pnpm dev
```

The frontend will be available at http://localhost:3000

### Backend Setup

```bash
cd gag-tracker-backend
dotnet restore
dotnet run
```

The backend API will be available at http://localhost:5000

## Development

### Frontend Development

The frontend is built with:
- Next.js
- TypeScript
- Tailwind CSS
- Shadcn/ui components

To start the development server:
```bash
cd gag-tracker-frontend
pnpm dev
```

### Backend Development

The backend is built with:
- .NET 8.0
- ASP.NET Core Web API
- Entity Framework Core (if applicable)

To start the backend server:
```bash
cd gag-tracker-backend
dotnet watch run
```

## Docker Support

Currently, Docker support is implemented for the backend service only.

### Building and Running Backend Docker Image

```bash
cd gag-tracker-backend
docker build -t gag-tracker-backend .
docker run -p 5000:8080 -p 5001:8081 gag-tracker-backend
```

The backend container exposes:
- Port 8080 for HTTP traffic
- Port 8081 for HTTPS traffic

Note: Frontend Docker support is planned for future implementation.

## Environment Variables

### Frontend (.env.local)
```
# Required environment variables
API_URL=http://localhost:5000
```

### Backend (appsettings.json)
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

## Contributing

This project welcomes contributions and suggestions. Feel free to submit a pull request!

## License

This repository's source code is available under the [MIT License](LICENSE).