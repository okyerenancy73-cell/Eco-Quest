import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { ReportHazardModal } from '../components/ui/ReportHazardModal';
import { EnvironmentalReport } from '../types/navigation';
import { MapPin, Layers, Plus, ThumbsUp, Navigation, Camera } from 'lucide-react';

export const MapPage: React.FC = () => {
  const { addEcoPoints } = useAuth();
  const [activeLayer, setActiveLayer] = useState<string>('All Hazards');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [reports, setReports] = useState<EnvironmentalReport[]>([
    {
      id: 'r1',
      title: 'Severe Gutter Sediment Blockage',
      type: 'Blocked Drain',
      status: 'Under Review',
      severity: 'High',
      location: '4th Avenue & Commerce St',
      reportedAt: '1 hour ago',
      upvotes: 12,
    },
    {
      id: 'r2',
      title: 'Illegal Plastic Waste Dumping Site',
      type: 'Illegal Dumping',
      status: 'Reported',
      severity: 'Critical',
      location: 'Behind Central High School Field',
      reportedAt: '3 hours ago',
      upvotes: 24,
    },
    {
      id: 'r3',
      title: 'Overflowing Municipal Smart Bin',
      type: 'Overflowing Bin',
      status: 'Scheduled Cleanup',
      severity: 'Medium',
      location: 'Greenway Park Entrance',
      reportedAt: '5 hours ago',
      upvotes: 8,
    },
  ]);

  const layers = ['All Hazards', 'Blocked Drains', 'Illegal Dumping', 'Overflowing Bins', 'Flood Risk Areas'];

  const handleUpvote = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  const handleReportSubmitted = (points: number) => {
    addEcoPoints(points);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full mb-1">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>GIS Sanitation & Hazard Map</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Community Environmental Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Locate blocked drains, reported illegal dumping, and active community cleanup zones in real time.
          </p>
        </div>

        <Button
          id="btn-map-report-hazard"
          variant="primary"
          onClick={() => setIsReportModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Report Hazard (Photo)
        </Button>
      </div>

      {/* Layer Controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Layers className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
        {layers.map((layer) => (
          <button
            key={layer}
            type="button"
            onClick={() => setActiveLayer(layer)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeLayer === layer
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-teal-300'
            }`}
          >
            {layer}
          </button>
        ))}
      </div>

      {/* Map Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Canvas Container */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-900 text-white p-6 relative min-h-[420px] flex flex-col justify-between overflow-hidden border border-slate-800 shadow-xl">
          {/* Simulated Map Grid Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          {/* Top Map Bar */}
          <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
              <Navigation className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold text-slate-200">District 4 &bull; Main Civic Sector</span>
            </div>

            <div className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              Live Map Overlay: <span className="text-teal-400 font-bold">{activeLayer}</span>
            </div>
          </div>

          {/* Map Pin Highlights */}
          <div className="relative z-10 my-auto py-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto w-full">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-2xl bg-slate-800/90 backdrop-blur-md border border-slate-700/80 shadow-lg text-left space-y-2 hover:border-teal-500/60 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold">
                    {report.type}
                  </span>
                  <span className="text-slate-400">{report.reportedAt}</span>
                </div>

                <div className="font-bold text-sm text-white line-clamp-1">{report.title}</div>
                
                <div className="text-xs text-slate-300 flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="truncate">{report.location}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Camera className="w-3 h-3 text-emerald-400" />
                    Photo Attached
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUpvote(report.id)}
                    className="flex items-center gap-1 text-slate-300 hover:text-teal-300 font-medium"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{report.upvotes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Map Footer Notice */}
          <div className="relative z-10 text-[11px] text-slate-400 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 flex items-center justify-between">
            <span>GIS Map Engine Active &bull; Geotagged photo reports verified</span>
            <span className="text-teal-400 font-semibold">3 Active Incidents</span>
          </div>
        </div>

        {/* Hazard List Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-left space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Reported Community Hazards
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Citizens snap photos of hazards and upvote issues to prioritize municipal response.
            </p>

            <div className="space-y-3 pt-2">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{rep.type}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {rep.severity} Severity
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300">{rep.title}</p>
                  <div className="text-[11px] text-slate-400">{rep.location}</div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      Geotag Verified
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpvote(rep.id)}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold flex items-center gap-1 hover:bg-teal-100"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{rep.upvotes} Upvotes</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* REPORT HAZARD MODAL (WITH CAMERA & PHOTO ATTACHMENT) */}
      <ReportHazardModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitSuccess={handleReportSubmitted}
      />
    </div>
  );
};

