import container from './config/container.js';

const server = container.resolve('server');

let shuttingDown = false;

async function shutdown(exitCode = 0) {
    if (shuttingDown) return;
    shuttingDown = true;

    const timer = setTimeout(() => {
        console.error('Arrêt forcé après délai dépassé');
        process.exit(1);
    }, 10_000);
    timer.unref();

    try {
        await server.stop();
        process.exitCode = exitCode;
    } catch (error) {
        console.error('Failed to stop Strada:', error);
        process.exitCode = 1;
    }
}

process.once('SIGINT', () => shutdown(0));
process.once('SIGTERM', () => shutdown(0));

try {
    await server.start();
} catch (error) {
    console.error('Failed to start Strada:', error);
    await shutdown(1);
}