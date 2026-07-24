export interface GeneralResponseDto<T> {
    readonly isSuccess: boolean;
    readonly message: string;
    readonly data: T;
}
