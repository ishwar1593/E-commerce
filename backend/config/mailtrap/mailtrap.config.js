import { MailtrapClient } from "mailtrap";

const TOKEN = "da84730e50298ccfd57496d67d61661e";

const mailTrapClient = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test For Medkart Ecommerce",
};

export { mailTrapClient, sender };
