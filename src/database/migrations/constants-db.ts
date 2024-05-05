/**
 * This file contains all the constants that are used in the database.
 * These constants are used to create tables, columns, and constraints in the database.
 */

export const DOES_ENUM_PRICE_FORMULE_TYPE_EXIST = `
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'type_price_formule_enum') THEN
        CREATE TYPE "type_price_formule_enum" AS ENUM('SOLO', 'DUO', 'FAMILY');
    END IF;
END
$$;
`;

export const DOES_ENUM_USER_ROLE_EXIST = `
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE "user_role_enum" AS ENUM('USER', 'ADMIN');
    END IF;
END
$$;
`;

export const DOES_ENUM_STATUS_RESERVATION_EXIST = `
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_reservation_enum') THEN
        CREATE TYPE "status_reservation_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED','CANCELLED');
    END IF;
END
$$;
`;

export const DOES_ENUM_CATEGORY_TYPE_EXIST = `
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'category_type_enum') THEN
        CREATE TYPE "category_type_enum" AS ENUM('ATHLETICS', 'BASKETBALL', 'CYCLING', 'FOOTBALL', 'GYMNASTICS', 'SWIMMING', 'TENNIS', 'VOLLEYBALL');
    END IF;
END
$$;
`;
