# NIBMTix App - Event Organizer Platform

Welcome to the **NIBMTix App**, a mobile solution exclusively designed for **event organizers** at NIBM. This app enables organizers to efficiently manage their events by viewing ticket sales, participant lists, and utilizing QR codes to scan tickets for entry verification.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
- **View Event Data**: Organizers can access real-time information on ticket sales and participant lists for their events.
- **QR Code Scanning**: The app includes a QR code for each event, enabling ticket scanning for streamlined attendee check-ins.
- **Mobile-Optimized Dashboard**: Easily manage your events and access data from any mobile device.
- **Cross-Platform Support**: Available for both iOS and Android devices using React Native Expo.

## Technology Stack
- **Framework**: React Native Expo
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Supabase (PostgreSQL)
- **QR Code Generation**: Integrated QR code functionality for ticket scanning
- **API Communication**: Supabase API for retrieving and updating event-related data

## Installation

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI**
- **Expo Go** (for testing on mobile)

### Clone the Repository
```
git clone https://github.com/supunsathsara/nibmtix-app.git
cd nibmtix-app
```

### Install Dependencies
```
npm install
```

## Environment Variables
Create an `.env` file in the root directory and set the required environment variables:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These environment variables are essential for connecting to the Supabase backend.

## Usage

### Running the App
To start the app in development mode, use the following command:
```
npm start
```

You can then scan the QR code provided by Expo in your terminal using the **Expo Go** app on your mobile device.

### QR Code Scanning
Once the event is created, organizers can view the associated QR code for each event. This QR code can be used to scan tickets and verify attendee entry.

### Build for Production
To create a production build of the app, follow the Expo documentation for building and deploying apps to both Android and iOS platforms.

## Contributing
We welcome contributions from the community. Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a Pull Request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.