export type MayBeIdentified<T> = Omit<T, 'id'> | T;
