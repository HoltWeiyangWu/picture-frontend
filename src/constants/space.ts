export const SPACE_LEVEL_ENUM = {
    PERSONAL: 0,
    PROFESSIONAL: 1,
    FLAGSHIP: 2,
} as const;

export const SPACE_LEVEL_MAP = {
    0: 'Personal',
    1: 'Professional',
    2: 'Flagship',
};

export const SPACE_LEVEL_OPTIONS = Object.keys(SPACE_LEVEL_MAP).map((key) => {
    const value = Number(key); // Convert string key to number
    return {
        label: SPACE_LEVEL_MAP[value],
        value,
    };
});
