#!/usr/bin/env node
import {createServer} from 'vite';
import {ViteNodeServer} from 'vite-node/server';
import {ViteNodeRunner} from 'vite-node/client';
import {join} from 'path';
import * as url from 'url';

function millisecondsToStr(milliseconds) {
  function numberEnding(number) {
    return number > 1 ? 's' : '';
  }

  let temp = Math.floor(milliseconds / 1000);
  const years = Math.floor(temp / 31536000);
  if (years) {
    return `${years} year${numberEnding(years)}`;
  }

  const days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    return `${days} day${numberEnding(days)}`;
  }
  const hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return `${hours} h`;
  }
  const minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return `${minutes} min`;
  }
  const seconds = temp % 60;
  if (seconds) {
    return `${seconds} s`;
  }
  return `${milliseconds} ms`;
}

function measureTime() {
  const start = process.hrtime();
  return function stopTimer() {
    const elapsed = process.hrtime(start);
    const ms = Number((elapsed[0] + elapsed[1] / 1e9).toFixed(3));
    return millisecondsToStr(ms);
  };
}

const stop = measureTime();
process.on('exit', () => {
  const time = stop();
  console.log(`Done in ${time}`);
});

(async function main() {
  const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
  const server = await createServer({
    resolve: {
      alias: {
        '@': join(__dirname, 'src'),
      },
    },
    optimizeDeps: {
      disabled: true,
    },
  });

  await server.pluginContainer.buildStart({});
  const node = new ViteNodeServer(server);
  const runner = new ViteNodeRunner({
    root: server.config.root,
    base: server.config.base,
    fetchModule(id) {
      return node.fetchModule(id);
    },
    resolveId(id, importer) {
      return node.resolveId(id, importer);
    },
  });
  await runner.executeFile(join(__dirname, './src/index.cli.ts'));
  await server.close();
})();
