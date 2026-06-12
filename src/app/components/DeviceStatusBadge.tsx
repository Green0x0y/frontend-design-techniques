interface DeviceStatusBadgeProps {
    isActive: boolean;
    onToggle: () => void;
}

export function DeviceStatusBadge({ isActive, onToggle }: DeviceStatusBadgeProps) {
    return (
        <button
            onClick={onToggle}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                isActive
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
        >
            {isActive ? "Włączone" : "Wyłączone"}
        </button>
    );
}