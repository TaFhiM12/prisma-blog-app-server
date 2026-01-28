type IOptions = {
    page?: string | number;
    limit?: string | number;
    sortOrder?: string;
    sortBy?: string;
}

type IReturn = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}

const paginationHelper = (options: IOptions): IReturn => {
    const page:number = Number(options.page) || 1;
    const limit: number = Number(options.limit) || 10;
    const skip = (page-1)*limit;
    const sortBy: string = options.sortBy || "createdAt";
    const sortOrder: string = options.sortOrder || "desc" 
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}

export default paginationHelper;