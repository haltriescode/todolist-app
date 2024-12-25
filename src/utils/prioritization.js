export function calculatePriority(impact, ease) {
    const priority = determinePriority(impact, ease);
    return {
        score: calculateScore(impact, ease),
        label: priority,
        color: getPriorityColor(priority)
    };
}

function determinePriority(impact, ease) {
    if (impact >= 8 && ease >= 7) return "High Priority";
    if (impact >= 8 && ease <= 4) return "Strategic";
    if (impact <= 4 && ease >= 7) return "Quick Win";
    if (impact <= 4 && ease <= 4) return "Low Priority";
    return "Medium Priority";
}

function calculateScore(impact, ease) {
    return (impact * 0.6) + (ease * 0.4);
}

function getPriorityColor(priority) {
    const colors = {
        "High Priority": "#ff4444",
        "Strategic": "#ffaa44",
        "Quick Win": "#44ff44",
        "Low Priority": "#aaaaaa",
        "Medium Priority": "#44aaff"
    };
    return colors[priority];
}