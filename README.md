# TRANCENT YOUTUBE DOWNLOADER - YouTube Downloader

A modern, full-stack YouTube video downloader web app with multi-format and resolution support, built with React, Vite, TypeScript, shadcn-ui, Tailwind CSS (frontend), and Node.js + Express (backend).

---

## Developer
Conelius Angwenyi
Project link: [https://github.com/Cornelke/Trancent-Youtube-Downloader.git]

## Features

* Paste a YouTube link to preview video info (title, thumbnail, duration)
* View and select from all available video/audio formats and resolutions
* Download the chosen format directly to your device
* Backend uses `yt-dlp` and `ffmpeg` for robust, high-quality downloads
* Temporary file storage with auto-cleanup
* Supports authentication via YouTube cookies for restricted videos

---

## Tech Stack

* **Frontend:** React, Vite, TypeScript, shadcn-ui, Tailwind CSS
* **Backend:** Node.js, Express, yt-dlp, ffmpeg
* **Deployment:**  
   * Frontend: Vercel  
   * Backend: Render (Docker)

---

## Local Development Setup

### 1. Clone the Repository

```sh
git clone https://github.com/Cornelke/Trancent-Youtube-Downloader.git
cd Trancent-Youtube-Downloader
```

### 2. Frontend Setup

```sh
cd Trancent-Youtube-Downloader # if not already there
npm install
```

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Backend Setup

```sh
cd backend
npm install
```

#### Download yt-dlp and ffmpeg (Windows)

* Download `yt-dlp.exe` from yt-dlp releases and place it in the `backend` folder.
* Download `ffmpeg.exe` and `ffprobe.exe` from FFmpeg builds and place them in the `backend` folder.

#### (Optional) Add YouTube Cookies for Authentication

* Use a browser extension like Get cookies.txt to export your YouTube cookies while logged in.
* Its recommended you use separate youtube account as it has risks of being banned
* Save the file as `youtube.com_cookies.txt` and place it in the `backend` folder.

#### Backend Environment Variables

Create a `.env` file in the `backend` folder:

```
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 4. Running Locally

* **Start the backend:**  
cd backend  
npm run dev
* **Start the frontend:**  
cd ..  
npm run dev
* Open [http://localhost:5173](http://localhost:5173) (or your Vite port) in your browser.

---

## Production Deployment

### Frontend (Vercel)

* Push your code to GitHub.
* Import the repo in Vercel, set the root as the project root, and set the environment variable `VITE_API_BASE_URL` to your Render backend URL.
* Deploy.

### Backend (Render)

* Push your code to GitHub.
* Create a new **Web Service** on Render, set the root directory to `backend`, and select Docker as the runtime.
* Add environment variables:  
   * `FRONTEND_URL` (your Vercel frontend URL)
* Render will build using the included Dockerfile (which installs yt-dlp and ffmpeg automatically).
* For YouTube cookies, add a secret file or environment variable as needed (see code for details).

---

## Notes

* **Legal:** This project is for personal use only. Downloading YouTube videos may violate YouTube's Terms of Service.
* **Troubleshooting:**  
   * Always use the latest `yt-dlp` and `ffmpeg`.  
   * If you see errors about cookies or missing formats, update your cookies file and/or `yt-dlp`.  
   * For server-side errors, check the Render logs.

---

## Credits

* yt-dlp
* ffmpeg
* shadcn/ui
* Tailwind CSS

---
