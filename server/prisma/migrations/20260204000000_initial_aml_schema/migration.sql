-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `last_login_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_role_idx`(`role`),
    INDEX `users_is_active_idx`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(500) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `refresh_tokens_token_key`(`token`),
    INDEX `refresh_tokens_user_id_idx`(`user_id`),
    INDEX `refresh_tokens_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `color` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blog_categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_tags` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `blog_tags_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_posts` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `excerpt` TEXT NULL,
    `featured_image` VARCHAR(191) NULL,
    `images` JSON NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `author_name` VARCHAR(191) NOT NULL,
    `author_bio` TEXT NULL,
    `author_avatar` VARCHAR(191) NULL,
    `published_at` DATETIME(3) NULL,
    `view_count` INTEGER NOT NULL DEFAULT 0,
    `reading_time` INTEGER NULL,
    `category_id` VARCHAR(191) NULL,
    `author_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blog_posts_slug_key`(`slug`),
    INDEX `blog_posts_status_idx`(`status`),
    INDEX `blog_posts_category_id_idx`(`category_id`),
    INDEX `blog_posts_published_at_idx`(`published_at`),
    INDEX `blog_posts_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_post_tags` (
    `post_id` VARCHAR(191) NOT NULL,
    `tag_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`post_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_reactions` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('LIKE', 'LOVE', 'HELPFUL') NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `post_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `blog_reactions_post_id_idx`(`post_id`),
    UNIQUE INDEX `blog_reactions_post_id_session_id_type_key`(`post_id`, `session_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(191) NOT NULL,
    `order_number` VARCHAR(191) NOT NULL,
    `tracking_code` VARCHAR(191) NOT NULL,
    `car_make` VARCHAR(191) NOT NULL,
    `car_model` VARCHAR(191) NOT NULL,
    `car_year` INTEGER NOT NULL,
    `car_vin` VARCHAR(191) NULL,
    `car_color` VARCHAR(191) NULL,
    `car_image` VARCHAR(191) NULL,
    `auction_price` DECIMAL(12, 2) NULL,
    `shipping_cost` DECIMAL(12, 2) NULL,
    `total_price` DECIMAL(12, 2) NULL,
    `customer_name` VARCHAR(191) NOT NULL,
    `customer_phone` VARCHAR(191) NULL,
    `customer_email` VARCHAR(191) NULL,
    `status` ENUM('WON', 'PAID', 'SHIPPING', 'PORT', 'DELIVERED') NOT NULL DEFAULT 'WON',
    `current_stage` INTEGER NOT NULL DEFAULT 1,
    `auction_source` VARCHAR(191) NULL,
    `lot_number` VARCHAR(191) NULL,
    `origin_port` VARCHAR(191) NULL,
    `destination_port` VARCHAR(191) NULL,
    `vessel_name` VARCHAR(191) NULL,
    `estimated_arrival` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `orders_order_number_key`(`order_number`),
    UNIQUE INDEX `orders_tracking_code_key`(`tracking_code`),
    INDEX `orders_status_idx`(`status`),
    INDEX `orders_tracking_code_idx`(`tracking_code`),
    INDEX `orders_order_number_idx`(`order_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_status_history` (
    `id` VARCHAR(191) NOT NULL,
    `status` ENUM('WON', 'PAID', 'SHIPPING', 'PORT', 'DELIVERED') NOT NULL,
    `stage` INTEGER NOT NULL,
    `note` TEXT NULL,
    `location` VARCHAR(191) NULL,
    `changed_by` VARCHAR(191) NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `order_status_history_order_id_idx`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `customer_name` VARCHAR(191) NOT NULL,
    `customer_city` VARCHAR(191) NULL,
    `customer_avatar` VARCHAR(191) NULL,
    `rating` INTEGER NOT NULL,
    `text` TEXT NOT NULL,
    `car_make` VARCHAR(191) NULL,
    `car_model` VARCHAR(191) NULL,
    `car_year` INTEGER NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `reviews_is_published_idx`(`is_published`),
    INDEX `reviews_rating_idx`(`rating`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_photos` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `alt_text` VARCHAR(191) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `review_id` VARCHAR(191) NOT NULL,

    INDEX `review_photos_review_id_idx`(`review_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `completed_deals` (
    `id` VARCHAR(191) NOT NULL,
    `car_make` VARCHAR(191) NOT NULL,
    `car_model` VARCHAR(191) NOT NULL,
    `car_year` INTEGER NOT NULL,
    `car_vin` VARCHAR(191) NULL,
    `auction_price` DECIMAL(12, 2) NOT NULL,
    `market_price` DECIMAL(12, 2) NOT NULL,
    `savings` DECIMAL(12, 2) NOT NULL,
    `delivery_city` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `completed_deals_is_published_idx`(`is_published`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `completed_deal_photos` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `alt_text` VARCHAR(191) NULL,
    `photo_type` ENUM('BEFORE', 'AFTER') NOT NULL DEFAULT 'AFTER',
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `completed_deal_id` VARCHAR(191) NOT NULL,

    INDEX `completed_deal_photos_completed_deal_id_idx`(`completed_deal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_posts` ADD CONSTRAINT `blog_posts_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `blog_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_posts` ADD CONSTRAINT `blog_posts_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_post_tags` ADD CONSTRAINT `blog_post_tags_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `blog_posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_post_tags` ADD CONSTRAINT `blog_post_tags_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `blog_tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_reactions` ADD CONSTRAINT `blog_reactions_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `blog_posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_status_history` ADD CONSTRAINT `order_status_history_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_photos` ADD CONSTRAINT `review_photos_review_id_fkey` FOREIGN KEY (`review_id`) REFERENCES `reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `completed_deal_photos` ADD CONSTRAINT `completed_deal_photos_completed_deal_id_fkey` FOREIGN KEY (`completed_deal_id`) REFERENCES `completed_deals`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

