const TYPE_OPTIONS = {
  CHANGE_EMAIL: 'CHANGE_EMAIL',
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION'
} as const;

export type EmailVerificationType = typeof TYPE_OPTIONS[keyof typeof TYPE_OPTIONS];

export const emailVerificationMessage = (code: string, type: EmailVerificationType) => {
  const getTitle = () => {
    switch (type) {
      case TYPE_OPTIONS.CHANGE_EMAIL:
        return 'تأكيد تغيير البريد الإلكتروني';
      case TYPE_OPTIONS.EMAIL_VERIFICATION:
        return 'تم التحقق من البريد الإلكتروني';
      default:
        return 'تأكيد البريد الإلكتروني';
    }
  };

  const getMessage = () => {
    switch (type) {
      case TYPE_OPTIONS.CHANGE_EMAIL:
        return 'يرجى استخدام الرمز التالي لتأكيد تغيير بريدك الإلكتروني:';
      case TYPE_OPTIONS.EMAIL_VERIFICATION:
        return 'تم التحقق من بريدك الإلكتروني بنجاح! إليك رمز التأكيد:';
      default:
        return 'يرجى استخدام الرمز التالي لتأكيد بريدك الإلكتروني:';
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${getTitle()}</title>
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; margin-top: 40px; margin-bottom: 40px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <div style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V10C2 16 6 20.9 12 22C18 20.9 22 16 22 10V7L12 2Z" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 12L11 14L15 10" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            ${getTitle()}
          </h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <div style="text-align: center;">
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              ${getMessage()}
            </p>

            <!-- Code Container -->
            <div style="background: linear-gradient(135deg, #f8f9ff 0%, #e8efff 100%); border: 2px dashed #667eea; border-radius: 15px; padding: 30px; margin: 30px 0; position: relative; overflow: hidden;">
              <div style="position: absolute; top: -10px; right: -10px; width: 40px; height: 40px; background: #667eea; border-radius: 50%; opacity: 0.1;"></div>
              <div style="position: absolute; bottom: -15px; left: -15px; width: 60px; height: 60px; background: #764ba2; border-radius: 50%; opacity: 0.1;"></div>
              
              <p style="color: #667eea; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
                رمز التحقق
              </p>
              <div style="background: white; border-radius: 10px; padding: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); display: inline-block; position: relative; z-index: 1;">
                <span style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 3px; font-family: 'Courier New', monospace;">
                  ${code}
                </span>
              </div>
            </div>

            <!-- Timer Warning -->
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                ⏰ هذا الرمز صالح لمدة ساعة واحدة فقط
              </p>
            </div>

            <!-- Security Note -->
            <div style="background: #d1ecf1; border: 1px solid #b8daff; border-radius: 10px; padding: 15px; margin: 20px 0;">
              <p style="color: #0c5460; margin: 0; font-size: 14px;">
                🔒 إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة
              </p>
            </div>

            <!-- Instructions -->
            <div style="text-align: right; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
              <h3 style="color: #333; font-size: 16px; margin-bottom: 15px; display: flex; align-items: center;">
                <span style="margin-left: 10px;">📋</span>
                تعليمات الاستخدام:
              </h3>
              <ul style="color: #666; font-size: 14px; line-height: 1.6; text-align: right; padding-right: 20px;">
                <li style="margin-bottom: 8px;">انسخ الرمز أعلاه</li>
                <li style="margin-bottom: 8px;">الصقه في حقل التحقق في التطبيق</li>
                <li style="margin-bottom: 8px;">اضغط على زر التأكيد</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; margin: 0; line-height: 1.5;">
            هذه رسالة تلقائية، يرجى عدم الرد عليها.<br>
            إذا واجهت أي مشاكل، يرجى التواصل مع فريق الدعم.
          </p>
          <div style="margin-top: 20px;">
            <div style="display: inline-block; width: 30px; height: 2px; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 1px;"></div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};