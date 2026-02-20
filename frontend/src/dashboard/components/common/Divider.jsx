// src/dashboard/components/common/Divider.jsx
export default function Divider({ 
    label,
    orientation = 'horizontal',
    variant = 'default'
}) {
    const variants = {
        default: 'border-gray-800',
        subtle: 'border-gray-900',
        bold: 'border-gray-700'
    };

    if (orientation === 'vertical') {
        return (
            <div className={`w-px bg-gray-800 ${variant === 'bold' ? 'bg-gray-700' : variant === 'subtle' ? 'bg-gray-900' : 'bg-gray-800'}`} />
        );
    }

    if (label) {
        return (
            <div className="relative my-6">
                <div className={`border-t ${variants[variant]}`} />
                <div className="absolute inset-0 flex justify-center">
                    <span className="bg-black px-3 text-xs text-gray-500 uppercase tracking-wider">
                        {label}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={`border-t ${variants[variant]} my-6`} />
    );
}