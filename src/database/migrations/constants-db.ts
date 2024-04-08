export const DOES_ENUM_OFFER_TYPE_EXIST = `
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'type_offer_enum') THEN
        CREATE TYPE "type_offer_enum" AS ENUM('SOLO', 'DUO', 'FAMILY');
    END IF;
END
$$;
`;
