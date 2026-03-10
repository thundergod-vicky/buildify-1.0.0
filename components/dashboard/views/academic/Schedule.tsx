import { Calendar } from "../../calendar/Calendar";

export function AcademicSchedule() {
    return (
        <div className="p-8 space-y-8 min-h-screen bg-gray-50/50">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Schedule</h1>
                <p className="text-gray-400 font-medium mt-2">View all scheduled classes across batches and teachers.</p>
            </div>

            <Calendar mode="operations" />
        </div>
    );
}
