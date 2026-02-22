// src/dashboard/components/common/Divider.jsx

export default function Divider({ 
    orientation = 'horizontal', 
    className = "",
    variant = "default",
    label 
}) {
    const variants = {
        default: 'border-gray-800',
        subtle: 'border-gray-900',
        strong: 'border-gray-700'
    };

    if (orientation === 'vertical') {
        return (
            <div className={`border-l ${variants[variant]} ${className}`} />
        );
    }

    if (label) {
        return (
            <div className={`relative ${className}`}>
                <div className={`absolute inset-0 flex items-center`}>
                    <div className={`w-full border-t ${variants[variant]}`} />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-black px-2 text-gray-500">
                        {label}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={`border-t ${variants[variant]} ${className}`} />
    );
}