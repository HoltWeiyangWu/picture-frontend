
import request from "@/request";

export async function deletePicture(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/picture/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function editPicture(
  body: API.PictureEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/picture/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function getPictureById(
  params: API.getPictureByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePicture>("/picture/get", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getPictureVoById(
  params: API.getPictureVOByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePictureVO>("/picture/get/vo", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function listPictureByPage(
  body: API.PictureQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePicture>("/picture/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function listPictureVoByPage(
  body: API.PictureQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePictureVO>("/picture/list/page/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function listPictureTagCategory(options?: { [key: string]: any }) {
  return request<API.BaseResponsePictureTagCategory>("/picture/tag_category", {
    method: "GET",
    ...(options || {}),
  });
}

export async function updatePicture(
  body: API.PictureUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>("/picture/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function uploadPicture(
  params: API.uploadPictureParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePictureVO>("/picture/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      ...params,
      pictureUploadRequest: undefined,
      ...params["pictureUploadRequest"],
    },
    data: body,
    ...(options || {}),
  });
}
