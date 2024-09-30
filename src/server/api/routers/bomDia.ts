import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { utapi } from "~/server/uploadthing";

export const bomDiaRouter = createTRPCRouter({
  getLatestBomDia: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.bomDia.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
  createBomDia: publicProcedure.mutation(async ({ ctx }) => {
    console.log(
      "----------------------------------------------------------------",
    );
    console.log("inside createBomDia");
    const imagemDeFundo = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A beautiful landscape",
      n: 1,
      size: "1024x1024",
    });

    if (!imagemDeFundo.data[0]) {
      throw new Error("Failed to generate image");
    }

    const image_url = imagemDeFundo.data[0].url;

    if (!image_url) {
      throw new Error("Failed to generate image");
    }

    const fraseMotivacional = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Crie uma frase motivacional bem genérica e rasa",
        },
      ],
      model: "gpt-3.5-turbo",
    });

    if (!fraseMotivacional.choices[0]) {
      throw new Error("Failed to generate fraseMotivacional");
    }

    const uploadedFile = await utapi.uploadFilesFromUrl(image_url);

    console.log(uploadedFile);

    const data = await ctx.db.bomDia.create({
      data: {
        imgaeUrl: uploadedFile.data?.url || "",
        fraseMotivacional: fraseMotivacional.choices[0].message.content || "",
        createdAt: new Date(),
      },
    });

    return data;
  }),
});
