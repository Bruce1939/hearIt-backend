const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./../Models/userModel");
const { JWT_SECRET } = require("./../Constants/index");
const { sendMail } = require("../mailer/sendMail")
const { Encrypt, Decrypt } = require("../Crypto/crypto")
const querystring = require('querystring');



function generateActivationCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


const signUpController = async (req, res) => {
    const { name, username, email, password } = req.body;

    try {
        // check for invalid request
        if (!name || !username || !email || !password)
            return res.json({ error: "invalid credentials" });

        // check credentials against db data
        const userExists = await User.findOne({ email });
        if (userExists) return res.json({ error: "user already exists" });

        // check if username is not taken
        const usernameTaken = await User.findOne({ username });
        if (usernameTaken) return res.json({ error: "Username is in use" });

        // hash password if user exists
        const hashedPassword = await bcrypt.hash(password, 10);

        // Activation Code
        const activationCode = generateActivationCode(10);

        // save user with hashed password
        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
            activationCode: activationCode
        });

        // Creating Message For Mail Verifications
        var getParams = encodeURIComponent(Encrypt(`username=${username}&code=${activationCode}`))
        var link = `localhost:5000/auth/verify?activationCode=${getParams}`
        console.log(link)

        // const mailMessage = `Click here to verify your account <a href="localhost:5000/auth/verify?${getParams}" target="_blank">Verify</a>`
        const mailMessage = `<!DOCTYPE html>
        <html>
        <head>
        
          <meta charset="utf-8">
          <meta http-equiv="x-ua-compatible" content="ie=edge">
          <title>Email Confirmation</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
          /**
           * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
           */
          @media screen {
            @font-face {
              font-family: 'Source Sans Pro';
              font-style: normal;
              font-weight: 400;
              src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
            }
            @font-face {
              font-family: 'Source Sans Pro';
              font-style: normal;
              font-weight: 700;
              src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
            }
          }
          /**
           * Avoid browser level font resizing.
           * 1. Windows Mobile
           * 2. iOS / OSX
           */
          body,
          table,
          td,
          a {
            -ms-text-size-adjust: 100%; /* 1 */
            -webkit-text-size-adjust: 100%; /* 2 */
          }
          /**
           * Remove extra space added to tables and cells in Outlook.
           */
          table,
          td {
            mso-table-rspace: 0pt;
            mso-table-lspace: 0pt;
          }
          /**
           * Better fluid images in Internet Explorer.
           */
          img {
            -ms-interpolation-mode: bicubic;
          }
          /**
           * Remove blue links for iOS devices.
           */
          a[x-apple-data-detectors] {
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            text-decoration: none !important;
          }
          /**
           * Fix centering issues in Android 4.4.
           */
          div[style*="margin: 16px 0;"] {
            margin: 0 !important;
          }
          body {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /**
           * Collapse table borders to avoid space between cells.
           */
          table {
            border-collapse: collapse !important;
          }
          a {
            color: #1a82e2;
          }
          img {
            height: auto;
            line-height: 100%;
            text-decoration: none;
            border: 0;
            outline: none;
          }
          </style>
        
        </head>
          
        <body style="background-color: #e9ecef;">
        
          <!-- start preheader -->
          <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
            A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
          </div>
          <!-- end preheader -->
        
          <!-- start body -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
        
            <!-- start hero -->
            <tr>
              <td align="center" bgcolor="#e9ecef">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                      <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end hero -->
        
            <!-- start copy block -->
            <tr>
              <td align="center" bgcolor="#e9ecef">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
        
                  <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                      <p style="margin: 0;">Tap the button below to confirm your email address. If you didn't create an account with <a href="https://hearit.vercel.app/login.com">hearIt</a>, you can safely delete this email.</p>
                    </td>
                  </tr>
                  <!-- end copy -->
        
                  <!-- start button -->
                  <tr>
                    <td align="left" bgcolor="#ffffff">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                  <a href="${link}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">VERIFY</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- end button -->
        
                  <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                      <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                      <p style="margin: 0;"><a href="${link}" target="_blank">${link}</a></p>
                    </td>
                  </tr>
                  <!-- end copy -->
        
                  <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                      <p style="margin: 0;">Cheers,<br> hearIt</p>
                    </td>
                  </tr>
                  <!-- end copy -->
        
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end copy block -->
        
            
        
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end footer -->
        
          </table>
          <!-- end body -->
        
        </body>
        </html>`

        await sendMail("verify@hear-it.com", email, "Account Verification HearIt", mailMessage)

        // prepare json response: user
        const userToReturn = {
            id: user._id,
            name: user.name,
            username: user.username,
        };

        return res.json({ userDetails: userToReturn });
    } catch (error) {
        // on error return internal error
        console.log(error);
        return res.json({ internalError: error });
    }
};

const logInController = async (req, res) => {
    const { email, password } = req.body;

    try {
        // check for invalid request
        if (!email || !password)
            return res.json({ error: "invalid credentials" });

        // check credentials against db data
        const user = await User.findOne({ email });
        if(!user.isActive) return res.json({ error: "user is not activated" })
        if (!user) return res.json({ error: "user doesn't exists" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ error: "invalid credentials" });

        // on successful credential match generate tokens
        const payload = { userId: user._id };
        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
        const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

        // prepare json response: user
        const userToReturn = {
            id: user._id,
            name: user.name,
            username: user.username,
        };

        // prepare json response: tokens
        const tokens = {
            accessToken,
            refreshToken,
        };

        return res.json({ tokens, userDetails: userToReturn });
    } catch (error) {
        // on error return internal error
        console.log(error);
        return res.json({ internalError: error });
    }
};

var url = require('url');
const verifyAccount = async (req, res) => {
    decryptedMessage = Decrypt(decodeURIComponent(req.query.activationCode))
    splitedMessage = decryptedMessage.split('&')
    username = splitedMessage[0].split('=')[1]
    code = splitedMessage[1].split('=')[1]

    const user = await User.findOne({ username });

    if (!user) return res.json({ error: "user doesn't exists" });
    if(user.isActive) return res.json({messgae:"user already activated"})

    if (user.activationCode == code) {
        await User.findByIdAndUpdate(user._id, {
            isActive: true,
            activationCode: ''
        })
    } else {
        return res.json({ error: "activation code not valid or expired" });
    }
    return res.json({messgae:"user activated"})
}

module.exports = {
    signUpController,
    logInController,
    verifyAccount,
};
