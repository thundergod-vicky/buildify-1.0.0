import { SettingsForm } from "@/components/dashboard/settings-form";

export function TeacherSettings() {
    return (
        <div className="p-8 space-y-8">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-500 rounded-3xl p-8 text-white mb-8">
                <h1 className="text-3xl font-bold font-urbanist">Settings ⚙️</h1>
                <p className="mt-2 text-purple-100 text-lg">
                    Manage your teaching profile and account details.
                </p>
            </div>
            <SettingsForm />
        </div>
    );
}
