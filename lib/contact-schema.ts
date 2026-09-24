export type ContactPayload = {
  name: string;
  phone: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

/** Validation for the "Send us a note" form. */
export function validateContact(data: Partial<ContactPayload>): ContactErrors {
  const errors: ContactErrors = {};
  const name = data.name?.trim() ?? "";
  const phone = data.phone?.trim() ?? "";
  const message = data.message?.trim() ?? "";

  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > 100) errors.name = "That name is a little long.";
  if (!/^[+\d][\d\s-]{6,}$/.test(phone)) errors.phone = "Please enter a phone number, e.g. 98XXXXXXXX.";
  if (message.length < 5) errors.message = "Please tell us what you need.";
  else if (message.length > 2000) errors.message = "Please keep your message under 2000 characters.";
  return errors;
}
