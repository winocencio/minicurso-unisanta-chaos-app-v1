// External dependencies
const express = require('express');
const app = express();
const port = 8080; 

// --- Chaos Configuration ---
const CHAOS_PROBABILITY = 0;       // 20% chance to trigger chaos
const MAX_CHAOS_SIZE = 10 * 1024 * 1024; // Allocate 10MB of data (Memory Consumption)
const MAX_ITERATIONS = 5000000;      // 5 million iterations (CPU Consumption)

/**
 * Executes heavy processing and allocates large data structures to simulate load.
 * This function is the intentional flaw in V1.
 */
function generateChaos() {
    const largeArray = [];
    for (let i = 0; i < MAX_CHAOS_SIZE; i++) {
        largeArray.push('*');
    }
    
    let result = 0;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        result += Math.sqrt(i % 100) * Math.sin(i);
    }
    
    return { 
        memory_allocated_bytes: largeArray.length,
        cpu_result_hash: result
    };
}

// Main API Endpoint
app.get('/api/data', async (req, res) => {
    const startTime = process.hrtime();

    let status = "OK";
    let color = "#34eb3a"; // Green
    let message = "Normal and fast processing.";
    let chaosDetails = "N/A";
    
    if (Math.random() < CHAOS_PROBABILITY) {
        status = "CRITICAL_LOAD";
        color = "#eb3a3a"; // Red
        message = "Instance under HEAVY STRESS (CPU/MEMORY)! Performance severely degraded.";
        
        try {
            // Execute the heavy resource-consuming function
            const chaosResult = generateChaos();
            chaosDetails = `Allocated ${(chaosResult.memory_allocated_bytes / (1024 * 1024)).toFixed(0)}MB. Forced processing.`;
        } catch (error) {
            // In case of extreme Out of Memory (OOM) 
            color = "#8b0000"; // Dark Red
            message = "CRITICAL MEMORY FAILURE (OOM)! Instance likely to restart.";
        }
    }

    // --- 3. End Processing Time Measurement ---
    const endTime = process.hrtime(startTime);
    const processTimeMs = (endTime[0] * 1000) + (endTime[1] / 1000000);
    
    // --- 4. HTML Rendering for Visual Feedback ---
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>V1: Vulnerable Application</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                .container { background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; border-left: 10px solid ${color}; }
                .status-box { background-color: ${color}; color: white; padding: 10px; border-radius: 5px; margin-bottom: 20px; font-size: 1.5em; }
                .metric { margin-top: 15px; font-size: 1.1em; color: #555; }
                .warning { color: #d9534f; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Cloud Performance Chaos App (V1)</h1>
                
                <div class="status-box">STATUS: ${status}</div>
                
                <p>${message}</p>
                
                <hr>
                
                <div class="metric">
                    <strong>Backend Processing Time:</strong> 
                    <span style="color: ${color};">${processTimeMs.toFixed(2)} ms</span>
                </div>
                
                <div class="metric">
                    <strong>Chaos Details:</strong> ${chaosDetails}
                </div>
                
                <div class="metric warning">
                    High processing time indicates an overloaded instance!
                </div>
            </div>
        </body>
        </html>
    `);
});

// Cloud Run expects the application to listen on the port specified by the PORT environment variable (default 8080).
app.listen(port, () => {
    console.log(`App Started -> listening on port ${port}`);
});