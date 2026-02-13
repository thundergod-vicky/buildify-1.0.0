import { SettingsForm } from "@/components/dashboard/settings-form";

export function StudentSettings() {
    return (
        <div className="p-8 space-y-8">
            <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-3xl p-8 text-white mb-8">
                <h1 className="text-3xl font-bold font-urbanist">Settings ⚙️</h1>
                <p className="mt-2 text-orange-50/80 text-lg">
                    Manage your profile and account preferences.
                </p>
            </div>
            <SettingsForm />
        </div>
    );
}
