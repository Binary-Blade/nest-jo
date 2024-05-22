/**
 * Database enum types with their possible values.
 * @constant
 * @type {Record<string, string[]>}
 */
const ENUM_TYPES_DB: Record<string, string[]> = {
  type_price_formule: ['SOLO', 'DUO', 'FAMILY'],
  user_role: ['USER', 'ADMIN'],
  status_reservation: ['APPROVED', 'REJECTED', 'CANCELLED'],
  category_type: [
    'ARCHERY',
    'ATHLETICS',
    'BADMINTON',
    'BASKETBALL',
    'BOXING',
    'CANOE_KAYAK',
    'CYCLING',
    'DIVING',
    'FENCING',
    'FOOTBALL',
    'GYMNASTICS',
    'HANDBALL',
    'ROWING',
    'SAILING',
    'SWIMMING',
    'TABLE_TENNIS',
    'TENNIS',
    'VOLLEYBALL',
    'WEIGHTLIFTING',
    'KARATE'
  ]
};

/**
 * Generates SQL for creating an enum type if it does not already exist.
 *
 * @param {string} typeName - The name of the enum type.
 * @param {string[]} values - The values for the enum type.
 * @returns {string} - The SQL command to create the enum type.
 *
 * @example
 * const sql = createEnumType('user_role_enum', ['USER', 'ADMIN']);
 */
const createEnumType = (typeName: string, values: string[]): string => `
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${typeName}') THEN
        CREATE TYPE "${typeName}" AS ENUM(${values.map(value => `'${value}'`).join(', ')});
    END IF;
END
$$;
`;

/**
 * SQL command to check and create the type_price_formule_enum if it does not exist.
 * @constant
 * @type {string}
 *
 * @example
 * console.log(DOES_ENUM_PRICE_FORMULE_TYPE_EXIST);
 */
export const DOES_ENUM_PRICE_FORMULE_TYPE_EXIST: string = createEnumType(
  'type_price_formule_enum',
  ENUM_TYPES_DB.type_price_formule
);

/**
 * SQL command to check and create the user_role_enum if it does not exist.
 * @constant
 * @type {string}
 *
 * @example
 * console.log(DOES_ENUM_USER_ROLE_EXIST);
 */
export const DOES_ENUM_USER_ROLE_EXIST: string = createEnumType(
  'user_role_enum',
  ENUM_TYPES_DB.user_role
);

/**
 * SQL command to check and create the status_reservation_enum if it does not exist.
 * @constant
 * @type {string}
 *
 * @example
 * console.log(DOES_ENUM_STATUS_RESERVATION_EXIST);
 */
export const DOES_ENUM_STATUS_RESERVATION_EXIST: string = createEnumType(
  'status_reservation_enum',
  ENUM_TYPES_DB.status_reservation
);

/**
 * SQL command to check and create the category_type_enum if it does not exist.
 * @constant
 * @type {string}
 *
 * @example
 * console.log(DOES_ENUM_CATEGORY_TYPE_EXIST);
 */
export const DOES_ENUM_CATEGORY_TYPE_EXIST: string = createEnumType(
  'category_type_enum',
  ENUM_TYPES_DB.category_type
);
