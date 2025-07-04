import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Monitor, Headphones, Download } from 'lucide-react';
import { SelectItem } from "@/components/ui/select";

interface Format {
  format_id: string;
  resolution: string;
  ext: string;
  filesize?: number;
  acodec: string;
  vcodec: string;
  format_note?: string;
}

interface FormatSelectorProps {
  formats: Format[];
  selectedFormat: string | null;
  onFormatSelect: (formatId: string) => void;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ 
  formats, 
  selectedFormat, 
  onFormatSelect 
}) => {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return mb > 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`;
  };

  const getFormatIcon = (format: Format) => {
    if (format.vcodec === 'none') return <Headphones className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const getFormatLabel = (format: Format) => {
    if (format.vcodec === 'none') return 'Audio Only';
    if (format.acodec === 'none') return 'Video Only';
    return 'Video + Audio';
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800">Available Formats</h3>
      
      <div className="grid gap-3 max-h-80 overflow-y-auto">
        {formats.map((format) => (
          <Card
            key={format.format_id}
            className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
              selectedFormat === format.format_id
                ? 'border-primary bg-primary/5 shadow-lg'
                : 'border-gray-200 hover:border-primary/50'
            }`}
            onClick={() => onFormatSelect(format.format_id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  selectedFormat === format.format_id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {getFormatIcon(format)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {format.resolution || format.format_note}
                    </span>
                    <span className="text-sm px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {format.ext.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {format.vcodec !== 'none' && format.acodec !== 'none'
                      ? 'Video + Audio'
                      : format.vcodec !== 'none'
                      ? 'Video Only'
                      : 'Audio Only'}
                  </div>
                </div>
              </div>
              
              {selectedFormat === format.format_id && (
                <div className="flex items-center gap-2 text-primary">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Selected</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FormatSelector;
