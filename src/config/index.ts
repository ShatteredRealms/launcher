export const fileProtocol = 'sro'
export const authPrefix = fileProtocol + '://auth.local';

export function escapeRegExp(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
