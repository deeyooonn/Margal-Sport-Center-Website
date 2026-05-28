import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle } from
'lucide-react';
import { toast } from 'sonner';
// Types
type SlotStatus = 'available' | 'booked' | 'selected';
interface TimeSlot {
  id: string;
  timeLabel: string;
  hour: number;
  rate: number;
  status: SlotStatus;
}
// Helpers
const getDaysInMonth = (year: number, month: number) =>
new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) =>
new Date(year, month, 1).getDay();
const DAY_RATE = 300; // 8AM - 6PM
const NIGHT_RATE = 400; // 6PM - 12MN
export function Booking() {
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // Slots State
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  // UI State
  const [isConfirming, setIsConfirming] = useState(false);
  // Generate Calendar Days
  const daysInMonth = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const firstDay = getFirstDayOfMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'];

  const handlePrevMonth = () =>
  setCurrentDate(
    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
  );
  const handleNextMonth = () =>
  setCurrentDate(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
  );
  // Generate Slots for selected date (Mocking availability based on date string to be consistent)
  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      setSelectedSlotIds([]);
      return;
    }
    const seed = selectedDate.getDate() + selectedDate.getMonth();
    const newSlots: TimeSlot[] = [];
    // 8 AM (8) to 11 PM (23) -> 16 slots
    for (let i = 8; i <= 23; i++) {
      const isNight = i >= 18; // 6 PM onwards
      const rate = isNight ? NIGHT_RATE : DAY_RATE;
      // Format time label (e.g., "8:00 AM - 9:00 AM")
      const startAmPm = i >= 12 ? 'PM' : 'AM';
      const startHour12 = i > 12 ? i - 12 : i === 0 ? 12 : i;
      const endHour = i + 1;
      const endAmPm = endHour >= 12 && endHour < 24 ? 'PM' : 'AM';
      const endHour12 =
      endHour > 12 ? endHour - 12 : endHour === 24 ? 12 : endHour;
      const timeLabel = `${startHour12}:00 ${startAmPm} - ${endHour12}:00 ${endAmPm}`;
      // Pseudo-random booking status
      const isBooked = seed * i % 7 === 0 || seed * i % 5 === 0;
      newSlots.push({
        id: `${selectedDate.toISOString().split('T')[0]}-${i}`,
        timeLabel,
        hour: i,
        rate,
        status: isBooked ? 'booked' : 'available'
      });
    }
    setSlots(newSlots);
    setSelectedSlotIds([]); // Reset selection on new date
  }, [selectedDate]);
  const handleSlotClick = (slotId: string) => {
    const slot = slots.find((s) => s.id === slotId);
    if (!slot || slot.status === 'booked') return;
    setSelectedSlotIds((prev) => {
      if (prev.includes(slotId)) {
        return prev.filter((id) => id !== slotId);
      } else {
        // Enforce consecutive selection (optional, but good UX)
        if (prev.length > 0) {
          const newSlotHour = parseInt(slotId.split('-')[3]); // Extract hour from ID
          const existingHours = prev.map((id) => parseInt(id.split('-')[3]));
          const minHour = Math.min(...existingHours);
          const maxHour = Math.max(...existingHours);
          if (newSlotHour === minHour - 1 || newSlotHour === maxHour + 1) {
            return [...prev, slotId].sort(
              (a, b) => parseInt(a.split('-')[3]) - parseInt(b.split('-')[3])
            );
          } else {
            // If not consecutive, start a new selection
            return [slotId];
          }
        }
        return [slotId];
      }
    });
  };
  const selectedSlotsData = useMemo(() => {
    return slots.filter((s) => selectedSlotIds.includes(s.id));
  }, [slots, selectedSlotIds]);
  const totalAmount = useMemo(() => {
    return selectedSlotsData.reduce((sum, slot) => sum + slot.rate, 0);
  }, [selectedSlotsData]);
  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      toast.success('Booking Confirmed! See you on the court.');
      setSelectedDate(null);
      setSelectedSlotIds([]);
    }, 1500);
  };
  return (
    <div className="flex-grow bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold uppercase tracking-wide text-slate-900 dark:text-white">
            Book a Court
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Select a date and time for your exclusive session.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Calendar & Slots */}
          <div className="lg:col-span-2 space-y-8">
            {/* Calendar Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                  <CalendarIcon className="text-pastel-blue" />
                  {monthNames[currentDate.getMonth()]}{' '}
                  {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) =>
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider py-2">
                  
                    {day}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({
                  length: firstDay
                }).map((_, i) =>
                <div key={`empty-${i}`} className="p-2" />
                )}
                {Array.from({
                  length: daysInMonth
                }).map((_, i) => {
                  const date = i + 1;
                  const isToday =
                  new Date().getDate() === date &&
                  new Date().getMonth() === currentDate.getMonth() &&
                  new Date().getFullYear() === currentDate.getFullYear();
                  const isSelected =
                  selectedDate?.getDate() === date &&
                  selectedDate?.getMonth() === currentDate.getMonth();
                  const isPast =
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    date
                  ) < new Date(new Date().setHours(0, 0, 0, 0));
                  return (
                    <button
                      key={date}
                      disabled={isPast}
                      onClick={() =>
                      setSelectedDate(
                        new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          date
                        )
                      )
                      }
                      className={`
                        aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all
                        ${isPast ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'hover:bg-pastel-blue/10 hover:text-pastel-blue dark:hover:text-pastel-blue-light cursor-pointer'}
                        ${isSelected ? 'bg-pastel-blue text-white shadow-md hover:bg-pastel-blue hover:text-white dark:hover:text-white' : ''}
                        ${isToday && !isSelected ? 'border-2 border-pastel-blue text-pastel-blue' : ''}
                        ${!isPast && !isSelected && !isToday ? 'text-slate-700 dark:text-slate-300' : ''}
                      `}>
                      
                      {date}
                    </button>);

                })}
              </div>
            </div>

            {/* Time Slots Card */}
            <AnimatePresence mode="wait">
              {selectedDate &&
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  y: -20
                }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                      <Clock className="text-pastel-coral" />
                      Available Slots
                    </h2>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-white border border-slate-300 dark:bg-slate-800 dark:border-slate-600"></div>{' '}
                        Available
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-800/50 opacity-50"></div>{' '}
                        Booked
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-pastel-blue"></div>{' '}
                        Selected
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {slots.map((slot) => {
                    const isSelected = selectedSlotIds.includes(slot.id);
                    const isBooked = slot.status === 'booked';
                    const isNight = slot.hour >= 18;
                    return (
                      <button
                        key={slot.id}
                        disabled={isBooked}
                        onClick={() => handleSlotClick(slot.id)}
                        className={`
                            relative flex items-center justify-between p-4 rounded-xl border text-left transition-all
                            ${isBooked ? 'bg-slate-50 border-slate-100 text-slate-400 dark:bg-slate-900/50 dark:border-slate-800/50 dark:text-slate-600 cursor-not-allowed' : isSelected ? 'bg-pastel-blue border-pastel-blue text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:border-pastel-blue hover:shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:border-pastel-blue-dark'}
                          `}>
                        
                          <div>
                            <div className="font-medium">{slot.timeLabel}</div>
                            <div
                            className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                            
                              {isNight ? 'Night Rate' : 'Day Rate'}
                            </div>
                          </div>
                          <div
                          className={`font-display font-semibold text-lg ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          
                            ₱{slot.rate}
                          </div>
                          {isSelected &&
                        <div className="absolute -top-2 -right-2 bg-pastel-coral text-white rounded-full p-0.5 shadow-sm">
                              <CheckCircle2 size={16} />
                            </div>
                        }
                        </button>);

                  })}
                  </div>
                </motion.div>
              }
            </AnimatePresence>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-display font-semibold mb-6 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-4">
                Booking Summary
              </h2>

              {!selectedDate ?
              <div className="text-center py-8 text-slate-500 flex flex-col items-center gap-3">
                  <CalendarIcon size={32} className="opacity-20" />
                  <p>Select a date to view available slots.</p>
                </div> :
              selectedSlotIds.length === 0 ?
              <div className="text-center py-8 text-slate-500 flex flex-col items-center gap-3">
                  <Clock size={32} className="opacity-20" />
                  <p>Select one or more consecutive time slots.</p>
                </div> :

              <div className="space-y-6">
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                      Date
                    </div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      Selected Hours ({selectedSlotIds.length})
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {selectedSlotsData.map((slot) =>
                    <div
                      key={slot.id}
                      className="flex justify-between text-sm items-center bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                      
                          <span className="text-slate-700 dark:text-slate-300">
                            {slot.timeLabel}
                          </span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            ₱{slot.rate}
                          </span>
                        </div>
                    )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-end mb-6">
                      <div className="text-slate-500 dark:text-slate-400">
                        Total Amount
                      </div>
                      <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                        ₱{totalAmount}
                      </div>
                    </div>

                    <div className="bg-pastel-blue/10 rounded-xl p-3 flex gap-3 items-start mb-6">
                      <AlertCircle
                      size={18}
                      className="text-pastel-blue shrink-0 mt-0.5" />
                    
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Payment is collected at the venue. Please arrive 15
                        minutes before your scheduled time.
                      </p>
                    </div>

                    <button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className="w-full py-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md disabled:opacity-70 flex justify-center items-center gap-2">
                    
                      {isConfirming ?
                    <>
                          <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        
                            <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4">
                        </circle>
                            <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                          </svg>
                          Confirming...
                        </> :

                    'Confirm Booking'
                    }
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>);

}