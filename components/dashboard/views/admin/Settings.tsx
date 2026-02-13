import { SettingsForm } from "@/components/dashboard/settings-form";

export function AdminSettings() {
    return (
        <div className="p-8 space-y-8">
            <div className="bg-gradient-to-r from-red-600 to-rose-500 rounded-3xl p-8 text-white mb-8">
                <h1 className="text-3xl font-bold font-urbanist">Settings ⚙️</h1>
                <p className="mt-2 text-red-100 text-lg">
                    System configuration and administrator profile.
                </p>
            </div>
            <SettingsForm />
        </div>
    );
}
