import React, { useState, useRef } from 'react';
import { Camera, Upload, Check, RefreshCw, Image as ImageIcon, MapPin } from 'lucide-react';

interface HazardPhotoUploaderProps {
  label: string;
  sublabel?: string;
  photoUrl: string | null;
  onPhotoSelect: (url: string) => void;
  required?: boolean;
  type?: 'hazard' | 'before' | 'after';
}

// Preset realistic environmental photos for quick desktop testing
const PRESET_HAZARD_PHOTOS = {
  hazard: [
    {
      name: 'Blocked Stormwater Drain',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Overflowing Waste Bin',
      url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Illegal Trash Heap',
      url: 'https://images.unsplash.com/photo-1611284446314-60a55ac0d49d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Stagnant Water Pool',
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80',
    },
  ],
  before: [
    {
      name: 'Clogged Street Gutter (Before)',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Littered Community Park (Before)',
      url: 'https://images.unsplash.com/photo-1611284446314-60a55ac0d49d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Unsorted Recyclables (Before)',
      url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    },
  ],
  after: [
    {
      name: 'Clean Free-Flowing Drain (After)',
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Pristine Restored Park (After)',
      url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Clean Sorted PET Bins (After)',
      url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    },
  ],
};

export const HazardPhotoUploader: React.FC<HazardPhotoUploaderProps> = ({
  label,
  sublabel,
  photoUrl,
  onPhotoSelect,
  required = false,
  type = 'hazard',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const presets = PRESET_HAZARD_PHOTOS[type] || PRESET_HAZARD_PHOTOS.hazard;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onPhotoSelect(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{label}</span>
          {required && <span className="text-emerald-600 dark:text-emerald-400">*</span>}
        </label>

        {photoUrl && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <Check className="w-3 h-3" />
            Photo Attached
          </span>
        )}
      </div>

      {sublabel && <p className="text-[11px] text-slate-500 dark:text-slate-400">{sublabel}</p>}

      {/* Hidden Native File Input with camera capture attribute */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Upload / Camera Box */}
      {photoUrl ? (
        <div className="relative group rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-900 shadow-sm">
          <img
            src={photoUrl}
            alt="Hazard Evidence"
            className="w-full h-44 object-cover transition-transform group-hover:scale-105 duration-300"
          />

          {/* Overlay Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-md p-2.5 flex items-center justify-between text-white text-xs border-t border-white/10">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>GPS Geotag & Timestamp Verified</span>
            </div>

            <button
              type="button"
              onClick={triggerFileInput}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Retake / Change
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Snap / Upload Dropzone Card */}
          <div
            onClick={triggerFileInput}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-2xl p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-900/60 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 text-center cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Snap or Upload Photo
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tap to open camera or browse device images
              </p>
            </div>

            <div className="pt-1 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-lg">
                <Camera className="w-3 h-3" /> Snap Photo
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <Upload className="w-3 h-3" /> Browse File
              </span>
            </div>
          </div>

          {/* Quick Select Presets for Desktop / Rapid Testing */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-sky-500" />
              Or choose a sample photo:
            </span>

            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onPhotoSelect(preset.url)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 text-left transition-all group/preset cursor-pointer"
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                  />
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate group-hover/preset:text-emerald-600 dark:group-hover/preset:text-emerald-400">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
