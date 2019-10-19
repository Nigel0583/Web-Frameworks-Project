/* GET home page */
const about = function(req, res){
  res.render('generic-text', {
    title: 'About Loc8r',
    content: 'This website was be created to give detailed information about Formula 1 circuits. It will allow user to create accounts',
    content1: 'Formula One (also known as Formula 1 or F1) is the highest class of single-seater auto racing sanctioned by the Fédération Internationale de l\'Automobile (FIA) and owned by the Formula One Group',
    info: 'This website was created for Formula One fans for Formula One fans. Learn about Formula One circuits. Read and write reviews about your favourite and least favourite tracks.'
  });
};

const login = function(req, res){
  res.render('login-page', {
    title: 'Login',
    forgot:'Forgot your email or password?',
    logbtn: 'Log In',
    logh2:"Login Form",
    email: 'Email',
    pass: 'Password'
  });
};

const register = function(req, res){
  res.render('register-page', {
    title: 'Register',
    pageHead: 'Create an account.',
    signUp: 'Sign Up',
    already:'You already have an account? Login here.',
    regem: 'Email',
    paswd: "Password",
    passrep: 'Password (repeat)'
  });
};

module.exports = {
  about,
  login,
  register
};