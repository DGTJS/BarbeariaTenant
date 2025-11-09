-- AlterTable: Adicionar campo paymentExpiresAt para agendamentos "Aguardando Pagamento"
ALTER TABLE `booking` ADD COLUMN `paymentExpiresAt` DATETIME(3) NULL;

-- Criar índice para melhorar performance nas consultas de expiração
CREATE INDEX `booking_paymentExpiresAt_idx` ON `booking`(`paymentExpiresAt`);

