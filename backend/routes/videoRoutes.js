const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const downloadsDir = path.join(__dirname, '..', 'downloads');

// Construct the path to the local yt-dlp executable
const ytDlpPath = process.platform === 'win32'
  ? path.join(__dirname, '..', 'yt-dlp.exe')
  : 'yt-dlp'; // On Linux/Mac, we assume it's in the PATH for the Docker container

// Path to cookies file
const cookiesPath = path.join(__dirname, '..', 'youtube.com_cookies.txt');
const cookiesOption = fs.existsSync(cookiesPath) ? ` --cookies "${cookiesPath}"` : '';

// POST /api/info
router.post('/info', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const command = `"${ytDlpPath}" -j${cookiesOption} "${url}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('yt-dlp error:', stderr);
      return res.status(500).json({ error: 'Failed to fetch video information', details: stderr });
    }
    try {
      const metadata = JSON.parse(stdout);
      const { title, thumbnail, duration, formats } = metadata;
      const filteredFormats = formats.map(f => ({
        format_id: f.format_id,
        ext: f.ext,
        resolution: f.resolution || f.format_note,
        filesize: f.filesize,
        acodec: f.acodec,
        vcodec: f.vcodec,
      }));
      res.json({ title, thumbnail, duration, formats: filteredFormats });
    } catch (e) {
      console.error('JSON Parse error:', e);
      res.status(500).json({ error: 'Failed to parse video information' });
    }
  });
});

// POST /api/download
router.post('/download', (req, res) => {
  const { url, formatId } = req.body;
  if (!url || !formatId) {
    return res.status(400).json({ error: 'URL and formatId are required' });
  }

  const sanitizedFilename = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  const outputPath = path.join(downloadsDir, `${sanitizedFilename}.%(ext)s`);
  const command = `"${ytDlpPath}" -f "${formatId}"${cookiesOption} -o "${outputPath}" "${url}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('yt-dlp download error:', stderr);
      return res.status(500).json({ error: 'Failed to download video.', details: stderr });
    }

    fs.readdir(downloadsDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Could not read downloads directory.' });
      }
      const downloadedFile = files.find(file => file.startsWith(sanitizedFilename));
      if (!downloadedFile) {
        return res.status(500).json({ error: 'Downloaded file not found.' });
      }
      res.json({ downloadPath: `/videos/${downloadedFile}` });

      const fullPath = path.join(downloadsDir, downloadedFile);
      setTimeout(() => {
        fs.unlink(fullPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting file ${fullPath}:`, unlinkErr);
          } else {
            console.log(`Successfully deleted temporary file: ${fullPath}`);
          }
        });
      }, 10 * 60 * 1000);
    });
  });
});

module.exports = router; 