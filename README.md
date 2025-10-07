# 💥 Cloud Performance Chaos App (V1) 💥

Este repositório contém a aplicação **vulnerável** utilizada no minicurso de **[Construindo para o Caos: a mentalidade de engenharia de software para performance na nuvem]**.

O objetivo principal desta aplicação Node.js é simular uma **instância com falhas de performance** intermitentes, consumindo intensivamente recursos de CPU e Memória (RAM) em momentos aleatórios.

Ele serve como um **ambiente de testes controlado** para que você possa praticar a identificação de gargalos (bottlenecks) e aplicar soluções de otimização e monitoramento (observability).

## 🗃️ Estrutura do Repositório

| Arquivo | Descrição |
| :--- | :--- |
| `app.js` | O servidor **Node.js/Express** principal. Contém a lógica de negócios e a função propositalmente falha (`generateChaos`). |
| `Dockerfile` | Define a imagem Docker para empacotar e executar a aplicação de forma consistente. |
| `load_test.js` | Script de **Teste de Carga (Load Test)** utilizando **k6** para simular tráfego de usuários. |

---

## 💻 Arquivos em Detalhe

### 1. `app.js` (A Aplicação Vulnerável)

É um servidor web simples em Node.js usando Express. Ele expõe um único endpoint: `/api/data`.

| Funcionalidade | Explicação Rápida |
| :--- | :--- |
| **Endpoint** | `GET /api/data` |
| **Lógica** | Em **20% das requisições** (`CHAOS_PROBABILITY = 0.20`), a aplicação executa a função `generateChaos()`. |
| **`generateChaos()`** | Esta função é o **gargalo intencional**. Ela aloca **10MB de memória** e executa um loop pesado de **5 milhões de iterações**, simulando uma sobrecarga severa de CPU e Memória (OOM-killer potencial). |
| **Saída** | Retorna uma página HTML que visualmente indica o status (OK/CRITICAL_LOAD) e mede o **Tempo de Processamento de Backend (em ms)**, que irá variar drasticamente sob carga. |

### 2. `Dockerfile` (O Empacotamento)

Utiliza uma imagem base Node.js otimizada (`node:18.12.1-slim`) para criar uma imagem Docker leve e executável. Ele instala as dependências (Express) e configura o `app.js` para ser executado ao iniciar o container.

### 3. `load_test.js` (O Stress Tester)

Este é um script para ser executado com a ferramenta de teste de carga **k6**.

| Configuração | Explicação Rápida |
| :--- | :--- |
| **VUs** | 100 Usuários Virtuais (Simultâneos). |
| **Duração** | 60 Segundos de Teste. |
| **Objetivo** | Bater continuamente no endpoint `/api/data` da sua URL de serviço (após o deploy). |
| **Thresholds** | Define metas de performance, como: 95% das requisições devem ser processadas em menos de 500ms, a taxa de falha (erros) deve ser menor que 3%, etc. |

---

## 🚀 Como Executar


```bash
npm run start
```


```bash
k6 run load_test.js
```