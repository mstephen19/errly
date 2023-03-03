type UnPromisify<T> = T extends Promise<infer I> ? UnPromisify<I> : T;

type RegularFunction<T = any> = (...args: any[]) => T;
type AsyncFunction<T = Promise<any>> = (...args: any[]) => T;
type AnyFunction = RegularFunction | AsyncFunction;

type Handled<Func extends AnyFunction> = [UnPromisify<ReturnType<Func>>, null] | [null, Error];

export function e<Func extends AsyncFunction>(func: Func): Promise<Handled<Func>>;
export function e<Func extends RegularFunction>(func: Func): Handled<Func>;
export function e<Func extends AnyFunction>(func: Func): Handled<Func> | Promise<Handled<Func>> {
    try {
        const data = func();

        if (data instanceof Promise) {
            return (async () => {
                try {
                    const resolved = await data;
                    return [resolved, null];
                } catch (error) {
                    return [null, error as Error];
                }
            })();
        }

        return [data, null];
    } catch (error) {
        return [null, error as Error];
    }
}

export function func<Func extends AsyncFunction>(func: Func): (...args: Parameters<Func>) => Promise<Handled<Func>>;
export function func<Func extends RegularFunction>(func: Func): (...args: Parameters<Func>) => Handled<Func>;
export function func<Func extends AnyFunction>(
    func: Func
): ((...args: Parameters<Func>) => Promise<Handled<Func>>) | ((...args: Parameters<Func>) => Handled<Func>) {
    return (...args: Parameters<Func>) => e(func.bind(func, ...args));
}
