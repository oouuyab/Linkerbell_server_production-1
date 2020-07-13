const nodemailer = require('nodemailer');


let link = process.env.SERVER_URL;

let team_account = 'linkerbell.team7000@gmail.com';

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_MAIL_ACCOUNT_ID,
    pass: process.env.GOOGLE_MAIL_ACCOUNT_PASSWORD,
  },
});

exports.sendSignupMail = async (user_data) => {
  let mailOptions = {
    from: team_account,
    to: user_data.email,
    subject: '[Linkerbell] 회원가입 인증',
    html: `링커벨 회원가입 인증 메일입니다.
      <br/><br/>
      아래 링크를 클릭하시면 회원가입이 완료됩니다.
      <br/>
      <br/>
      <a href = ${link}/users/activate/${user_data.email_token}>링커벨 회원가입 인증 링크</a>
      <br/><br/>
      감사합니다.`,
  };
  await transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('이메일 전송 완료: ' + info.response);
    }
  });
};

exports.sendResetPasswordMail = async (user_data) => {
  let mailOptions = {
    from: team_account,
    to: user_data.email,
    subject: '[Linkerbell] 계정 임시 비밀번호',
    html: `링커벨 계정 임시 비밀번호 안내 메일입니다.
      <br/><br/>
      아래의 임시 비밀번호를 입력하시면 로그인하실 수 있습니다.
      <br/>
      로그인 후에는 반드시 새로운 비밀번호로 변경해 주시기 바랍니다.
      <br/><br/>
      임시 비밀번호 : <b>${user_data.temp_pw}</b>
      <br/><br/>
      감사합니다.`,
  };
  await transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('이메일 전송 완료: ' + info.response);
    }
  });
};
