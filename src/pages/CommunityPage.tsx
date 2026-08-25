import React, { useState } from 'react';
import { CommunityEvent } from '../types/navigation';
import { Button } from '../components/ui/Button';
import { Users, Calendar, MapPin, Award, CheckCircle2, Heart, MessageSquare, Sparkles } from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const [events, setEvents] = useState<CommunityEvent[]>([
    {
      id: 'e1',
      title: 'Saturday District Drainage & River Cleanup',
      organizer: 'EcoQuest Youth Alliance',
      date: 'This Saturday, Aug 16',
      time: '8:00 AM - 11:00 AM',
      location: 'Central Canal Bridge',
      participantsCount: 38,
      maxParticipants: 50,
      ecoPointsReward: 250,
      isUserRSVPd: true,
      category: 'Sanitation Drive',
    },
    {
      id: 'e2',
      title: 'Plastic Waste Sorting & Recycling Workshop',
      organizer: 'Green City NGO',
      date: 'Sunday, Aug 17',
      time: '10:00 AM - 12:00 PM',
      location: 'Community Hall Ward 4',
      participantsCount: 22,
      maxParticipants: 40,
      ecoPointsReward: 150,
      isUserRSVPd: false,
      category: 'Workshop',
    },
    {
      id: 'e3',
      title: 'Neighborhood Tree Planting & Gutter Care',
      organizer: 'Civic Climate Club',
      date: 'Next Saturday, Aug 23',
      time: '9:00 AM - 12:00 PM',
      location: 'Greenway Park Entrance',
      participantsCount: 45,
      maxParticipants: 60,
      ecoPointsReward: 300,
      isUserRSVPd: false,
      category: 'Greening',
    },
  ]);

  const toggleRSVP = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const nextRSVP = !e.isUserRSVPd;
          return {
            ...e,
            isUserRSVPd: nextRSVP,
            participantsCount: nextRSVP ? e.participantsCount + 1 : e.participantsCount - 1,
          };
        }
        return e;
      })
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Civic Volunteer & Community Network</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Community Environmental Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Connect with local volunteers, join drainage cleanups, and track district environmental rankings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center gap-2 border border-sky-500/20">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>District #4 Ranked 2nd Citywide</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Events Feed Column */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Upcoming Community Cleanups & Events
          </h2>

          <div className="space-y-4">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-sky-300 dark:hover:border-sky-800 transition-all"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300">
                    {evt.category}
                  </span>

                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
                    +{evt.ecoPointsReward} PTS
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{evt.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Organized by {evt.organizer}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>{evt.date} &bull; {evt.time}</span>
                  </div>

                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-500 font-medium">
                    <span className="font-bold text-slate-900 dark:text-white">{evt.participantsCount}</span> / {evt.maxParticipants} Volunteers Joined
                  </div>

                  <Button
                    id={`btn-rsvp-${evt.id}`}
                    size="sm"
                    variant={evt.isUserRSVPd ? 'outline' : 'primary'}
                    onClick={() => toggleRSVP(evt.id)}
                    icon={evt.isUserRSVPd ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Users className="w-4 h-4" />}
                  >
                    {evt.isUserRSVPd ? 'RSVP Confirmed' : 'Join Activity (+250 PTS)'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Leaderboard Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-left space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                District Leaderboard
              </h3>
              <Award className="w-4 h-4 text-amber-500" />
            </div>

            <div className="space-y-2.5">
              {[
                { rank: 1, name: 'Kwame Mensah', points: '3,420 PTS', badge: 'Civic Hero' },
                { rank: 2, name: 'Ama Boateng (You)', points: '1,250 PTS', badge: 'Green Guardian', isUser: true },
                { rank: 3, name: 'Kofi Osei', points: '1,180 PTS', badge: 'Drain Defender' },
                { rank: 4, name: 'Abena Appiah', points: '950 PTS', badge: 'Zero Waste' },
              ].map((user) => (
                <div
                  key={user.rank}
                  className={`p-3 rounded-xl flex items-center justify-between text-xs transition-colors ${
                    user.isUser
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold flex items-center justify-center text-[10px]">
                      #{user.rank}
                    </span>
                    <div>
                      <div className="text-slate-900 dark:text-white">{user.name}</div>
                      <div className="text-[10px] text-slate-400">{user.badge}</div>
                    </div>
                  </div>

                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{user.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
