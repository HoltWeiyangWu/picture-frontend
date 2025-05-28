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

export const SPACE_TYPE_ENUM = {
    PRIVATE: 0,
    TEAM: 1
}

export const SPACE_TYPE_MAP:Record<number, string> = {
    0: "Private space",
    1: "Team space",
}

export const SPACE_TYPE_OPTIONS = Object.keys(SPACE_TYPE_MAP).map((key) => {
    const value = Number(key)
    return {
        label: SPACE_TYPE_MAP[value],
        value,
    }
})

export const SPACE_ROLE_ENUM = {
    VIEWER: "viewer",
    EDITOR: "editor",
    ADMIN: "admin",
} as const;

export const SPACE_ROLE_MAP: Record<string, string> = {
    viewer: "viewer",
    editor: "editor",
    admin: "admin",
}

export const SPACE_ROLE_OPTIONS = Object.keys(SPACE_ROLE_MAP).map((key) => {
    return {
        label: SPACE_ROLE_MAP[key],
        value: key,
    }
})

export const SPACE_PERMISSION_ENUM = {
    SPACE_USER_MANAGE: "spaceUser:manage",
    PICTURE_VIEW: "picture:view",
    PICTURE_UPLOAD: "picture:upload",
    PICTURE_EDIT: "picture:edit",
    PICTURE_DELETE: "picture:delete",
} as const;