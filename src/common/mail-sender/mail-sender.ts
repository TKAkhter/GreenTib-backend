import { env } from "@/config/env";
import formData from "form-data";
import Mailgun from "mailgun.js";

let mg: ReturnType<Mailgun["client"]>["messages"] | null = null;

if (env.MAILGUN_API_KEY && env.MAILGUN_DOMAIN) {
  const mailgun = new Mailgun(formData);

  mg = mailgun.client({
    username: "api",
    key: env.MAILGUN_API_KEY,
  }).messages;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendMail = async (mail: any) => {
  if (!mg || !env.MAILGUN_DOMAIN) {
    console.warn("Mailgun not initialized, skipping sendMail");
    return;
  }

  return mg.create(env.MAILGUN_DOMAIN, mail);
};
