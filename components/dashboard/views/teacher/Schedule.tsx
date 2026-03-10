import { Calendar } from "../../calendar/Calendar";

export function TeacherSchedule() {
    return (
        <div className="p-8 space-y-8 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-gray-900 font-urbanist tracking-tight">Teaching Schedule</h1>
                <p className="text-gray-400 font-medium mt-2">Manage your upcoming lectures, practicals, and batch assignments.</p>
            </div>
            
            <Calendar mode="teacher" />
        </div>
    );
}
