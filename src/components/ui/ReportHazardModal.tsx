import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { FormInput } from './FormInput';
import { HazardPhotoUploader } from './HazardPhotoUploader';
import { AlertTriangle, MapPin, Send, CheckCircle2 } from 'lucide-react';

interface ReportHazardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (points: number) => void;
}

export const ReportHazardModal: React.FC<ReportHazardModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Blocked Stormwater Drain');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;

    setIsSuccess(true);
    if (onSubmitSuccess) {
      onSubmitSuccess(50);
    }

    setTimeout(() => {
      handleReset();
    }, 2000);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setTitle('');
    setLocation('');
    setDescription('');
    setPhotoUrl(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Report Sanitation or Environmental Hazard"
      subtitle="Take or attach a picture to alert municipal stewards and community members"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            Hazard Report Logged (+50 PTS)
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
            Your reported hazard with photo evidence has been posted to the Sanitation Map. Nearby citizens and municipal cleanup teams have been notified.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <FormInput
            id="hazard-report-title"
            label="Hazard Title"
            placeholder="e.g. Blocked Gutter Overflow on 4th St"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
          />

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Hazard Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Blocked Stormwater Drain">Blocked Stormwater Drain</option>
              <option value="Illegal Trash Dumping">Illegal Trash Dumping Site</option>
              <option value="Overflowing Waste Bin">Overflowing Garbage Bin</option>
              <option value="Stagnant Water Pool">Stagnant Water Pool / Mosquito Breeding</option>
              <option value="Plastic Accumulation">Plastic Waste Accumulation</option>
            </select>
          </div>

          <FormInput
            id="hazard-report-location"
            label="Street Location or Landmark"
            placeholder="e.g. Corner of 4th Ave & Market Street"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            icon={<MapPin className="w-4 h-4 text-emerald-600" />}
          />

          {/* HAZARD PHOTO ATTACHMENT */}
          <HazardPhotoUploader
            label="Take / Attach Picture of Hazard"
            sublabel="Snap a photo of the hazard to verify location and severity"
            photoUrl={photoUrl}
            onPhotoSelect={(url) => setPhotoUrl(url)}
            required
            type="hazard"
          />

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Additional Details / Severity Notes
            </label>
            <textarea
              rows={2}
              placeholder="Describe water depth, odor, blockage level or immediate risk..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleReset}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!title || !location}
              icon={<Send className="w-4 h-4" />}
            >
              Submit Report (+50 PTS)
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
