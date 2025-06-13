'use client';

import { Bell, Calendar, ChevronLeft, ChevronRight, Search, Sidebar } from 'lucide-react';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Avatar, AvatarFallback } from './ui/avatar';
import EventList from './ui/event-list';
import { useState } from 'react';

export default function AdminDashboard() {
  const [currentMonth] = useState('December');
  const [currentYear] = useState(2021);

  return (
    <div className="flex h-screen bg-[#1e1e38] text-white">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-[#252547]">
          <h1 className="text-xl font-semibold">Events</h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                label="Search here..."
                placeholder="Search here..."
                className="pl-10 bg-[#2a2a4e] border-none rounded-full w-64 text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
            </div>

            <div>
              <Button variant="outline" className="bg-[#6c5dd3] border-none">
                ENGLISH <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{currentMonth}</h2>
                <h2 className="text-xl font-semibold">{currentYear}</h2>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" className="bg-[#2a2a4e] border-none rounded-md">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="outline" className="bg-[#2a2a4e] border-none rounded-md">
                  <ChevronRight className="h-5 w-5" />
                </Button>

                <div className="ml-6">
                  <Button className="bg-[#6c5dd3] hover:bg-[#5a4dbd]">
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarFallback>+</AvatarFallback>
                    </Avatar>
                    New Teachers
                  </Button>
                </div>
              </div>
            </div>

            <Calendar />
          </div>

          <div className="w-80 bg-[#252547] p-4 overflow-y-auto">
            <EventList />
          </div>
        </div>
      </div>
    </div>
  );
}
