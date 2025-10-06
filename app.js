const express = require('express');
const app = express();
const port = 8080; 

// Função que simula uma chamada a um serviço externo (DB ou Microserviço)
function mockExternalServiceCall() {
    return new Promise((resolve, reject) => {
        // *** PONTO DE FALHA INTENCIONAL (Chaos Engineering) ***
        // 10% de chance de lentidão de 2 segundos (2000ms)
        // Isso saturará as instâncias do Cloud Run sob carga.
        const delay = (Math.random() < 0.10) ? 2000 : 50; 
        
        setTimeout(() => {
            if (delay > 1000) {
                // Se for lento, simula uma falha de timeout (50% de chance)
                if (Math.random() < 0.5) { 
                    return reject(new Error("External service timed out."));
                }
            }
            resolve({ status: "OK", data: "Dados processados (V1 - VULNERÁVEL)" });
        }, delay);
    });
}

// Endpoint principal
app.get('/api/data', async (req, res) => {
    try {
        const result = await mockExternalServiceCall();
        res.status(200).json(result);
    } catch (error) {
        console.error("Service Error:", error.message);
        // Retorna 500 para o cliente, indicando falha crítica
        res.status(500).json({ error: "Service temporarily unavailable due to upstream failure." });
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});