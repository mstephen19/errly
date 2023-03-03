# Errly

[![Install size](https://packagephobia.com/badge?p=errly@latest)](https://packagephobia.com/result?p=errly@latest)

Error handling in JavaScript is done using [`try...catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) blocks, which can get messy and verbose very quickly. **Errly** makes the error handling experience similar to that of [Golang](https://go.dev/).

## Features

- Zero dependencies. Small bundle size.
- Written in TypeScript.
- Seamless support for synchronous & asynchronous functions.
- Modern [ESModules](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/) support.

## Usage

Consider the following function:

```TypeScript
const throwIfEven = (num: number) => {
    if (!(num % 2)) throw new Error("It's even!");
    return num;
};
```

Here's how you would normally handle errors from calls to `throwIfEven`:

```TypeScript
function main() {
    try {
        // Happy path:
        const data = throwIfEven(6);
        console.log(data);
        // ...
    } catch (error) {
        // Sad path:
        console.log((error as Error).message);
        return;
    }
}
```

One issue here is that `data` is now scoped to the `try` block, and cannot be used outside of it. Same goes for `error` being scoped to the `catch` block. Here's how the same piece of logic looks when using Errly to handle the error:

```TypeScript
import { e } from 'errly';

function main() {
    // Scoped to the function.
    const [data, err] = e(() => throwIfEven(6));
    // Write error handling logic first.
    if (err !== null) {
        // Sad path:
        console.log(err.message);
        return;
    }
    // Happy path:

    // TypeScript will understand that "data" is
    // definitely a number and can't be null because
    // the error path was handled above.
    console.log(data);
    // ...
}
```

## With async code

Usage with async functions is the same as above with only the addition of the `await` keyword.

```TypeScript
const doStuff = async () => {
    // Wait for two seconds
    await new Promise((r) => setTimeout(r, 2e3));
    throw new Error('foo');
};

const [_, err] = await e(() => doStuff());
if (err !== null) {
    // Handle error
}
```

## Creating new functions

If using `e()` all the time doesn't seem like your style, you can instead convert regular functions into Errly functions by using `func()`.

```TypeScript
import { func } from 'errly';

const add = func((n1: number, n2: number) => {
    const sum = n1 + n2;
    if (sum > 100) {
        throw new Error('Sum is massive!');
    }

    return sum;
});

const [sum, err] = add(1337, 420);
if (err !== null) {
    // Handle error
}
```
