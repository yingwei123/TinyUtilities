# TinyUtils - URL Shortener & QR Code Generator

TinyUtils is a web application that combines URL shortening capabilities with QR code generation, providing users with a convenient way to manage their shortened URLs and create various types of QR codes.
https://tinyutil-720d25fb202c.herokuapp.com/ 
^ too poor for a custom domain :')

## Features

### URL Shortening
- Create shortened URLs with custom aliases
- Store and manage your shortened URLs
- Copy shortened URLs to clipboard
- Delete URLs you no longer need
- Check alias availability before creation

### QR Code Generation
Generate QR codes for various types of content:
- URLs
- Plain Text
- vCard (Contact Information)
- Email
- SMS

QR Code features include:
- Downloadable PNG format
- Adjustable error correction levels
- Preview before download

## Tech Stack

### Frontend
- React.js
- Material-UI (MUI)
- Axios for API calls
- Vite as build tool

### Backend
- Go (Golang)
- Gorilla Mux for routing
- MongoDB for data storage
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Go (v1.16 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

3. Backend Setup

```bash
cd backend
go run main.go
```

4. Configure environment variables
Create a `.env` file in the backend directory with:
```
SERVER_PORT=8080
ATLAS_URI=your_mongodb_connection_string
```

## Usage

1. URL Shortening:
   - Enter a long URL
   - (Optional) Specify a custom alias
   - Add a name for your URL
   - Click "Shorten URL"

2. QR Code Generation:
   - Select QR code type
   - Fill in the required information
   - Click "Generate QR Code"
   - Download the generated QR code

## API Endpoints

### URL Operations
- `POST /url` - Create new shortened URL
- `GET /url/all` - Get all URLs for user
- `DELETE /url/:id` - Delete a URL
- `POST /url/alias` - Check alias availability

### QR Code Operations
- `POST /qrcode` - Generate QR code

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [go-qrcode](https://github.com/skip2/go-qrcode) for QR code generation
- Material-UI for the React components
- MongoDB Atlas for database hosting
