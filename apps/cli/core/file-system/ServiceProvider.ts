import {File, Directory} from './data';

export const ServiceProvider: Micra.ServiceProvider = {
  /**
   * Register any File services.
   */
  async register({container}) {
    container.value('File', File);
    container.value('Directory', Directory);
  },
};
