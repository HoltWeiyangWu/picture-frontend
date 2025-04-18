
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
    params: API.uploadPictureUsingPOSTParams,
    body: {},
    file?: File,
    options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.BaseResponsePictureVO_>('/picture/upload', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}
