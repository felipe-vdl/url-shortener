CREATE TABLE `shortened_urls` (
	`id` varchar(6) NOT NULL,
	`target` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `shortened_urls_id` PRIMARY KEY(`id`)
);
