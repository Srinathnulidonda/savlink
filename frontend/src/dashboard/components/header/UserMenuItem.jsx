// src/dashboard/components/sidebar/UserMenuItem.jsx
export default function UserMenuItem({ 
    icon, 
    label, 
    onClick, 
    variant = 'default' 
}) {
    const baseClasses = "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all";
    
    const variantClasses = {
        default: "text-gray-400 hover:bg-gray-900 hover:text-white",
        danger: "text-red-400 hover:bg-red-500/10 hover:text-red-300"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]}`}
        >
            {icon}
            {label}
        </button>
    );
}