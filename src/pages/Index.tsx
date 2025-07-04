import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Download, Play, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import FormatSelector from "@/components/FormatSelector";

interface Format {
  format_id: string;
  resolution: string;
  ext: string;
  filesize?: number;
  acodec: string;
  vcodec: string;
}

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  video_url: string;
  formats: Format[];
}

const Index = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [error, setError] = useState('');

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = new RegExp("^(https?://)?(www\\.)?(youtube\\.com/(watch\\?v=|embed/|v/)|youtu\\.be/)[\\w-]+");
    return youtubeRegex.test(url);
  };

  const extractVideoId = (url: string) => {
    const match = url.match(new RegExp("(?:youtube\\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\\.be/)([^\"&?/\\s]{11})"));
    return match ? match[1] : null;
  };

  const fetchVideoInfo = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setVideoInfo(null);
    setSelectedFormat(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch video information');
      }

      const data = await response.json();
      setVideoInfo({ ...data, video_url: url });
      toast({
        title: "Video info fetched successfully!",
        description: "Choose a format to download",
      });
    } catch (err) {
      setError('Failed to fetch video information. Please check the URL and try again.');
      toast({
        title: "Error",
        description: "Failed to fetch video information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadVideo = async () => {
    if (!videoInfo || !selectedFormat) return;

    setIsDownloading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: videoInfo.video_url,
          formatId: selectedFormat
        })
      });

      if (!response.ok) {
        throw new Error('Failed to prepare download');
      }

      const { downloadPath } = await response.json();
      const downloadUrl = `${import.meta.env.VITE_API_BASE_URL}${downloadPath}`;
      
      // Trigger download in browser
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = ''; // Let the browser determine the filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: "Download started!",
        description: "Your video is downloading.",
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Unable to prepare download. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchVideoInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            YouTube Downloader
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Download your favorite YouTube videos with ease. Simply paste the URL and get started.
          </p>
        </div>

        {/* Main Card */}
        <Card className="max-w-4xl mx-auto p-6 md:p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm animate-scale-in">
          {/* URL Input Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <label htmlFor="youtube-url" className="block text-lg font-semibold text-gray-700">
                YouTube Video URL
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  id="youtube-url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError('');
                  }}
                  onKeyPress={handleKeyPress}
                  className="flex-1 h-12 text-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  disabled={isLoading}
                />
                <Button
                  onClick={fetchVideoInfo}
                  disabled={isLoading || !url.trim()}
                  className="h-12 px-8 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Fetch Video
                    </>
                  )}
                </Button>
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8 animate-fade-in">
                <div className="inline-flex items-center gap-3 text-primary">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-lg">Fetching video information...</span>
                </div>
              </div>
            )}

            {/* Video Preview */}
            {videoInfo && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Video Preview</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Thumbnail */}
                    <div className="space-y-4">
                      <div className="relative overflow-hidden rounded-lg shadow-lg group">
                        <img
                          src={videoInfo.thumbnail}
                          alt="Video thumbnail"
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/480x360/0047AB/FFFFFF?text=Video+Thumbnail';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Title</h4>
                        <p className="text-gray-900 leading-relaxed">{videoInfo.title}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Duration</h4>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                          {videoInfo.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Format Selection */}
                  <div className="mt-8">
                    <FormatSelector
                      formats={videoInfo.formats}
                      selectedFormat={selectedFormat}
                      onFormatSelect={setSelectedFormat}
                    />
                  </div>

                  {/* Download Button */}
                  {selectedFormat && (
                    <div className="mt-6 animate-fade-in">
                      <Button
                        onClick={downloadVideo}
                        disabled={isDownloading}
                        className="w-full h-12 bg-accent hover:bg-accent-600 text-accent-foreground font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 disabled:opacity-50"
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Preparing Download...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            Download Selected Format
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* YouTube Embed Preview */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Preview</h4>
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                      <iframe
                        src={`https://www.youtube.com/embed/${extractVideoId(videoInfo.video_url)}`}
                        title="YouTube video player"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>For personal use only. Please respect copyright and YouTube's terms of service.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
