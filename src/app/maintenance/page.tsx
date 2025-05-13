import db from "@/lib/db";
import CountdownTimer from "@/components/global/countdown-timer";
import { format } from "date-fns";
import Image from "next/image";

export default async function MaintenancePage() {
  // Fetch current maintenance settings
  const settings = await db.siteSettings.findFirst();

  // Calculate time left if end date exists
  const endDate = settings?.maintenanceEndDate;
  const timeLeft = endDate ? calculateTimeLeft(endDate) : null;

  function calculateTimeLeft(endDate: Date) {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();

    if (diff <= 0) return null; // Maintenance should be over

    return diff; // Return milliseconds remaining
  }

  // Format date using date-fns
  function formatEndDate(date: Date) {
    return format(date, "MMMM d, yyyy 'at' h:mm a");
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-white px-4">
      <div className="max-w-2xl w-full p-8 text-center">
        <Image
          src="/maintenance.jpg"
          alt="Maintenance"
          width={400}
          height={400}
          className='mx-auto'
        />
        <div className="space-y-4 mt-3">
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            🚧 Under Maintenance
          </h1>

          {/* Dynamic Message */}
          <p className="text-gray-700 text-lg">
            {settings?.maintenanceMessage ||
              "We're currently performing scheduled maintenance. Please check back soon."}
          </p>

          {/* Countdown Timer (only shows if end date is in future) */}
          {timeLeft && endDate && (
            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-500">Estimated time remaining:</p>
              <CountdownTimer initialTime={timeLeft} />
              <p className="text-xs text-gray-400 mt-2">
                Scheduled to end: {formatEndDate(endDate)}
              </p>
            </div>
          )}

          {/* Show different message if maintenance should be over */}
          {endDate && !timeLeft && (
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md">
              Maintenance should be complete now. We&apos;re finalizing updates.
            </div>
          )}

          {/* Animated icon */}
          <div className="mt-6 animate-pulse">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
