# NeuroNavigate – Troubleshooting

## Google sign-in not working (400 error or nothing happens)

**Most likely causes:**

1. **Redirect URI in the wrong place**  
   The redirect URI (e.g. `https://auth.expo.io/@anonymous/NeuroNavigate`) must be added to the **Web application** OAuth client in Google Cloud Console, **not** the iOS or Android client.  
   - Go to [Credentials](https://console.cloud.google.com/apis/credentials) → open the client whose type is **"Web application"** (the one whose Client ID matches the web Client ID in the app).  
   - Under **Authorized redirect URIs**, add the exact URI shown on the login screen (copy-paste, no trailing slash).

2. **Redirect URI doesn’t match exactly**  
   Google requires an exact match: same scheme (https), same host, same path. No extra slash at the end, no typo. Copy the URI from the app and paste it into Google.

3. **OAuth consent screen in “Testing”**  
   If your app is in Testing mode, only Google accounts that you added as **Test users** can sign in.  
   - Go to **OAuth consent screen** → add your Google account (and any others you want) under Test users, **or**  
   - Publish the app to Production (only if you’re ready for any Google user to sign in).

4. **Wrong OAuth client**  
   The app uses the **Web** client ID for Expo Go. The redirect URI must be listed in that same Web client. If you only created an iOS client and added the URI there, create a **Web application** client and add the redirect URI there.

5. **Caching**  
   After changing redirect URIs in Google, wait 1–2 minutes. If you’re testing in a browser, try an incognito/private window or clear site data for accounts.google.com.

6. **Android**  
   On Android, the app uses the same Web client ID (and now has `androidClientId` set). The same redirect URI (Expo proxy) applies; add it to the Web client.

**Quick check:** On the login screen, copy the “Redirect URI” shown in the box. In Google Console, open the **Web application** client and confirm that exact URI appears under Authorized redirect URIs.

---

## QR code won't open / "Couldn't connect" in Expo Go

When you scan the QR code and Expo Go doesn't load the app (or says "Unable to connect"):

1. **Use tunnel mode (best fix on strict Wi‑Fi, e.g. eduroam)**  
   Your phone and laptop must be able to reach each other. On campus or guest Wi‑Fi they often can't. Tunnel fixes that by exposing your dev server over the internet:
   ```bash
   npx expo start --tunnel
   ```
   Or: `npm run start:tunnel`  
   Wait until it shows "Tunnel ready" and a new QR code, then scan **that** QR code with Expo Go. The first time may take a minute and might prompt to install `@expo/ngrok` — say yes.

2. **Same Wi‑Fi (if not using tunnel)**  
   Phone and computer must be on the same network. Avoid: eduroam, guest networks, "isolation" Wi‑Fi. Prefer: same home/office network.

3. **Try the link manually**  
   In Expo Go, tap "Enter URL manually" and type the URL shown in the terminal (e.g. `exp://192.168.1.x:8081` or the tunnel URL).

4. **Firewall**  
   If on same Wi‑Fi and it still fails, allow port **8081** (and 19000/19001 if used) in your Mac firewall: System Settings → Network → Firewall.

---

## "There was an issue" or app doesn't load

### If you're using **Expo Go** (QR code / `npx expo start`)

1. **See the real error**
   - In the terminal where Metro is running, check for red error lines after the app loads.
   - On device: shake the phone → "Show Dev Menu" → "Debug Remote JS" or check the error overlay text.
   - On iOS Simulator: `Cmd + D` → "Debug Remote JS" or read the red screen message.

2. **Common causes**
   - **Network:** Phone and computer must be on the same Wi‑Fi; firewall might block port 8081.
   - **Metro:** Restart with `npx expo start --clear` (clears cache).
   - **Crash on login screen:** Ensure `.env` has `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` set, or the app uses your fallback client IDs.

3. **Update Expo packages (recommended)**  
   Terminal showed version warnings. Update for best compatibility:
   ```bash
   npx expo install expo@~54.0.33 expo-router@~6.0.23
   ```

---

### If you're using **development build** (`npx expo run:ios` or `npx expo run:android`)

The run failed due to **native tooling**, not JavaScript:

#### macOS / iOS

1. **Xcode**
   - Install Xcode from the App Store and open it once to accept the license.
   - Set the active developer directory:
     ```bash
     sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
     ```

2. **CocoaPods** (required for iOS)
   - Install Ruby (macOS has one) then:
     ```bash
     sudo gem install cocoapods
     ```
   - Or with Homebrew (install [brew](https://brew.sh) first if needed):
     ```bash
     brew install cocoapods
     ```
   - Then in your project:
     ```bash
     cd ios && pod install && cd ..
     ```

3. **Run again**
   ```bash
   npx expo run:ios
   ```

#### Android

- Install [Android Studio](https://developer.android.com/studio) and the Android SDK.
- Set `ANDROID_HOME` and add `platform-tools` to `PATH`.
- Then: `npx expo run:android`.

---

### Quick test without native build

Use **Expo Go** so you don’t need Xcode/CocoaPods:

```bash
npx expo start
```

Scan the QR code with the Expo Go app (iOS/Android). The app should load; any “issue” will show in Metro or on the device error screen.
