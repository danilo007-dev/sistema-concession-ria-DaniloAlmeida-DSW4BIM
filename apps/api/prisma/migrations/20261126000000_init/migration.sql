CREATE TABLE `User` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(191) NOT NULL,
  `role` ENUM('SELLER', 'ADMIN') NOT NULL DEFAULT 'SELLER',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `User_email_key` (`email`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE `Vehicle` (
  `id` VARCHAR(191) NOT NULL,
  `make` VARCHAR(191) NOT NULL,
  `model` VARCHAR(191) NOT NULL,
  `year` INTEGER NOT NULL,
  `price` DECIMAL(12, 2) NOT NULL,
  `mileage` INTEGER NOT NULL,
  `color` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `status` ENUM('AVAILABLE', 'SOLD') NOT NULL DEFAULT 'AVAILABLE',
  `ownerId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `Vehicle_ownerId_idx` (`ownerId`),
  INDEX `Vehicle_status_idx` (`status`),
  PRIMARY KEY (`id`),
  CONSTRAINT `Vehicle_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;
