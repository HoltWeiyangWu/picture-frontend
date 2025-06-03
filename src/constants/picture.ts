export const PIC_REVIEW_STATUS_ENUM = {
    REVIEWING: 0,
    PASS: 1,
    REJECTED: 2
}

export const PIC_REVIEW_STATUS_MAP = {
    0: 'Reviewing',
    1: 'Pass',
    2: 'Rejected'
}

export const PIC_REVIEW_STATUS_OPTIONS = Object.keys(PIC_REVIEW_STATUS_MAP).map(key => {
    return {
        label: PIC_REVIEW_STATUS_MAP[key],
        value: key
    }
})

export const PICTURE_EDIT_MESSAGE_TYPE_ENUM = {
    INFO: "INFO",
    ERROR: "ERROR",
    ENTER_EDIT: "ENTER_EDIT",
    EXIT_EDIT: "EXIT_EDIT",
    EDIT_ACTION: "EDIT_ACTION",
};

export const PICTURE_EDIT_ACTION_ENUM = {
    ZOOM_IN: "zoom in",
    ZOOM_OUT: "zoom out",
    ROTATE_LEFT: "rotate left",
    ROTATE_RIGHT: "rotate right",
}
