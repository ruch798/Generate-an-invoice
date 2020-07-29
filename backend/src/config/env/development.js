export const devConfig = {
    port: 3000,
    database: 'invoice-builder',
    secret: '',
    frontendURL: 'http://localhost:4200',
    
    twitter:{
      consumerKey: '',
      consumerSecret:'',
      callbackURL:'http://localhost:3000/api/auth/twitter/callback',
      userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    },
  ethereal: {
    username: 'jalon.cummings@ethereal.email',
    password: '',
    host: 'smtp.ethereal.email',
    port: 587,
  }

  };

