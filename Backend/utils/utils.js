export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const getOtpHtml = (otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OTP Verification</title>
  </head>

  <body style="
    margin:0;
    padding:0;
    background-color:#f4f4f4;
    font-family:Arial,sans-serif;
  ">

    <div style="
      width:100%;
      padding:40px 0;
    ">

      <div style="
        max-width:400px;
        margin:auto;
        background:#ffffff;
        border-radius:12px;
        padding:30px;
        text-align:center;
        box-shadow:0 0 10px rgba(0,0,0,0.1);
      ">

        <h1 style="
          color:#111827;
          margin-bottom:10px;
        ">
          Verify Your Email
        </h1>

        <p style="
          color:#6b7280;
          font-size:15px;
          margin-bottom:25px;
        ">
          Use the OTP below to verify your account
        </p>

        <div style="
          background:#eef2ff;
          color:#4338ca;
          font-size:32px;
          font-weight:bold;
          letter-spacing:6px;
          padding:15px 20px;
          border-radius:10px;
          display:inline-block;
          margin-bottom:25px;
        ">
          ${otp}
        </div>

        <p style="
          color:#6b7280;
          font-size:14px;
          line-height:22px;
        ">
          This OTP is valid for 
          <strong>5 minutes</strong>.
        </p>

        <p style="
          color:#9ca3af;
          font-size:12px;
          margin-top:25px;
        ">
          If you didn’t request this, you can safely ignore this email.
        </p>

      </div>
    </div>

  </body>
  </html>
  `;
};