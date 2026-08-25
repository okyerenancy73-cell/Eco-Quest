import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Quest } from '../types/navigation';
import { QuestCard } from '../components/ui/QuestCard';
import { Button } from '../components/ui/Button';
import { BeforeAfterQuestVerificationModal } from '../components/ui/BeforeAfterQuestVerificationModal';
import { DiscussionQuestFlowModal } from '../components/verification/DiscussionQuestFlowModal';
import { ParticipantCheckInModal } from '../components/verification/ParticipantCheckInModal';
import { VerificationDetailsModal } from '../components/verification/VerificationDetailsModal';
import { VerificationRulesOverview } from '../components/verification/VerificationRulesOverview';
import { VerificationEngine } from '../services/verificationEngine';
import { VerificationStatus } from '../types/verification';
import { Sparkles, Filter, Award, Users, QrCode, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const QuestsPage: React.FC = () => {
  const { addEcoPoints } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  // Modals state
  const [discussionModalQuest, setDiscussionModalQuest] = useState<Quest | null>(null);
  const [photoVerificationQuest, setPhotoVerificationQuest] = useState<Quest | null>(null);
  const [detailsModalQuest, setDetailsModalQuest] = useState<Quest | null>(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 'q_educate_neighbours',
      title: 'Educate Your Neighbours on Sanitation',
      description: 'Host an informal discussion session with 3+ neighbours on waste sorting, drain maintenance, or recycling.',
      category: 'Environmental Awareness',
      difficulty: 'Medium',
      ecoPoints: 200,
      estimatedTime: '20 mins',
      status: 'available',
      verificationType: 'discussion-session',
      verificationLevel: 'medium',
      minParticipants: 3,
      suggestedTopics: [
        'Household Waste Sorting & PET Recycling',
        'Keeping Street Gutters & Storm Drains Clear',
        'Reducing Single-Use Plastics in Markets',
      ],
      location: 'Neighbourhood Square / Block Yard',
      impactLabel: 'Spreads hygiene & civic action',
    },
    {
      id: 'q1',
      title: 'Help Clean a Blocked Community Drain',
      description: 'Clear organic sediment and litter from primary stormwater gutters along Main Street to prevent rainy season flooding.',
      category: 'Cleanup',
      difficulty: 'Medium',
      ecoPoints: 150,
      estimatedTime: '30 mins',
      status: 'available',
      verificationType: 'photo-before-after',
      verificationLevel: 'light',
      location: 'Main Street & Market Ave',
      impactLabel: 'Restores drainage flow',
    },
    {
      id: 'q2',
      title: 'Separate Household Plastic & E-Waste',
      description: 'Sort your household recyclables into PET bottles, clean aluminum cans, and dry paper before drop-off.',
      category: 'Waste Disposal',
      difficulty: 'Easy',
      ecoPoints: 80,
      estimatedTime: '15 mins',
      status: 'in-progress',
      verificationType: 'photo-before-after',
      verificationLevel: 'light',
      progressPercentage: 60,
      location: 'Home / Local Recycling Bin',
      impactLabel: 'Diverts 5kg from landfill',
    },
    {
      id: 'q3',
      title: 'Report Illegal Trash Dumping Hotspot',
      description: 'Snap a photo and pin an uncollected waste heap in your neighborhood using our report tool.',
      category: 'Environmental Reporting',
      difficulty: 'Easy',
      ecoPoints: 50,
      estimatedTime: '5 mins',
      status: 'completed',
      verificationType: 'photo-before-after',
      verificationLevel: 'light',
      location: 'West End Alleyways',
      impactLabel: 'Alerts municipal team',
    },
    {
      id: 'q4',
      title: 'Organize Neighborhood Tree Care Day',
      description: 'Water and prune 5 young street saplings planted during the greening initiative.',
      category: 'Community Action',
      difficulty: 'Hard',
      ecoPoints: 200,
      estimatedTime: '45 mins',
      status: 'available',
      verificationType: 'authorized-signoff',
      verificationLevel: 'strong',
      location: 'Civic Park & Greenway',
      impactLabel: 'Improves urban canopy',
    },
  ]);

  // Sync statuses with VerificationEngine
  const refreshQuestStatuses = () => {
    setQuests((prev) =>
      prev.map((q) => {
        const rec = VerificationEngine.getRecordForQuest(q.id);
        if (rec) {
          return {
            ...q,
            status: rec.status as VerificationStatus,
          };
        }
        return q;
      })
    );
  };

  useEffect(() => {
    refreshQuestStatuses();
  }, []);

  const categories = [
    'All',
    'Environmental Awareness',
    'Cleanup',
    'Waste Disposal',
    'Environmental Reporting',
    'Community Action',
  ];

  const filteredQuests =
    categoryFilter === 'All' ? quests : quests.filter((q) => q.category === categoryFilter);

  const handleStartQuest = (quest: Quest) => {
    if (quest.verificationType === 'discussion-session') {
      setDiscussionModalQuest(quest);
    } else {
      setQuests((prev) =>
        prev.map((q) => (q.id === quest.id ? { ...q, status: 'in-progress', progressPercentage: 20 } : q))
      );
      setPhotoVerificationQuest({ ...quest, status: 'in-progress' });
    }
  };

  const handleCompletePhotoQuest = (questId: string, ecoPoints: number) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'verified', progressPercentage: 100 } : q))
    );
    addEcoPoints(ecoPoints);
    setPhotoVerificationQuest(null);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D9E6DD]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32] bg-[#2E7D32]/10 px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Civic & Environmental Quests</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">
            Available EcoQuests
          </h1>
          <p className="text-xs sm:text-sm text-[#1F2937]/75">
            Take real-world environmental action, complete multi-signal verifications, and earn EcoPoints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            id="btn-participant-checkin"
            size="sm"
            variant="outline"
            onClick={() => setIsCheckInModalOpen(true)}
            icon={<QrCode className="w-4 h-4 text-[#2E7D32]" />}
          >
            Participant Check-in (ECO-XXXX)
          </Button>

          <div className="p-2.5 rounded-2xl bg-[#2E7D32]/10 text-[#2E7D32] font-bold text-xs flex items-center gap-2 border border-[#2E7D32]/20">
            <Award className="w-4 h-4 text-[#2E7D32]" />
            <span>{quests.filter((q) => q.status === 'verified' || q.status === 'completed').length} Verified Today</span>
          </div>
        </div>
      </div>

      {/* Verification Rules Overview Card */}
      <VerificationRulesOverview />

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-[#1F2937]/50 shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === cat
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'bg-white text-[#1F2937]/80 border border-[#D9E6DD] hover:border-[#2E7D32]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            featured={quest.id === 'q_educate_neighbours'}
            onStart={(q) => handleStartQuest(q)}
            onComplete={(q) => {
              if (q.verificationType === 'discussion-session') {
                setDiscussionModalQuest(q);
              } else {
                setPhotoVerificationQuest(q);
              }
            }}
            onViewVerification={(q) => setDetailsModalQuest(q)}
          />
        ))}
      </div>

      {/* Discussion Quest Flow Modal ("Educate Your Neighbours") */}
      <DiscussionQuestFlowModal
        quest={discussionModalQuest}
        isOpen={!!discussionModalQuest}
        onClose={() => {
          setDiscussionModalQuest(null);
          refreshQuestStatuses();
        }}
        onStatusUpdated={() => {
          refreshQuestStatuses();
        }}
      />

      {/* BEFORE & AFTER Photo Verification Modal */}
      <BeforeAfterQuestVerificationModal
        quest={photoVerificationQuest}
        isOpen={!!photoVerificationQuest}
        onClose={() => {
          setPhotoVerificationQuest(null);
          refreshQuestStatuses();
        }}
        onCompleteWithVerification={handleCompletePhotoQuest}
      />

      {/* Participant Check-in Modal (Public QR / ECO-XXXX) */}
      <ParticipantCheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => {
          setIsCheckInModalOpen(false);
          refreshQuestStatuses();
        }}
      />

      {/* Verification Details Modal (Signals Breakdown & Steward Console) */}
      {detailsModalQuest && (
        <VerificationDetailsModal
          questId={detailsModalQuest.id}
          questTitle={detailsModalQuest.title}
          rewardPoints={detailsModalQuest.ecoPoints}
          isOpen={!!detailsModalQuest}
          onClose={() => {
            setDetailsModalQuest(null);
            refreshQuestStatuses();
          }}
          onRecordUpdated={() => {
            refreshQuestStatuses();
          }}
        />
      )}
    </div>
  );
};
