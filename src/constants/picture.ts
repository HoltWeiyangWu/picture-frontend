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

