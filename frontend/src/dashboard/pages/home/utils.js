// src/dashboard/pages/home/utils.js

const PALETTE = [
    { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', gradient: 'from-blue-500/20 to-blue-600/5' },
    { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', gradient: 'from-violet-500/20 to-violet-600/5' },
    { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', gradient: 'from-emerald-500/20 to-emerald-600/5' },
    { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', gradient: 'from-amber-500/20 to-amber-600/5' },
    { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', gradient: 'from-rose-500/20 to-rose-600/5' },
    { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', gradient: 'from-cyan-500/20 to-cyan-600/5' },
    { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', gradient: 'from-indigo-500/20 to-indigo-600/5' },
    { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', gradient: 'from-pink-500/20 to-pink-600/5' },
];

export function hashString(str = '') {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

export function getLinkColor(url = '') {
    return PALETTE[hashString(url) % PALETTE.length];
}

export function getDomain(url) {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return url || '';
    }
}

export function getDomainInitial(url) {
    const domain = getDomain(url);
    return domain ? domain[0].toUpperCase() : '?';
}

export function formatRelativeTime(dateStr) {
    if (!dateStr) return '';
    try {
        const ms = Date.now() - new Date(dateStr).getTime();
        const sec = Math.floor(ms / 1000);
        const min = Math.floor(sec / 60);
        const hr = Math.floor(min / 60);
        const day = Math.floor(hr / 24);
        const wk = Math.floor(day / 7);

        if (sec < 60) return 'Just now';
        if (min < 60) return `${min}m`;
        if (hr < 24) return `${hr}h`;
        if (day < 7) return `${day}d`;
        if (wk < 4) return `${wk}w`;
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
        return '';
    }
}

export function pluralize(count, singular, plural) {
    return count === 1 ? singular : (plural || `${singular}s`);
}