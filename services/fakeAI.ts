export const fakeAI = async (
  message: string
) => {
  const lower =
    message.toLowerCase();

  let location = "";
  let type = "";

  // LOCATION

  if (lower.includes("نابلس")) {
    location = "Nablus";
  }

  if (
    lower.includes("رام الله")
  ) {
    location = "Ramallah";
  }

  // TYPE

  if (lower.includes("شقة")) {
    type = "Apartment";
  }

  if (lower.includes("غرفة")) {
    type = "Room";
  }

  return {
    filters: {
      location,
      type,
    },

    reply:
      "لقيت لك بعض السكنات المناسبة ",
  };
};