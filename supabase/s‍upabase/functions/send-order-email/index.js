import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  try {
    const { customerName, email, orderDetails } = await req.json();

    await resend.emails.send({
      from: "V6ix Collection <no-reply@v6ixcollection.com>",
      to: "v6ixcollection@gmail.com", // your admin email
      subject: `🛒 New Order from ${customerName}`,
      html: `
        <h2>New Order Notification</h2>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <h3>Order Details:</h3>
        <ul>
          ${orderDetails.map(
            (item) =>
              `<li>${item.name} — ₦${item.price} x ${item.quantity}</li>`
          ).join("")}
        </ul>
        <p>Check your dashboard for more info.</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(JSON.stringify({ success: false, error }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
