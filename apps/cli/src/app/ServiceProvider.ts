export const ServiceProvider: Micra.ServiceProvider = {
  async register() {
    //
  },
  async boot() {
    await import('@/commands');
  },
};
