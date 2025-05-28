declare namespace API {
  type BaseResponseBoolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseInteger = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseListSpace = {
    code?: number;
    data?: Space[];
    message?: string;
  };

  type BaseResponseListSpaceCategoryAnalyseResponse = {
    code?: number;
    data?: SpaceCategoryAnalyseResponse[];
    message?: string;
  };

  type BaseResponseListSpaceLevel = {
    code?: number;
    data?: SpaceLevel[];
    message?: string;
  };

  type BaseResponseListSpaceSizeAnalyseResponse = {
    code?: number;
    data?: SpaceSizeAnalyseResponse[];
    message?: string;
  };

  type BaseResponseListSpaceTagAnalyseResponse = {
    code?: number;
    data?: SpaceTagAnalyseResponse[];
    message?: string;
  };

  type BaseResponseListSpaceUserAnalyseResponse = {
    code?: number;
    data?: SpaceUserAnalyseResponse[];
    message?: string;
  };

  type BaseResponseListSpaceUserVO = {
    code?: number;
    data?: SpaceUserVO[];
    message?: string;
  };

  type BaseResponseLoginUserVO = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

  type BaseResponseLong = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePagePicture = {
    code?: number;
    data?: PagePicture;
    message?: string;
  };

  type BaseResponsePagePictureVO = {
    code?: number;
    data?: PagePictureVO;
    message?: string;
  };

  type BaseResponsePageSpace = {
    code?: number;
    data?: PageSpace;
    message?: string;
  };

  type BaseResponsePageSpaceVO = {
    code?: number;
    data?: PageSpaceVO;
    message?: string;
  };

  type BaseResponsePageUserVO = {
    code?: number;
    data?: PageUserVO;
    message?: string;
  };

  type BaseResponsePicture = {
    code?: number;
    data?: Picture;
    message?: string;
  };

  type BaseResponsePictureTagCategory = {
    code?: number;
    data?: PictureTagCategory;
    message?: string;
  };

  type BaseResponsePictureVO = {
    code?: number;
    data?: PictureVO;
    message?: string;
  };

  type BaseResponseSpace = {
    code?: number;
    data?: Space;
    message?: string;
  };

  type BaseResponseSpaceUsageAnalyseResponse = {
    code?: number;
    data?: SpaceUsageAnalyseResponse;
    message?: string;
  };

  type BaseResponseSpaceUser = {
    code?: number;
    data?: SpaceUser;
    message?: string;
  };

  type BaseResponseSpaceVO = {
    code?: number;
    data?: SpaceVO;
    message?: string;
  };

  type BaseResponseString = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUser = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserVO = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type DeleteRequest = {
    id?: number;
  };

  type getPictureByIdParams = {
    id: number;
  };

  type getPictureVOByIdParams = {
    id: number;
  };

  type getSpaceByIdParams = {
    id: number;
  };

  type getSpaceVOByIdParams = {
    id: number;
  };

  type getUserByIdParams = {
    id: number;
  };

  type getUserVOByIdParams = {
    id: number;
  };

  type LoginUserVO = {
    id?: number;
    userAccount?: string;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole?: string;
    editTime?: string;
    createTime?: string;
  };

  type OrderItem = {
    column?: string;
    asc?: boolean;
  };

  type PagePicture = {
    records?: Picture[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PagePicture;
    searchCount?: PagePicture;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PagePictureVO = {
    records?: PictureVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PagePictureVO;
    searchCount?: PagePictureVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageSpace = {
    records?: Space[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageSpace;
    searchCount?: PageSpace;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageSpaceVO = {
    records?: SpaceVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageSpaceVO;
    searchCount?: PageSpaceVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type PageUserVO = {
    records?: UserVO[];
    total?: number;
    size?: number;
    current?: number;
    orders?: OrderItem[];
    optimizeCountSql?: PageUserVO;
    searchCount?: PageUserVO;
    optimizeJoinOfCountSql?: boolean;
    maxLimit?: number;
    countId?: string;
    pages?: number;
  };

  type Picture = {
    id?: number;
    url?: string;
    name?: string;
    introduction?: string;
    category?: string;
    tags?: string;
    picSize?: number;
    picWidth?: number;
    picHeight?: number;
    picScale?: number;
    picFormat?: string;
    creatorId?: number;
    spaceId?: number;
    createTime?: string;
    editTime?: string;
    updateTime?: string;
    isDeleted?: number;
    reviewStatus?: number;
    reviewMessage?: string;
    reviewerId?: number;
    reviewTime?: string;
  };

  type PictureEditByBatchRequest = {
    pictureIdList?: number[];
    spaceId?: number;
    category?: string;
    tags?: string[];
    namingRule?: string;
  };

  type PictureEditRequest = {
    id?: number;
    name?: string;
    introduction?: string;
    category?: string;
    tags?: string[];
  };

  type PictureQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    id?: number;
    name?: string;
    introduction?: string;
    category?: string;
    tags?: string[];
    picSize?: number;
    picWidth?: number;
    picHeight?: number;
    picScale?: number;
    picFormat?: string;
    creatorId?: number;
    searchText?: string;
    reviewStatus?: number;
    reviewMessage?: string;
    reviewerId?: number;
    spaceId?: number;
    nullSpaceId?: boolean;
    startEditTime?: string;
    endEditTime?: string;
  };

  type PictureReviewRequest = {
    id?: number;
    reviewStatus?: number;
    reviewMessage?: string;
  };

  type PictureTagCategory = {
    tagList?: string[];
    categoryList?: string[];
  };

  type PictureUpdateRequest = {
    id?: number;
    name?: string;
    introduction?: string;
    category?: string;
    tags?: string[];
  };

  type PictureUploadRequest = {
    id?: number;
    fileUrl?: string;
    picName?: string;
    spaceId?: number;
  };

  type PictureVO = {
    id?: number;
    url?: string;
    name?: string;
    introduction?: string;
    category?: string;
    tags?: string[];
    picSize?: number;
    picWidth?: number;
    picHeight?: number;
    picScale?: number;
    picFormat?: string;
    creatorId?: number;
    spaceId?: number;
    createTime?: string;
    editTime?: string;
    updateTime?: string;
    creator?: UserVO;
    permissionList?: string[];
  };

  type Space = {
    id?: number;
    spaceName?: string;
    spaceLevel?: number;
    maxSize?: number;
    maxCount?: number;
    totalSize?: number;
    totalCount?: number;
    creatorId?: number;
    createTime?: string;
    editTime?: string;
    updateTime?: string;
    isDeleted?: number;
    spaceType?: number;
  };

  type SpaceAddRequest = {
    spaceName?: string;
    spaceLevel?: number;
    spaceType?: number;
  };

  type SpaceCategoryAnalyseRequest = {
    spaceId?: number;
    queryPublic?: boolean;
    queryAll?: boolean;
  };

  type SpaceCategoryAnalyseResponse = {
    category?: string;
    count?: number;
    totalSize?: number;
  };

  type SpaceEditRequest = {
    id?: number;
    spaceName?: string;
  };

  type SpaceLevel = {
    value?: number;
    text?: string;
    maxSize?: number;
    maxCount?: number;
  };

  type SpaceQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    id?: number;
    spaceName?: string;
    spaceLevel?: number;
    creatorId?: number;
    spaceType?: number;
  };

  type SpaceRankAnalyseRequest = {
    topN?: number;
  };

  type SpaceSizeAnalyseRequest = {
    spaceId?: number;
    queryPublic?: boolean;
    queryAll?: boolean;
  };

  type SpaceSizeAnalyseResponse = {
    sizeRange?: string;
    count?: number;
  };

  type SpaceTagAnalyseRequest = {
    spaceId?: number;
    queryPublic?: boolean;
    queryAll?: boolean;
  };

  type SpaceTagAnalyseResponse = {
    tag?: string;
    count?: number;
  };

  type SpaceUpdateRequest = {
    id?: number;
    spaceName?: string;
    spaceLevel?: number;
    maxSize?: number;
    maxCount?: number;
  };

  type SpaceUsageAnalyseRequest = {
    spaceId?: number;
    queryPublic?: boolean;
    queryAll?: boolean;
  };

  type SpaceUsageAnalyseResponse = {
    usedSize?: number;
    maxSize?: number;
    sizeUsageRatio?: number;
    usedCount?: number;
    maxCount?: number;
    countUsageRatio?: number;
  };

  type SpaceUser = {
    id?: number;
    spaceId?: number;
    userId?: number;
    role?: string;
    createTime?: string;
    updateTime?: string;
  };

  type SpaceUserAddRequest = {
    spaceId?: number;
    userId?: number;
    role?: string;
  };

  type SpaceUserAnalyseRequest = {
    spaceId?: number;
    queryPublic?: boolean;
    queryAll?: boolean;
    userId?: number;
    timeDimension?: string;
  };

  type SpaceUserAnalyseResponse = {
    period?: string;
    count?: number;
  };

  type SpaceUserEditRequest = {
    id?: number;
    role?: string;
  };

  type SpaceUserQueryRequest = {
    id?: number;
    spaceId?: number;
    userId?: number;
    role?: string;
  };

  type SpaceUserVO = {
    id?: number;
    spaceId?: number;
    userId?: number;
    role?: string;
    createTime?: string;
    updateTime?: string;
    userVO?: UserVO;
    spaceVO?: SpaceVO;
  };

  type SpaceVO = {
    id?: number;
    spaceName?: string;
    spaceLevel?: number;
    maxSize?: number;
    maxCount?: number;
    totalSize?: number;
    totalCount?: number;
    creatorId?: number;
    createTime?: string;
    editTime?: string;
    updateTime?: string;
    spaceType?: number;
    permissionList?: string[];
    creator?: UserVO;
  };

  type testDeleteParams = {
    filePath: string;
  };

  type testDownloadParams = {
    filePath: string;
  };

  type UploadPictureByBatchRequest = {
    searchText?: string;
    count?: number;
    namePrefix?: string;
  };

  type uploadPictureParams = {
    pictureUploadRequest: PictureUploadRequest;
  };

  type User = {
    id?: number;
    userAccount?: string;
    userPassword?: string;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole?: string;
    editTime?: string;
    createTime?: string;
    updateTime?: string;
    isDeleted?: number;
  };

  type UserAddRequest = {
    userAccount?: string;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    id?: number;
    userAccount?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRegisterRequest = {
    userAccount?: string;
    userPassword?: string;
    checkPassword?: string;
  };

  type UserUpdateRequest = {
    id?: number;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserVO = {
    id?: number;
    userAccount?: string;
    userName?: string;
    userAvatar?: string;
    userProfile?: string;
    userRole?: string;
    createTime?: string;
  };
}
