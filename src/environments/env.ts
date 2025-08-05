// export const environment={
//     production:false,

//     // development strapi base URl
//     api_base_url:'http://localhost:1337/'
// }
// path: ./config/plugins.ts

export const environment = {
  production: false,
  // For local development
  apiUrl: 'http://localhost:1337/api/',
  // For production
  // apiUrl: 'https://api.watchpartymeetup.com/api/',

  stripePublicKey: 'pk_test_51RmHHP2QR1ApwGD9H0yH3uIoY5pFdHaXnCq7UZiPK9Ld9hZ8YB9OGgom1J34vQiYqvOC381KHSjXpmRgSnnMEPTz00TaQEHq90',
};

// export default ({ }) => ({
//     // ...
//     'users-permissions': {
//       config: {
//         jwt: {
//           expiresIn: '7d',
//         },
//       },
//     },
//     // ...
//   });
