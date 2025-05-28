export default {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }] // habilita el nuevo runtime de React 17+
  ]
};
