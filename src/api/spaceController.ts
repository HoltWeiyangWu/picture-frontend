import request from "@/request";

export async function addSpace(
  body: API.SpaceAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong>("/space/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteSpace(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/space/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function editSpace(
  body: API.SpaceEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/space/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function getSpaceById(
  params: API.getSpaceByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseSpace>("/space/get", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getSpaceVoById(
  params: API.getSpaceVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseSpaceVO>("/space/get/vo", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function listSpaceLevels(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSpaceLevel>("/space/list/level", {
    method: "GET",
    ...(options || {}),
  });
}

export async function listSpaceByPage(
  body: API.SpaceQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageSpace>("/space/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function listSpaceVoByPage(
  body: API.SpaceQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageSpaceVO>("/space/list/page/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function updateSpace(
  body: API.SpaceUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/space/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
