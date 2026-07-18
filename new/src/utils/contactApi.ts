export interface ContactFormInputs {
  name: string;
  email: string;
  message: string;
}

export const sendContactMessage = async (data: ContactFormInputs) => {
  const response = await fetch("http://localhost:8080/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.text(); // backend returns "OK"
};
