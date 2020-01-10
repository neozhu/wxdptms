export default function(options = {}) {
  return Page({
    onShareAppMessage() {
      return {
        title: 'TMS App'
      };
    },
    ...options
  });
}
