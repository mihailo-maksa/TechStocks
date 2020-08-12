exports.registerEmailParams = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email]
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
          <html>
            <h1>TechStocks - Email Address Verification</h1>
            <p>Please click on the following link to verify your email address: </p>
            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
          </html>
        `
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "TechStocks - Email Address Verification"
      }
    }
  };
};

exports.forgotPasswordEmailParams = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email]
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
          <html>
            <h1>TechStocks - Reset Your Password</h1>
            <p>Please click on the following link to reset your password: </p>
            <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
          </html>
        `
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "TechStocks - Reset Your Password"
      }
    }
  };
};
