interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'matheuskiel@fiorifer.com.br',
      name: 'Matheus Kielkowski',
    },
  },
} as IMailConfig;
