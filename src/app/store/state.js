import uuidv4 from 'uuid/v4'

import GzlyI18n from '../config/i18n'

import logo from '../assets/logo.svg'

export default {
  status: {
    show: false,
    messages: []
  },
  customers: {
    selected: undefined,
    items: [],
    isFetching: false,
    didInvalidate: false
  },
  order_processes: {
    selected: undefined,
    items: [],
    isFetching: false,
    didInvalidate: false
  },
  settings: {
    company: {
      defaults: {
        logo: logo,
        signature: logo,
        customer_number_length: 5,
        customer_number_prefix: 'HD-'
      },
      contact: {
        company: '',
        owner: '',
        phone: '',
        email: '',
        website: '',
        city: '',
        zipCode: '',
        street: ''
      }
    },
    app_settings: {
      theme: 'dark',
      language: GzlyI18n.EN,
      price_unit: '€',
      tax: 19
    },
    default_texts: {
      offer: {
        offer_index: '',
        intro: '',
        outro: ''
      },
      invoice: {
        invoice_index: '',
        intro: '',
        outro: ''
      },
      footer: []
    }
  }
}
