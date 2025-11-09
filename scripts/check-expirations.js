/**
 * Script para verificar expirações de trial e assinaturas
 * Deve ser executado diariamente via cron job
 */

const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");

// Cliente Prisma para o banco super (usar DATABASE_URL_SUPER)
const prismaSuper = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_SUPER,
    },
  },
});

// Configurar email (ajustar conforme necessário)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function checkExpirations() {
  try {
    console.log("🔍 Verificando expirações...");

    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    // Buscar tenants com trial expirando em 3 dias
    const expiringTrials = await prismaSuper.tenant.findMany({
      where: {
        status: "trial",
        trialEndDate: {
          lte: threeDaysFromNow,
          gte: now,
        },
      },
      include: {
        plan: true,
      },
    });

    // Buscar tenants com trial expirado
    const expiredTrials = await prismaSuper.tenant.findMany({
      where: {
        status: "trial",
        trialEndDate: {
          lt: now,
        },
      },
      include: {
        plan: true,
      },
    });

    // Buscar assinaturas expirando em 3 dias
    const expiringSubscriptions = await prismaSuper.subscription.findMany({
      where: {
        status: "active",
        isActive: true,
        nextBillingDate: {
          lte: threeDaysFromNow,
          gte: now,
        },
      },
      include: {
        tenant: {
          include: {
            plan: true,
          },
        },
      },
    });

    // Processar notificações
    for (const tenant of expiringTrials) {
      const daysLeft = Math.ceil(
        (tenant.trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Verificar se já foi notificado
      const alreadyNotified =
        await prismaSuper.expirationNotification.findFirst({
          where: {
            tenantId: tenant.id,
            type: "trial_expiring",
            daysLeft,
          },
        });

      if (!alreadyNotified) {
        // Enviar email
        await sendExpirationEmail(tenant, "trial_expiring", daysLeft);

        // Registrar notificação
        await prismaSuper.expirationNotification.create({
          data: {
            tenantId: tenant.id,
            type: "trial_expiring",
            daysLeft,
            emailSent: true,
          },
        });

        console.log(
          `📧 Email enviado para ${tenant.ownerEmail} - Trial expira em ${daysLeft} dias`
        );
      }
    }

    // Processar trials expirados
    for (const tenant of expiredTrials) {
      // Verificar se já foi notificado
      const alreadyNotified =
        await prismaSuper.expirationNotification.findFirst({
          where: {
            tenantId: tenant.id,
            type: "expired",
          },
        });

      if (!alreadyNotified) {
        // Enviar email de expiração
        await sendExpirationEmail(tenant, "expired", 0);

        // Atualizar status do tenant
        await prismaSuper.tenant.update({
          where: { id: tenant.id },
          data: {
            status: "expired",
            isActive: false,
          },
        });

        // Bloquear assinatura
        await prismaSuper.subscription.updateMany({
          where: {
            tenantId: tenant.id,
            isActive: true,
          },
          data: {
            status: "expired",
            isActive: false,
          },
        });

        // Registrar notificação
        await prismaSuper.expirationNotification.create({
          data: {
            tenantId: tenant.id,
            type: "expired",
            daysLeft: 0,
            emailSent: true,
          },
        });

        console.log(`⚠️ Tenant ${tenant.name} expirado e bloqueado`);
      }
    }

    // Processar assinaturas expirando
    for (const subscription of expiringSubscriptions) {
      const daysLeft = Math.ceil(
        (subscription.nextBillingDate.getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Verificar se já foi notificado
      const alreadyNotified =
        await prismaSuper.expirationNotification.findFirst({
          where: {
            tenantId: subscription.tenantId,
            type: "subscription_expiring",
            daysLeft,
          },
        });

      if (!alreadyNotified) {
        // Enviar email
        await sendExpirationEmail(
          subscription.tenant,
          "subscription_expiring",
          daysLeft
        );

        // Registrar notificação
        await prismaSuper.expirationNotification.create({
          data: {
            tenantId: subscription.tenantId,
            type: "subscription_expiring",
            daysLeft,
            emailSent: true,
          },
        });

        console.log(
          `📧 Email enviado para ${subscription.tenant.ownerEmail} - Assinatura renova em ${daysLeft} dias`
        );
      }
    }

    console.log("✅ Verificação de expirações concluída");
  } catch (error) {
    console.error("❌ Erro ao verificar expirações:", error);
    throw error;
  } finally {
    await prismaSuper.$disconnect();
  }
}

async function sendExpirationEmail(tenant, type, daysLeft) {
  const subject =
    type === "expired"
      ? "Sua conta BarberBoss expirou"
      : type === "trial_expiring"
        ? `Seu trial expira em ${daysLeft} dias`
        : `Sua assinatura renova em ${daysLeft} dias`;

  const message =
    type === "expired"
      ? `Olá ${tenant.ownerName},\n\nSua conta BarberBoss expirou. Para continuar usando o sistema, faça o pagamento da assinatura.\n\nVocê tem 3 dias para pagar antes do sistema ser bloqueado permanentemente.`
      : type === "trial_expiring"
        ? `Olá ${tenant.ownerName},\n\nSeu trial de ${daysLeft} dias está expirando. Para continuar usando o sistema, faça o pagamento da assinatura.`
        : `Olá ${tenant.ownerName},\n\nSua assinatura será renovada automaticamente em ${daysLeft} dias.`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@barberboss.com",
      to: tenant.ownerEmail,
      subject,
      text: message,
      html: `
        <h2>${subject}</h2>
        <p>${message}</p>
        <p>Acesse: https://${tenant.subdomain}.barberboss.com/admin</p>
      `,
    });
  } catch (error) {
    console.error(`Erro ao enviar email para ${tenant.ownerEmail}:`, error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  checkExpirations()
    .then(() => {
      console.log("✅ Processo concluído");
      process.exit(0);
    })
    .catch(error => {
      console.error("❌ Erro:", error);
      process.exit(1);
    });
}

module.exports = { checkExpirations };
