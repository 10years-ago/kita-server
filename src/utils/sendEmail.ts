import nodemailer from 'nodemailer'

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string,pin: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();
  // console.log("testAccount", testAccount);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service:"QQ",
    auth: {
      user: "414578531@qq.com", // generated ethereal user
      pass: "sprkzipddbubbjhf", // generated ethereal password
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"这真的是个验证码" <414578531@qq.com>', // sender address
    to, // list of receivers
    subject: "这是个验证码", // Subject line
    html:`<div>${pin}</div>`
  });
}
