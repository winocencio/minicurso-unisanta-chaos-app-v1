import http from 'k6/http';
import { sleep } from 'k6';

// Configurações do teste
export const options = {
  // Teste de Carga Moderada: 100 VUs por 60 segundos
  vus: 100, 
  duration: '60s',
  
  thresholds: {
    'http_req_duration': ['p(95)<500'], 
    'http_req_duration': ['p(99)<1000'], 
    'http_req_failed': ['rate<0.03'], 
    'http_reqs': ['rate>80'], 
  },
};

export default function () {
  const serviceUrl = 'COLOCAR-URL-AQUI'; 
  
  http.get(`${serviceUrl}/api/data`);
  sleep(1); 
}