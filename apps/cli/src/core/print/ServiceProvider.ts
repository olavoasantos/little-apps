import {ChalkPrint} from './data/classes/ChalkPrint';

export const ServiceProvider: Micra.ServiceProvider = {
  /**
   * Register any Print services.
   */
  async register({container}) {
    container.singleton('print', ChalkPrint);
  },

  /**
   * Bootstrap any Print services.
   */
  async boot() {
    //
  },
};
