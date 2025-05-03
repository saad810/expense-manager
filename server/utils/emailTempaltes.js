export const advancedMinimalTemplate = ({ title, message, footer }) => `
  <div style="background:#ffffff; padding:40px 20px; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#333; max-width:600px; margin:auto; border:1px solid #eee; border-radius:8px;">
    <header style="border-bottom:1px solid #ddd; padding-bottom:16px; margin-bottom:24px;">
      <h1 style="font-size:24px; color:#2c3e50; margin:0;">${title}</h1>
    </header>
    
    <main style="font-size:16px; line-height:1.6;">
      ${message}
    </main>
    
    <footer style="border-top:1px solid #ddd; margin-top:24px; padding-top:16px; font-size:12px; color:#888;">
      ${footer || 'You are receiving this message from your Finance App.'}
    </footer>
  </div>
`;
