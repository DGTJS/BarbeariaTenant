/**
 * Integração com Asaas para pagamentos recorrentes
 */

const ASAAS_API_KEY = process.env.ASAAS_API_KEY || "";
const ASAAS_BASE_URL = process.env.ASAAS_BASE_URL || "https://api.asaas.com/v3";

interface AsaasCustomer {
  name: string;
  email: string;
  phone?: string;
  cpfCnpj?: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  city?: string;
  state?: string;
}

interface AsaasSubscription {
  customer: string; // ID do cliente
  billingType: "CREDIT_CARD" | "PIX" | "BOLETO";
  value: number;
  nextDueDate: string; // YYYY-MM-DD
  cycle:
    | "WEEKLY"
    | "BIWEEKLY"
    | "MONTHLY"
    | "QUARTERLY"
    | "SEMIANNUALLY"
    | "YEARLY";
  description?: string;
  externalReference?: string;
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
}

/**
 * Criar cliente no Asaas
 */
export async function createAsaasCustomer(data: AsaasCustomer) {
  const response = await fetch(`${ASAAS_BASE_URL}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: ASAAS_API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.errors?.[0]?.description || "Erro ao criar cliente no Asaas"
    );
  }

  return response.json();
}

/**
 * Criar assinatura no Asaas
 */
export async function createAsaasSubscription(data: AsaasSubscription) {
  const response = await fetch(`${ASAAS_BASE_URL}/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: ASAAS_API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.errors?.[0]?.description || "Erro ao criar assinatura no Asaas"
    );
  }

  return response.json();
}

/**
 * Cancelar assinatura no Asaas
 */
export async function cancelAsaasSubscription(subscriptionId: string) {
  const response = await fetch(
    `${ASAAS_BASE_URL}/subscriptions/${subscriptionId}`,
    {
      method: "DELETE",
      headers: {
        access_token: ASAAS_API_KEY,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.errors?.[0]?.description || "Erro ao cancelar assinatura no Asaas"
    );
  }

  return response.json();
}

/**
 * Obter assinatura do Asaas
 */
export async function getAsaasSubscription(subscriptionId: string) {
  const response = await fetch(
    `${ASAAS_BASE_URL}/subscriptions/${subscriptionId}`,
    {
      headers: {
        access_token: ASAAS_API_KEY,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.errors?.[0]?.description || "Erro ao obter assinatura do Asaas"
    );
  }

  return response.json();
}

/**
 * Webhook do Asaas - processar eventos
 */
export async function handleAsaasWebhook(event: any) {
  // event.event: PAYMENT_CREATED, PAYMENT_UPDATED, PAYMENT_OVERDUE, etc
  // event.payment: dados do pagamento

  switch (event.event) {
    case "PAYMENT_CREATED":
      // Pagamento criado
      break;
    case "PAYMENT_CONFIRMED":
      // Pagamento confirmado - renovar assinatura
      break;
    case "PAYMENT_OVERDUE":
      // Pagamento em atraso - notificar
      break;
    case "PAYMENT_RECEIVED":
      // Pagamento recebido
      break;
    default:
      console.log("Evento não tratado:", event.event);
  }

  return { success: true };
}
