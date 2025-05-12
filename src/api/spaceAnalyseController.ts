import request from "@/request";

export async function getSpaceCategoryAnalyse(
  body: API.SpaceCategoryAnalyseRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceCategoryAnalyseResponse>(
    "/space/analyse/category",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

export async function getSpaceRankAnalyze(
  body: API.SpaceRankAnalyseRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpace>("/space/analyse/rank", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

export async function getSpaceSizeAnalyse(
  body: API.SpaceSizeAnalyseRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceSizeAnalyseResponse>(
    "/space/analyse/size",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

export async function getSpaceTagAnalyse(
  body: API.SpaceTagAnalyseRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceTagAnalyseResponse>(
    "/space/analyse/tag",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

export async function getSpaceUsageAnalyse(
  body: API.SpaceUsageAnalyseRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseSpaceUsageAnalyseResponse>(
    "/space/analyse/usage",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

export async function getSpaceUserAnalyse(
  body: API.SpaceUserAnalyseRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceUserAnalyseResponse>(
    "/space/analyse/user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}
