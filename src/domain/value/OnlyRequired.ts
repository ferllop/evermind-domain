export type OnlyRequired<T, K extends keyof T> = Partial<T> & Pick<T, K>;
