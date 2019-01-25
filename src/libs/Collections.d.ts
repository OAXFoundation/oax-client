export declare class DefaultDict<T, Q> extends Map<T, Q> {
    private readonly defaultFactory;
    constructor(defaultFactory: () => Q, entries?: ReadonlyArray<[T, Q]> | null);
    get(name: T): Q;
}
