// disableConsole.js
export default function disableConsole() {
    const noop = () => {};
    const methods = ['log', 'warn', 'error', 'info'];

    methods.forEach((method) => {
        console[method] = noop;
    });
}
