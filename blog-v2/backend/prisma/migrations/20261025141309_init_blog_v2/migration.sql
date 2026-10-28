-- Generated with Prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script.
-- Foreign keys are inline so this initial migration contains CREATE statements only.

CREATE TABLE `Admin` (
    `id` CHAR(36) NOT NULL,
    `legacyId` INTEGER NULL,
    `username` VARCHAR(191) NOT NULL,
    `passwordHash` LONGTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_legacyId_key`(`legacyId`),
    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `AdminSession` (
    `id` CHAR(36) NOT NULL,
    `tokenHash` CHAR(64) NOT NULL,
    `adminId` CHAR(36) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AdminSession_tokenHash_key`(`tokenHash`),
    INDEX `AdminSession_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`),
    CONSTRAINT `AdminSession_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Category` (
    `id` CHAR(36) NOT NULL,
    `name` LONGTEXT NOT NULL,
    `slug` VARCHAR(200) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Post` (
    `id` CHAR(36) NOT NULL,
    `legacyId` INTEGER NULL,
    `title` LONGTEXT NOT NULL,
    `slug` VARCHAR(200) NOT NULL,
    `contentHtml` LONGTEXT NOT NULL,
    `excerpt` LONGTEXT NULL,
    `legacyCategory` LONGTEXT NULL,
    `categoryId` CHAR(36) NULL,
    `imageUrl` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `metaDescription` LONGTEXT NULL,

    UNIQUE INDEX `Post_legacyId_key`(`legacyId`),
    UNIQUE INDEX `Post_slug_key`(`slug`),
    INDEX `Post_status_publishedAt_createdAt_id_idx`(`status`, `publishedAt`, `createdAt`, `id`),
    PRIMARY KEY (`id`),
    CONSTRAINT `Post_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
