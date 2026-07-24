import { readonly } from "@angular/forms/signals";

export interface CreateAspectRequest {
    readonly aspectName: string,
    readonly aspectColor: string
}
