import { SettingsForm } from "@/components/dashboard/settings-form";

export function ParentSettings() {
    return (
        <div className="p-8 space-y-8">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-3xl p-8 text-white mb-8">
                <h1 className="text-3xl font-bold font-urbanist">Settings ⚙️</h1>
                <p className="mt-2 text-teal-50/80 text-lg">
                    Manage your account and notification preferences.
                </p>
            </div>
            <SettingsForm />
        </div>
    );
}
