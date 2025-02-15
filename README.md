A **React Native** application that verifies a user's proximity to a home location and displays the **"Unlock Home"** button **only if they are within 30 meters**. This project uses the GoMaps API for reverse geocoding, and it is set up and run using the CLI (JavaScript) with the Android Studio Emulator.

---

## 1. Prerequisites
- **Node.js (LTS recommended)** – [Download Node.js](https://nodejs.org/)
- **React Native CLI** – Install globally via:
  ```bash
  npm install -g react-native-cli
-   **Java Development Kit (JDK 11+)**
-   **Android Studio & Emulator**
-   **GoMaps API Key** – Obtain one from [GoMaps](https://gomaps.pro/)

----------

## 2. Installation & Setup

### Clone the Repository

`git clone https://github.com/your-username/home-unlock-app.git
cd home-unlock-app` 

### Install Dependencies

`npm install` 

----------

## 3. Configure Permissions & API Key

### Update AndroidManifest.xml

Open `android/app/src/main/AndroidManifest.xml` and add the following inside the `<manifest>` tag:


`<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION"/>` 

Inside the `<application>` tag, add:

`<uses-feature android:name="android.hardware.location.gps"/>` 

### Add Your GoMaps API Key

1.  Get an API key from [GoMaps](https://gomaps.pro/).
2.  Open `DetailsScreen.js` in your project and replace:
    
    javascript
    
    CopyEdit
    
    `const APIKEY = "YOUR_GOMAPS_API_KEY";` 
    
    with your actual GoMaps API key.
3.  Ensure that the GoMaps Geocoding API is enabled in your GoMaps dashboard.

----------

## 4. Running the Application

### Start Metro Bundler

Open a terminal in the project directory and run:

bash

CopyEdit

`npx react-native start` 

_(Keep this terminal open)_

### Run on the Android Emulator

In a new terminal window, run:

`npx react-native run-android` 

### Run on a Physical Device

1.  Enable **USB Debugging** on your Android phone.
2.  Connect your phone via USB.
3.  Check if the device is detected:
    
    `adb devices` 
    
4.  Run the app:
    
    `npx react-native run-android` 
    

----------

## 5. Troubleshooting

### App Crashes After Granting Location Permission?

-   Ensure all required location permissions are added in `AndroidManifest.xml`.
-   Restart Metro Bundler with:

    `npx react-native start --reset-cache` 
    
-   If using a real device, verify that GPS is enabled.

### Location Not Updating?

-   In the emulator, go to **Settings** and enable GPS.
-   Confirm that your GoMaps API key is valid.
-   Check logs for errors:
- 
    `adb logcat *:E` 
    

----------

## How It Works

1.  The app loads and displays a list of homes.
2.  Tapping on a home opens the Details Screen.
3.  The app retrieves the user's current location.
4.  It calculates the distance between the user and the home using the Haversine formula.
5.  If the user is within 30 meters, the **"Unlock Home"** button appears; otherwise, a message is displayed.

----------

## Sample API Response

`{
  "id": "1",
  "description": "A beautiful home near the beach.",
  "imagerUrl": "https://loremflickr.com/640/480/city",
  "latitude": "21.0193",
  "longitude": "33.8171",
  "createdAt": "2025-01-20T15:44:59.887Z"
}` 

----------

## Notes

-   The app requires location permissions to function correctly.
-   It works on both the Android Emulator and physical devices.
-   The app uses the GoMaps API for reverse geocoding.