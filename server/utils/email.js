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

exports.stockPublishedParams = (email, data) => {
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
            <h1>TechStocks - New Stock Published</h1>
            <p>A new stock titled <b>${
              data.name
            }</b> has just been published in the following categories: </p>
            ${data.categories
              .map((c) => {
                return `
                  <div>
                    <h2>${c.name}</h2>
                    <img src="${c.image.url}" alt="${c.name}" style="height:50px;" />
                    <h3>
                      <a href="${process.env.CLIENT_URL}/stocks/${c.slug}" target="_blank">Check it out!</a>
                    </h3>
                  </div>
                `;
              })
              .join("----------------------")}

            <br />
            
            <div style="display:inline-block;">
            <p>Do not wish to receive new notifications?</p>

            <p>Turn off the notifications from your <a href="${
              process.env.CLIENT_URL
            }/user/profile/update" target="_blank">dashboard</a> 
           by unchecking the categories for which you don't want to receive new notifications.</p>
            </div>
          </html>
        `
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "TechStocks - New Stock Published"
      }
    }
  };
};
