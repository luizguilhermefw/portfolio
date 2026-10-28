import { emitKeypressEvents } from 'node:readline';

export function readPassword(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = process.stdin;
    let value = '';
    const wasRaw = input.isRaw;
    process.stdout.write(prompt);
    emitKeypressEvents(input);
    input.setRawMode(true);
    input.resume();
    const cleanup = () => {
      input.removeListener('keypress', onKey);
      input.setRawMode(wasRaw);
      input.pause();
      process.stdout.write('\n');
    };
    const onKey = (text: string | undefined, key: { name?: string; ctrl?: boolean; meta?: boolean }) => {
      if (key?.ctrl && key.name === 'c') { cleanup(); reject(new Error('Cancelado')); return; }
      if (key?.name === 'return') { cleanup(); resolve(value); return; }
      if (key?.name === 'backspace') { value = value.slice(0, -1); return; }
      if (!key?.ctrl && !key?.meta && text && !/[\x00-\x1f\x7f]/.test(text) && value.length + text.length <= 1024) value += text;
    };
    input.on('keypress', onKey);
  });
}
