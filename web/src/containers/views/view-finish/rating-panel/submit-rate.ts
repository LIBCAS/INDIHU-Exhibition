type RateFormData = {
  rating: number;
  preferences: {
    topic: boolean;
    media: boolean;
    text: boolean;
    game: boolean;
  };
  text?: string;
};

export const submitRate = async (
  rateFormData: RateFormData,
  expoId: string
) => {
  try {
    const response = await fetch(`/api/exposition/${expoId}/rate`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(rateFormData),
    });

    return response.status === 200;
  } catch (error) {
    console.error("Rating dialog error: ", error);
    return false;
  }
};
