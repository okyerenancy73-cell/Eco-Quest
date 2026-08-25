import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AppRoute, Quest } from '../types/navigation';
import { StatCard } from '../components/ui/StatCard';
import { QuestCard } from '../components/ui/QuestCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { ReportHazardModal } from '../components/ui/ReportHazardModal';
import { BeforeAfterQuestVerificationModal } from '../components/ui/BeforeAfterQuestVerificationModal';
import {
  Sparkles,
  Award,
  Trophy,
  AlertTriangle,
  MapPin,
  Users,
  CheckCircle2,
  ArrowRight,
  Droplets,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user, addEcoPoints } = useAuth();

  // Featured Quest State
  const [featuredQuest, setFeaturedQuest] = useState<Quest>({
    id: 'quest-today-1',
    title: 'Help Clean a Blocked Community Drain',
    description:
      'Clear organic sediment and litter from primary stormwater gutters along Main Street to reduce flash flooding hazards before the rainy cycle.',
    category: 'Cleanup',
    difficulty: 'Medium',
    ecoPoints: 150,
    estimatedTime: '30 mins',
    status: 'available',
    location: 'Main Street & Market Intersection',
    impactLabel: 'Prevents local street runoff stagnation',
  });

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [verificationQuest, setVerificationQuest] = useState<Quest | null>(null);

  const userName = user?.fullName ? user.fullName.split(' ')[0] : 'Ama';

  const handleStartFeaturedQuest = () => {
    setFeaturedQuest((prev) => ({
      ...prev,
      status: 'in-progress',
      progressPercentage: 25,
    }));
    setVerificationQuest(featuredQuest);
  };

  const handleCompleteQuestWithVerification = (questId: string, ecoPoints: number) => {
    setFeaturedQuest((prev) => ({
      ...prev,
      status: 'completed',
      progressPercentage: 100,
    }));
    addEcoPoints(ecoPoints);
    setVerificationQuest(null);
  };

  const handleReportSubmitted = (points: number) => {
    addEcoPoints(points);
  };

  return (
    <div className="space-y-6 text-left">
      {/* 1. Hero / Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl overflow-hidden border border-emerald-500/30">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Civic Climate Action & Sanitation</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Hello, {userName}! Let's make a difference today. 👋
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Level {user?.level || 5} Guardian &bull; Your community environmental actions keep gutters clear, reduce flood risks, and earn community rewards.
            </p>
          </div>

          {/* Quick Level Card */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 min-w-[260px] space-y-2 text-white">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                Level {user?.level || 5} — Green Guardian
              </span>
              <span className="text-emerald-300">{user?.ecoPoints || 1250} PTS</span>
            </div>

            <ProgressBar value={70} color="gradient" showPercentage size="sm" />

            <div className="flex items-center justify-between text-[11px] text-emerald-200/90 font-medium">
              <span>Next Level: Civic Leader</span>
              <span>350 PTS to go</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-ecopoints"
          title="EcoPoints Balance"
          value={`${user?.ecoPoints || 1250} PTS`}
          subtitle="Lifetime earned"
          trend={{ value: "+150 this week", isPositive: true }}
          icon={<Award className="w-6 h-6" />}
          iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          onClick={() => onNavigate("profile")}
        />

        <StatCard
          id="stat-completed-quests"
          title="Completed Quests"
          value="18"
          subtitle="4 sanitation, 14 recycling"
          trend={{ value: "94% success rate", isPositive: true }}
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconBgColor="bg-teal-500/10 text-teal-600 dark:text-teal-400"
          onClick={() => onNavigate("quests")}
        />

        <StatCard
          id="stat-reports-filed"
          title="Issues Reported"
          value="6"
          subtitle="5 resolved by municipality"
          trend={{ value: "83% resolved", isPositive: true }}
          icon={<AlertTriangle className="w-6 h-6" />}
          iconBgColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          onClick={() => setIsReportModalOpen(true)}
        />

        <StatCard
          id="stat-community-events"
          title="Community Level"
          value={`Rank #${user?.level ? user.level * 2 : 12}`}
          subtitle="In your local district"
          trend={{ value: "Top 5% Eco Leader", isPositive: true }}
          icon={<Users className="w-6 h-6" />}
          iconBgColor="bg-sky-500/10 text-sky-600 dark:text-sky-400"
          onClick={() => onNavigate("community")}
        />
      </div>

      {/* 3. Today's EcoQuest Featured Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Today's Featured EcoQuest
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Take BEFORE & AFTER pictures to verify your impact and earn points!
            </p>
          </div>

          <Button
            id="btn-goto-all-quests"
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('quests')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Browse All Quests
          </Button>
        </div>

        <QuestCard
          featured
          quest={featuredQuest}
          onStart={handleStartFeaturedQuest}
          onComplete={() => setVerificationQuest(featuredQuest)}
        />
      </div>

      {/* 4. Quick Actions */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Quick Actions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Take immediate civic or environmental action in your community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button
            id="btn-quick-report"
            variant="outline"
            onClick={() => setIsReportModalOpen(true)}
            icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
            className="justify-center py-3"
          >
            Report Hazard (Photo)
          </Button>

          <Button
            id="btn-quick-quests"
            variant="outline"
            onClick={() => onNavigate('quests')}
            icon={<Sparkles className="w-4 h-4 text-emerald-500" />}
            className="justify-center py-3"
          >
            Start an EcoQuest
          </Button>

          <Button
            id="btn-quick-map"
            variant="outline"
            onClick={() => onNavigate('map')}
            icon={<MapPin className="w-4 h-4 text-teal-500" />}
            className="justify-center py-3"
          >
            View Hazard Map
          </Button>

          <Button
            id="btn-quick-community"
            variant="outline"
            onClick={() => onNavigate('community')}
            icon={<Users className="w-4 h-4 text-sky-500" />}
            className="justify-center py-3"
          >
            Join Cleanup Activity
          </Button>
        </div>
      </div>

      {/* 5. Activity Feeds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Recent Activity</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your completed actions and point logs</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
              Live Log
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Completed Drainage Clearance (Photo Verified)',
                points: '+150 PTS',
                time: '2 hours ago',
                category: 'Sanitation',
                icon: <Droplets className="w-4 h-4 text-teal-500" />,
              },
              {
                title: 'Reported Overflowing Waste Bin with Photo',
                points: '+50 PTS',
                time: 'Yesterday',
                category: 'Reporting',
                icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
              },
              {
                title: 'Earned Badge: Drain Defender',
                points: 'Achievement',
                time: '3 days ago',
                category: 'Badge',
                icon: <Trophy className="w-4 h-4 text-emerald-500" />,
              },
            ].map((act, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs">{act.icon}</div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{act.title}</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">{act.time}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-emerald-600 dark:text-emerald-400">{act.points}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">{act.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Impact Stats */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Your Environmental Impact</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Verified progress from completed quests</p>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                <span>Stormwater Flow Restored</span>
                <span className="font-bold">420 Liters / min</span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Calculated from 4 cleared street gutters in your neighbourhood.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/50 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-teal-900 dark:text-teal-200">
                <span>Plastic Waste Diverted</span>
                <span className="font-bold">38.5 kg</span>
              </div>
              <p className="text-[11px] text-teal-700 dark:text-teal-400">
                Segregated and handed over to verified community recycling points.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span>Civic Verification Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Verified Member</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                All reported issues and completed quests are validated by BEFORE & AFTER photo evidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REPORT HAZARD MODAL (WITH CAMERA / PHOTO ATTACHMENT) */}
      <ReportHazardModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitSuccess={handleReportSubmitted}
      />

      {/* BEFORE / AFTER QUEST VERIFICATION MODAL */}
      <BeforeAfterQuestVerificationModal
        quest={verificationQuest}
        isOpen={!!verificationQuest}
        onClose={() => setVerificationQuest(null)}
        onCompleteWithVerification={handleCompleteQuestWithVerification}
      />
    </div>
  );
};

