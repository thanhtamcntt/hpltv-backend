require('dotenv').config();

const emailExplain = (email, text) => `
   <div style="width: 100%; max-width:600px; margin: 0 auto">
        <div style="text-align: left; margin: 1.2rem 0">
            <img src=${
              process.env.IMAGE_BANNER
            } alt="image-banner-showhub" style="width: 150px; height: 30px"/>
        </div>
        <div style="width: 100%;margin: auto; font-family: Roboto, sans-serif; border: 1px solid #f0f0f0; text-align: left">
            <div style="padding: 20px;">
                <h2 style="margin: 0; margin-bottom: 30px; font-weight: 300; line-height: 1.5; font-size: 24px; color: #294661 !important;">Hello ${email},</h2>

                <p style="margin: 0; margin-bottom: 30px; color: #294661; font-size: 16px; font-weight: 300;">Your request for feedback has been received.</p>

                <p style="margin: 0;margin-bottom: 30px;color: #294661;font-size: 16px;font-weight: 300;">${text}</p>

                <p style="margin: 0;margin-bottom: 30px;color: #294661;font-size: 16px;font-weight: 300;">If you did not initiate this request, please contact us immediately at hoangphuocloc.phurieng@gmail.com.</p>

                <p style="margin: 0;margin-bottom: 30px;color: #294661;font-size: 16px;font-weight: 300;">Thank you,<br>The ShowHub Team</p>
            </div>
            <div style="background-color: #f8f8f8; padding: 10px; text-align: center; border-top: 1px solid #ddd;">
                <div>
                    <img src=${
                      process.env.IMAGE_BANNER
                    } alt="image-banner-showhub" style="width: 75px; height: 15px; margin-top: 1em"/>
                </div>
                <p>&copy; ${new Date(
                  Date.now(),
                ).getFullYear()} ShowHub. All rights reserved.</p>
            </div>
        </div>
   </div>
`;

module.exports = emailExplain;
