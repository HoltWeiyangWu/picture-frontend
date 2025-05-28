
import request from "@/request";

export async function addSpaceUser(
  body: API.SpaceUserAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>("/spaceUser/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteSpaceUser(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/spaceUser/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function editSpaceUser(
  body: API.SpaceUserEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/spaceUser/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function getSpaceUser(
  body: API.SpaceUserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseSpaceUser>("/spaceUser/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function listSpaceUser(
  body: API.SpaceUserQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceUserVO>("/spaceUser/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function listMyTeamSpace(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSpaceUserVO>("/spaceUser/list/my", {
    method: "POST",
    ...(options || {}),
  });
}
