import { Page,Scroll } from "./page.model";

/**
 * An array of data with an associated page object used for paging
 */
export interface  PageData<T> {
    Data?: Array<T>;
    Page?: Page;
}

export interface ScrollData<T> {
    Data?: Array<T>;
    Scroll?: Scroll;
}