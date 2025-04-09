import ACCESS_ENUM from "@/access/accessEnum.ts";

const hasAccess = (loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
    // Check if authentication is required
    if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
        return true
    }
    const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN

    // Not-login user cannot access authorised contents
    if (needAccess === ACCESS_ENUM.USER && loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
        return false
    }
    // Only admin can access administrator's contents
    if (needAccess === ACCESS_ENUM.ADMIN && loginUserAccess !== ACCESS_ENUM.ADMIN) {
        return false
    }
    return true
}

export default hasAccess;