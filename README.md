# 📄 Enterprise Invoice Generator & PDF Rendering Engine

[![Download README PDF](https://img.shields.io/badge/Download-Enterprise_README_PDF-red?style=for-the-badge&logo=adobeacrobatreader)](./Invoice_Generator_Enterprise_README.pdf)
[![Live Demo](https://img.shields.io/badge/Live_Demo-invoicepilot--zeta.vercel.app-000000?style=for-the-badge&logo=vercel)](https://invoicepilot-zeta.vercel.app)

An automated enterprise REST service and PDF rendering engine built with Node.js, Express, MongoDB, and Redis. It handles secure invoice creation, server-side financial calculations, real-time PDF generation, Brevo email dispatching, caching, rate-limiting, and centralized monitoring.

---

## 📌 System Architecture & Pipeline

```text
 Client Request / Frontend (Vercel)
            │
            ▼
 ┌──────────────────────────┐
 │ Rate Limiter (Redis)     │  ──► Prevents DDoS & abusive API traffic
 └───────────┬──────────────┘
             │
             ▼
 ┌──────────────────────────┐
 │ JWT Auth Middleware      │  ──► Validates Bearer Tokens & RBAC User Roles
 └───────────┬──────────────┘
             │
             ▼
 ┌──────────────────────────┐
 │ Request Logger (Winston) │  ──► Logs incoming HTTP requests & diagnostics
 └───────────┬──────────────┘
             │
             ▼
 ┌──────────────────────────┐
 │ Express Validation Layer │  ──► Sanitizes inputs & verifies schema payloads
 └───────────┬──────────────┘
             │
             ▼
 ┌──────────────────────────┐
 │ Controller Logic         │  ──► Computes subtotals, custom tax %, discounts & net total
 └───────────┬──────────────┘
             │
       ┌─────┼──────────────────────┬──────────────────────┐
       ▼     ▼                      ▼                      ▼
 ┌──────────────┐   ┌────────────────────┐   ┌─────────────────┐   ┌────────────────┐
 │  Redis Cache │   │ PDF Engine         │   │ Email Service   │   │  MongoDB       │
 │  (Fast Reads)│   │ (Generates Stream) │   │ (Brevo REST API)│   │  (Database)    │
 └──────────────┘   └────────────────────┘   └─────────────────┘   └────────────────┘
