export const DOES_ENUM_OFFER_TYPE_EXIST = `
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'type_offer_enum') THEN
        CREATE TYPE "type_offer_enum" AS ENUM('SOLO', 'DUO', 'FAMILY');
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
