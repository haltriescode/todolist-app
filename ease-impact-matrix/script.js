// Load saved options on page load
window.onload = function() {
    const savedOptions = JSON.parse(localStorage.getItem('decisionOptions') || '[]');
    const addButton = document.querySelector('button[onclick="addOption()"]');
    
    if (savedOptions.length > 0) {
        // Clear default option
        document.getElementById('option-list').innerHTML = '';
        // Restore saved options
        savedOptions.forEach(opt => {
            const newOption = document.createElement('div');
            newOption.className = 'option';
            newOption.innerHTML = `
                <input type="text" placeholder="Enter option" value="${opt.text}">
                <div class="sliders">
                    <div>
                        <span class="slider-label">Impact (0-10):</span>
                        <input type="range" min="0" max="10" value="${opt.impact}" class="impact-slider">
                    </div>
                    <div>
                        <span class="slider-label">Ease (0-10):</span>
                        <input type="range" min="0" max="10" value="${opt.ease}" class="ease-slider">
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteOption(this)"></button>
            `;
            document.getElementById('option-list').appendChild(newOption);
        });
        addButton.textContent = "Add Another Option";
    } else {
        addButton.textContent = "Add Option";
    }
    updateGraph();
};

function saveOptions() {
    const options = Array.from(document.querySelectorAll('.option'))
        .map(option => ({
            text: option.querySelector('input[type="text"]').value.trim(),
            impact: parseInt(option.querySelector('.impact-slider').value),
            ease: parseInt(option.querySelector('.ease-slider').value)
        }))
        .filter(option => option.text !== '');
    
    localStorage.setItem('decisionOptions', JSON.stringify(options));
    alert('Options saved successfully!');
}

function addOption() {
    const optionList = document.getElementById('option-list');
    const newOption = document.createElement('div');
    newOption.className = 'option';
    newOption.innerHTML = `
        <input type="text" placeholder="Enter option">
        <div class="sliders">
            <div>
                <span class="slider-label">Impact (0-10):</span>
                <input type="range" min="0" max="10" value="5" class="impact-slider">
            </div>
            <div>
                <span class="slider-label">Ease (0-10):</span>
                <input type="range" min="0" max="10" value="5" class="ease-slider">
            </div>
        </div>
        <button class="delete-btn" onclick="deleteOption(this)"></button>
    `;
    optionList.appendChild(newOption);
    updateGraph();
}

function updateGraph() {
    const canvas = document.getElementById('graph');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Increase padding for more space
    const padding = 80; // Keep padding for graph area
    const labelPadding = 30; // Extra space for labels
    const leftOffset = 40; // Additional offset to move graph right

    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.moveTo(padding + leftOffset, height - padding);  // Start from bottom-left with padding + offset
    ctx.lineTo(width - padding + leftOffset, height - padding);  // Draw x-axis
    ctx.moveTo(padding + leftOffset, height - padding);  // Start from bottom-left again
    ctx.lineTo(padding + leftOffset, padding);  // Draw y-axis
    ctx.stroke();

    // Add labels
    ctx.font = '12px Arial';
    ctx.fillStyle = 'grey';
    // X-axis labels - reduced the vertical gap
    ctx.fillText('Hard', padding + leftOffset, height - padding + 20);  // Closer to x-axis
    ctx.fillText('Easy', width - padding + leftOffset - 20, height - padding + 20);  // Closer to x-axis
    // Y-axis labels
    ctx.save();  // Save current context
    ctx.translate(labelPadding, padding);  // Much further left for High Impact
    ctx.fillText('High Impact', 0, 0);
    ctx.translate(0, height - 2 * padding);  // Position for Low Impact
    ctx.fillText('Low Impact', 0, 0);
    ctx.restore();  // Restore context

    // Adjust point plotting to account for padding and offset
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        const text = option.querySelector('input[type="text"]').value;
        const impact = option.querySelector('.impact-slider').value;
        const ease = option.querySelector('.ease-slider').value;

        if (text) {
            // Convert values to canvas coordinates with padding and offset
            const x = padding + leftOffset + (ease / 10) * (width - 2 * padding);
            const y = height - padding - (impact / 10) * (height - 2 * padding);

            // Draw point
            ctx.beginPath();
            ctx.fillStyle = 'black';
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();

            // Add label
            ctx.fillStyle = 'black';
            ctx.fillText(text, x + 8, y);
        }
    });
}

// Add event listeners for all inputs
document.getElementById('option-list').addEventListener('input', function(e) {
    // Check if the event came from a slider or text input
    if (e.target.type === 'range' || e.target.type === 'text') {
        updateGraph();
    }
});

// Initial graph
updateGraph();

// Update makeDecision function to consider impact and ease
function makeDecision() {
    const options = Array.from(document.querySelectorAll('.option'))
        .map(option => ({
            text: option.querySelector('input[type="text"]').value.trim(),
            impact: parseInt(option.querySelector('.impact-slider').value),
            ease: parseInt(option.querySelector('.ease-slider').value)
        }))
        .filter(option => option.text !== '');

    if (options.length < 2) {
        alert('Please enter at least 2 options!');
        return;
    }

    // Enhanced scoring system
    const weightedOptions = options.map(option => {
        // Base scores
        let impactScore = option.impact;
        let easeScore = option.ease;

        // Impact multipliers based on score ranges
        if (impactScore >= 8) {
            impactScore *= 1.5; // High impact bonus
        } else if (impactScore <= 3) {
            impactScore *= 0.7; // Low impact penalty
        }

        // Ease multipliers based on score ranges
        if (easeScore >= 8) {
            easeScore *= 1.3; // Very easy bonus
        } else if (easeScore <= 3) {
            easeScore *= 0.8; // Very difficult penalty
        }

        // Calculate balanced score
        // Impact is weighted more heavily (60%) than ease (40%)
        const balancedScore = (impactScore * 0.6) + (easeScore * 0.4);

        // Additional multiplier for balanced options
        const balanceBonus = Math.abs(impactScore - easeScore) < 3 ? 1.1 : 1;

        return {
            ...option,
            finalScore: balancedScore * balanceBonus,
            analysis: {
                impactScore: impactScore,
                easeScore: easeScore,
                balanceBonus: balanceBonus,
                recommendation: getRecommendation(impactScore, easeScore)
            }
        };
    });

    // Sort by final score
    const sortedOptions = weightedOptions.sort((a, b) => b.finalScore - a.finalScore);
    const bestOption = sortedOptions[0];

    // Generate detailed analysis
    const analysis = `
        Prioritize: ${bestOption.text}
        
        Analysis:
        • Impact Score: ${bestOption.impact}/10
        • Ease Score: ${bestOption.ease}/10
        • Final Score: ${bestOption.finalScore.toFixed(2)}
        
        Recommendation: ${bestOption.analysis.recommendation}
    `;

    document.getElementById('result').innerHTML = analysis.replace(/\n/g, '<br>');
}

// Helper function to generate recommendations
function getRecommendation(impact, ease) {
    if (impact >= 8 && ease >= 7) {
        return "High priority - Implement immediately! High impact with good feasibility.";
    } else if (impact >= 8 && ease <= 4) {
        return "Strategic project - High impact but challenging. Consider breaking into smaller tasks.";
    } else if (impact <= 4 && ease >= 7) {
        return "Quick win - Easy to implement but limited impact. Good for building momentum.";
    } else if (impact <= 4 && ease <= 4) {
        return "Low priority - Reconsider if this is worth pursuing.";
    } else {
        return "Moderate priority - Balance of impact and effort is reasonable.";
    }
}

// Add delete function
function deleteOption(button) {
    button.parentElement.remove();
    updateGraph();
}