/**
 * API Client - Centralized HTTP requests
 */

import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // DocCheck
  async startAssessment(data: any) {
    return this.client.post("/doccheck/start", data);
  }

  async getAssessmentResult(sessionId: string) {
    return this.client.get(`/doccheck/${sessionId}/result`);
  }

  // Orders
  async createOrder(data: any) {
    return this.client.post("/orders", data);
  }

  async getOrder(orderId: string) {
    return this.client.get(`/orders/${orderId}`);
  }

  async getSellerOrders(email: string) {
    return this.client.get("/orders/seller/list", { params: { email } });
  }

  // Documents
  async uploadDocument(orderId: string, formData: FormData) {
    return this.client.post(`/documents/${orderId}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async getDocuments(orderId: string) {
    return this.client.get(`/documents/${orderId}`);
  }

  // Payments
  async createCheckout(data: any) {
    return this.client.post("/payments/checkout", data);
  }

  async getPaymentStatus(sessionId: string) {
    return this.client.get(`/payments/${sessionId}/status`);
  }

  // CMA
  async generateReport(data: any) {
    return this.client.post("/cma/generate", data);
  }

  async getReport(reportId: string) {
    return this.client.get(`/cma/${reportId}`);
  }

  async exportPDF(reportId: string) {
    return this.client.post(`/cma/${reportId}/export`);
  }
}

export const apiClient = new APIClient();
