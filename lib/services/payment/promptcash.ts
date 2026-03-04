import { getBchRate } from "@/lib/services/bchRate";
import axios from "axios";

const IS_TESTNET = process.env.PROMPT_CASH_TESTNET === "true";

const BASE_URL = IS_TESTNET
  ? "https://api.prompt.cash/testnet"
  : "https://api.prompt.cash";

const API_KEY = process.env.PROMPT_CASH_API_KEY ?? "";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export interface CreateInvoiceParams {
  bookingId: string;
  amountUsd: number;
  description: string;
}

export interface PromptCashInvoice {
  paymentId: string;
  paymentUrl: string;
  amountBch: number;
  amountUsd: number;
  status: "pending" | "confirmed" | "expired" | "failed";
}

export async function createPaymentInvoice(
  params: CreateInvoiceParams,
): Promise<PromptCashInvoice> {
  // Convert USD to BCH using live rate
  const bchRate = await getBchRate();
  const amountBch = params.amountUsd / bchRate;

  try {
    const res = await axios.post(
      `${BASE_URL}/payment/create`,
      {
        amount: amountBch.toFixed(8),
        currency: "BCH",
        success_url:
          `${APP_URL}/trips/payment-success` +
          `?booking_id=${params.bookingId}`,
        cancel_url: `${APP_URL}/trips/payment-cancelled`,
        description: params.description,
        order_id: params.bookingId,
      },
      {
        headers: {
          Authorization: `Token ${API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = res.data;

    return {
      paymentId: data.payment_id,
      paymentUrl: data.payment_url,
      amountBch,
      amountUsd: params.amountUsd,
      status: "pending",
    };
  } catch (error: any) {
    const err = error.response?.data || error.message;
    throw new Error(`Prompt.cash error: ${err}`);
  }
}

export async function checkPaymentStatus(
  paymentId: string,
): Promise<"pending" | "confirmed" | "expired" | "failed"> {
  try {
    const res = await axios.get(
      `${BASE_URL}/payment/status` + `?payment_id=${paymentId}`,
      {
        headers: {
          Authorization: `Token ${API_KEY}`,
        },
      },
    );

    return res.data.status ?? "pending";
  } catch (error) {
    return "failed";
  }
}
