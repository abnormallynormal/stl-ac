import Brevo from "@getbrevo/brevo";

export async function POST(req: Request) {
  try {
    const { to, subject, text, html } = await req.json();

    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY as string
    );

    const recipients = to.map((email: string) => ({ email }));

    const emailData: Brevo.SendSmtpEmail = {
      sender: {
        email: "stlathletics0@gmail.com",
        name: "STL-AC",
      },
      to: recipients,
      subject,
      textContent: text,
      htmlContent: html || `<p>${text}</p>`,
      headers: {
        "X-Mailin-Track": "0",
        "X-Mailin-Track-Clicks": "0",
        "X-Mailin-Track-Opens": "0"
      }
    };

    const result = await apiInstance.sendTransacEmail(emailData);

    return Response.json({ success: true, result });
  } catch (err: any) {
    console.error("Email error:", err);
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
