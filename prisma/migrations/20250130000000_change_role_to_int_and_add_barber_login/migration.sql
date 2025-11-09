-- AlterTable: Mudar role de String para Int
-- Primeiro, criar uma coluna temporária para armazenar o valor numérico
ALTER TABLE `users` ADD COLUMN `role_temp` INT DEFAULT 3;

-- Converter roles existentes:
-- "Admin", "admin", "administrador" -> 1
-- "Barbeiro", "barber" -> 2
-- Outros (incluindo "Cliente") -> 3
UPDATE `users` SET `role_temp` = 1 
WHERE LOWER(TRIM(`role`)) IN ('admin', 'administrador');

UPDATE `users` SET `role_temp` = 2 
WHERE LOWER(TRIM(`role`)) IN ('barbeiro', 'barber');

UPDATE `users` SET `role_temp` = 3 
WHERE `role_temp` IS NULL OR `role_temp` = 0;

-- Garantir que usuários com barbeiros tenham role 2 se ainda não tiverem
UPDATE `users` u
INNER JOIN `barber` b ON u.id = b.userId
SET u.`role_temp` = 2
WHERE u.`role_temp` = 3;

-- Remover a coluna antiga e renomear a nova
ALTER TABLE `users` DROP COLUMN `role`;
ALTER TABLE `users` CHANGE COLUMN `role_temp` `role` INT NOT NULL DEFAULT 3;

-- Adicionar campos de login no modelo barber
ALTER TABLE `barber` ADD COLUMN `email` VARCHAR(191) NULL;
ALTER TABLE `barber` ADD COLUMN `password` VARCHAR(191) NULL;
ALTER TABLE `barber` ADD COLUMN `hasAdminAccess` BOOLEAN NOT NULL DEFAULT false;

-- Criar índice único no email do barbeiro
CREATE UNIQUE INDEX `barber_email_key` ON `barber`(`email`);

