export type Value = 
    string | number | boolean | undefined | 
    (string | number | boolean | undefined)[]

export type KeyOf<T extends Record<string, any>> = keyof T & string

