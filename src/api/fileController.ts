
import request from "@/request";

export async function testDownload(
  params: API.testDownloadParams,
  options?: { [key: string]: any }
) {
  return request<any>("/test/download", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function testUpload(body: {}, options?: { [key: string]: any }) {
  return request<API.BaseResponseString>("/test/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
