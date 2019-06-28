import GzlyI18n from "../config/i18n";

export default {
  translate: (state) => (key, data = null) => {
    if (!key) {
      return undefined;
    }
    return GzlyI18n.translate(key, state.settings.app_settings.language, data);
  },
  dateFormat: (state) => {
    return GzlyI18n.dateFormat(state.settings.app_settings.language);
  },
  dateTimeFormat: (state) => {
    return GzlyI18n.dateTimeFormat(state.settings.app_settings.language);
  },
  getUniqueCustomerId: (state) => {
    let min = '';
    let max = '';

    for (let i = 0; i < state.settings.company.defaults.customer_number_length; i++) {
      if (i === 0) {
        min += '1';
      } else {
        min += '0';
      }
      max += '9'
    }

    min = parseInt(min);
    max = parseInt(max);
    let doublets = 0;
    let randomCustomNumber = '';
    do {
      randomCustomNumber = state.settings.company.defaults.customer_number_prefix +''+ (Math.round(Math.random() * (max - min)) + min);
      doublets = state.customers.items.filter(c => c.customer_number === randomCustomNumber);
    } while (doublets.length > 1);

    return randomCustomNumber;
  },
  isUniqueCustomerId: (state) => (number) => {
    let doublets = state.customers.items.filter(c => c.customer_number === number);
    return doublets.length <= 0;
  }
};
